import { spawn } from 'node:child_process';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
const dir=await mkdtemp(path.join(tmpdir(),'chess-auth-'));
const server=spawn(process.execPath,['server/auth.mjs'],{env:{...process.env,AUTH_PORT:'3199',AUTH_DATA_DIR:dir,AUTH_ORIGINS:'http://localhost:5173'},stdio:['ignore','pipe','pipe']});
try {
 await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',()=>reject(new Error('Server exited')));});
 const request=(endpoint,input,cookie,origin='http://localhost:5173')=>fetch(`http://127.0.0.1:3199/api/auth/${endpoint}`,{method:input?'POST':'GET',headers:{Origin:origin,'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},body:input?JSON.stringify(input):undefined});
 const credentials={name:'Chess Player',email:'player@example.com',password:'strong-test-password'};
 let res=await request('me');assert.equal((await res.json()).user,null);
 res=await request('register',credentials);assert.equal(res.status,200);assert.equal((await res.json()).user.name,'Chess Player');
 const cookie=res.headers.get('set-cookie');assert(cookie.includes('HttpOnly'));assert(cookie.includes('SameSite=Strict'));
 res=await request('me',null,cookie);assert.equal((await res.json()).user.email,credentials.email);
 res=await request('profile',{name:'Updated Player'},cookie);assert.equal(res.status,200);assert.equal((await res.json()).user.name,'Updated Player');
 res=await request('me',null,cookie);assert.equal((await res.json()).user.name,'Updated Player');
 res=await request('profile',{name:'Intruder'});assert.equal(res.status,401);
 res=await request('profile',{name:'   '},cookie);assert.equal(res.status,400);
 const stored=await readFile(path.join(dir,'users.json'),'utf8');assert(!stored.includes(credentials.password));assert(JSON.parse(stored)[0].hash);assert.equal(JSON.parse(stored)[0].name,'Updated Player');
 res=await request('register',credentials);assert.equal(res.status,409);
 res=await request('login',{...credentials,password:'wrong-password'});assert.equal(res.status,401);
 res=await request('login',credentials);assert.equal(res.status,200);const loginCookie=res.headers.get('set-cookie');
 res=await request('logout',{},loginCookie);assert.equal(res.status,200);
 res=await request('me',null,loginCookie);assert.equal((await res.json()).user,null);
 res=await request('login',credentials,null,'https://untrusted.example');assert.equal(res.status,403);
 console.log('PASS: registration, hashed password storage, session restore, duplicate accounts, incorrect password, login, logout, origin checks, profile updates and persistence, unauthorized profile rejection.');
}finally{if(server.exitCode === null && server.signalCode === null){const ended=new Promise(resolve=>server.once('exit',resolve));server.kill();await ended;}await rm(dir,{recursive:true,force:true});}
