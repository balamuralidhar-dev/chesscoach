import { spawn } from 'node:child_process';
const extra = process.argv.slice(2);
const children = [
  spawn(process.execPath,['server/auth.mjs'],{stdio:'inherit',env:{...process.env,AUTH_ORIGINS:process.env.AUTH_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173'}}),
  spawn(process.execPath,['node_modules/vite/bin/vite.js','--port','5173','--strictPort',...extra],{stdio:'inherit'}),
];
let stopping=false;
function stop(code=0) {if(stopping)return;stopping=true;for(const child of children)child.kill('SIGTERM');process.exitCode=code;}
for(const child of children){child.on('error',()=>stop(1));child.on('exit',code=>stop(code || 0));}
process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());
