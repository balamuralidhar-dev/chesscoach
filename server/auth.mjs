import http from 'node:http';
import { randomBytes, scrypt as derive, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
const scrypt = promisify(derive);
const directory = process.env.AUTH_DATA_DIR || path.resolve('.data');
await mkdir(directory, { recursive: true, mode: 0o700 });
const file = path.join(directory, 'users.json');
let users;
try { users = JSON.parse(await readFile(file, 'utf8')); } catch (e) { if (e.code !== 'ENOENT') throw e; users = []; }
const sessions = new Map(), attempts = new Map();
const ttl = 7 * 24 * 60 * 60 * 1000;
const cookie = token => `chess_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${token ? ttl / 1000 : 0}${process.env.AUTH_SECURE_COOKIE === 'true' ? '; Secure' : ''}`;
const publicUser = ({id, name, email}) => ({id, name, email});
let mutations = Promise.resolve();
async function body(req) {
  let result = '';
  for await (const chunk of req) { result += chunk; if (Buffer.byteLength(result) > 8192) throw Object.assign(new Error('Request too large.'), { status: 413 }); }
  try { return JSON.parse(result); } catch { throw Object.assign(new Error('Invalid request.'), {status:400}); }
}
const server = http.createServer(async (req, res) => {
  const reply = (status, data) => { res.writeHead(status, {'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}); res.end(JSON.stringify(data)); };
  try {
    const token = req.headers.cookie?.split(';').map(p => p.trim()).find(p => p.startsWith('chess_session='))?.slice(14);
    const session = sessions.get(token);
    if (session && session.expires <= Date.now()) sessions.delete(token);
    if (req.method === 'GET' && req.url === '/api/auth/me') return reply(200, {user: session && session.expires > Date.now() ? publicUser(users.find(u => u.id === session.id)) : null});
    if (req.method !== 'POST') return reply(404, {error:'Not found.'});
    if (!req.headers.origin || !(process.env.AUTH_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173').split(',').includes(req.headers.origin)) return reply(403, {error:'This origin is not allowed.'});
    if (req.url === '/api/auth/logout') {sessions.delete(token);res.setHeader('Set-Cookie',cookie(''));return reply(200,{user:null});}
    if (req.url === '/api/auth/profile') {
      if (!session || session.expires <= Date.now()) return reply(401,{error:'Your session expired. Please sign in again.'});
      const input=await body(req);
      const name=typeof input.name === 'string' ? input.name.trim() : '';
      if (!name || name.length>60) return reply(400,{error:'Enter your name (up to 60 characters).'});
      const operation=mutations.then(async()=>{
        const current=users.find(u=>u.id===session.id);
        if(!current)throw Object.assign(new Error('Account not found.'),{status:401});
        const updated={...current,name};
        const next=users.map(u=>u.id===session.id ? updated : u);
        await writeFile(file+'.tmp',JSON.stringify(next),{mode:0o600});await rename(file+'.tmp',file);users=next;return updated;
      });
      mutations=operation.catch(()=>{});
      return reply(200,{user:publicUser(await operation)});
    }
    if (!['/api/auth/register','/api/auth/login'].includes(req.url)) return reply(404,{error:'Not found.'});
    const ip = req.socket.remoteAddress;
    const rate = attempts.get(ip);
    if (rate && rate.until > Date.now() && rate.count >= 20) return reply(429,{error:'Too many attempts. Try again in 15 minutes.'});
    attempts.set(ip, rate && rate.until > Date.now() ? {...rate,count:rate.count+1} : {count:1,until:Date.now()+900000});
    const input = await body(req);
    const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
    const password = typeof input.password === 'string' ? input.password : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || password.length < 8 || password.length > 128) return reply(400,{error:'Enter a valid email and a password of 8–128 characters.'});
    let user;
    if (req.url === '/api/auth/register') {
      const name = typeof input.name === 'string' ? input.name.trim() : '';
      if (!name || name.length > 60) return reply(400,{error:'Enter your name (up to 60 characters).'});
      const salt = randomBytes(16).toString('hex');
      const hash = (await scrypt(password,salt,64)).toString('hex');
      const operation = mutations.then(async () => {
        if (users.some(u => u.email === email)) throw Object.assign(new Error('An account already uses this email. Please sign in.'),{status:409});
        const candidate = {id:randomBytes(16).toString('hex'),name,email,salt,hash};
        const next = [...users,candidate];
        await writeFile(file+'.tmp',JSON.stringify(next),{mode:0o600});await rename(file+'.tmp',file);users=next;return candidate;
      });
      mutations = operation.catch(() => {}); user = await operation;
    } else {
      user = users.find(u => u.email === email);
      const hash = await scrypt(password,user?.salt || 'unknown-account',64);
      if (!user || !timingSafeEqual(hash,Buffer.from(user.hash,'hex'))) return reply(401,{error:'Email or password is incorrect.'});
    }
    if (token) sessions.delete(token);
    const nextToken = randomBytes(32).toString('hex');sessions.set(nextToken,{id:user.id,expires:Date.now()+ttl});
    res.setHeader('Set-Cookie',cookie(nextToken));return reply(200,{user:publicUser(user)});
  } catch(e) {if (!e.status) console.error('Authentication request failed:',e.message);reply(e.status || 500,{error:e.status ? e.message : 'Something went wrong. Please try again.'});}
});
setInterval(() => {for (const [key,s] of sessions) if(s.expires<=Date.now()) sessions.delete(key);for(const [key,a] of attempts)if(a.until<=Date.now())attempts.delete(key);},60000).unref();
server.listen(Number(process.env.AUTH_PORT || 3001),'127.0.0.1',()=>console.log('Authentication server ready'));
