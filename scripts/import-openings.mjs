import { mkdir, writeFile } from 'node:fs/promises';
import { Chess } from 'chess.js';
const repo='https://github.com/lichess-org/chess-openings';
const response=await fetch('https://api.github.com/repos/lichess-org/chess-openings/commits/master',{headers:{'User-Agent':'chess-coach'}});
if(!response.ok)throw new Error(`Could not resolve dataset version: ${response.status}`);
const {sha}=await response.json();
const raw=`https://raw.githubusercontent.com/lichess-org/chess-openings/${sha}`;
const files=await Promise.all(['a','b','c','d','e'].map(async(volume)=>{const r=await fetch(`${raw}/${volume}.tsv`);if(!r.ok)throw new Error(`Could not load ${volume}: ${r.status}`);return r.text();}));
const openings=[];
for(const text of files){const [header,...lines]=text.trim().split('\n');if(header.trim()!=='eco\tname\tpgn')throw new Error('Unexpected dataset columns');for(const line of lines){const [eco,name,pgn]=line.replace(/\r$/,'').split('\t');const game=new Chess();game.loadPgn(pgn);openings.push({id:`${eco}-${openings.length}`,eco,name,pgn,fen:game.fen()});}}
await mkdir('src/data',{recursive:true});await mkdir('public/openings',{recursive:true});
const license=await fetch(`${raw}/COPYING.txt`);if(!license.ok)throw new Error('Missing dataset license');
await writeFile('public/openings/LICENSE.txt',await license.text());
const metadata={source:repo,revision:sha,count:openings.length,names:new Set(openings.map(o=>o.name)).size};
await writeFile('src/data/openings-meta.json',JSON.stringify(metadata));
await writeFile('public/openings/catalog.json',JSON.stringify({...metadata,openings}));
console.log(`Imported and validated ${openings.length} opening lines (${new Set(openings.map(o=>o.name)).size} names), revision ${sha}`);
