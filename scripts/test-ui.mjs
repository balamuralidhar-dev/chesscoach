import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { writeFile, unlink, readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { Chess } from 'chess.js';
import { boardConfig } from '../src/chessground-config.js';
const chess = new Chess();
let config=boardConfig({fen:chess.fen(),legalMoves:chess.moves({verbose:true}),onMove:()=>{}},()=>{});
assert.deepEqual(config.movable.dests.get('e2'),['e3','e4']);assert(!config.movable.dests.get('e2').includes('e5'));
config=boardConfig({fen:chess.fen(),legalMoves:[],interactive:false,marks:{e4:'bad'},arrows:[{from:'e2',to:'e4',color:'blue'}]},()=>{});
assert(config.viewOnly);assert.equal(config.highlight.custom.get('e4'),'cc-mark-bad');assert.equal(config.drawable.autoShapes[0].brush,'blue');
const dom=new JSDOM('<div id="root"></div>',{url:'http://localhost:5173',pretendToBeVisual:true});
for(const key of ['window','document','navigator','HTMLElement','Event','MouseEvent','requestAnimationFrame','cancelAnimationFrame','localStorage'])Object.defineProperty(globalThis,key,{value:typeof dom.window[key]==='function' && key.includes('AnimationFrame') ? dom.window[key].bind(dom.window) : dom.window[key],configurable:true});
globalThis.ResizeObserver=class{observe(){} disconnect(){}};window.ResizeObserver=globalThis.ResizeObserver;
window.scrollTo=()=>{};globalThis.IS_REACT_ACT_ENVIRONMENT=true;
HTMLElement.prototype.getBoundingClientRect=function(){return {width:640,height:640,left:0,top:0,right:640,bottom:640};};
dom.window.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
const openingCatalog=JSON.parse(await readFile('public/openings/catalog.json','utf8'));
const engineCommands=[];
globalThis.Worker=class {
  constructor(){this.active=true;}
  postMessage(command){engineCommands.push(command);if(command.startsWith('position fen '))this.position=command;
    if(command==='uci' || command==='isready')queueMicrotask(()=>{if(this.active)this.onmessage?.({data:command==='uci' ? 'uciok' : 'readyok'});});
    if(command.startsWith('go ')){const [fen,moves]=this.position.slice(13).split(' moves ');const game=new Chess(fen);for(const m of moves?.split(' ') || [])game.move({from:m.slice(0,2),to:m.slice(2,4),promotion:m[4] || 'q'});const move=game.moves({verbose:true})[0];setTimeout(()=>{if(this.active)this.onmessage?.({data:`bestmove ${move.from}${move.to}${move.promotion || ''}`});},5);}
  }
  terminate(){this.active=false;}
};
let loggedIn=false, displayName='Test Player';
globalThis.fetch=async(url,options={})=>({ok:true,json:async()=>{if(url.includes('/openings/catalog.json'))return openingCatalog;if(url.endsWith('/logout'))loggedIn=false;else if(url.endsWith('/login'))loggedIn=true;else if(url.endsWith('/profile'))displayName=JSON.parse(options.body).name;return {user:loggedIn ? {id:'1',name:displayName,email:'test@example.com'} : null};}});
const output=await build({stdin:{contents:"export {default as App} from './src/App.jsx'; export {default as AuthGate} from './src/AuthGate.jsx'; export {default as Chessboard} from './src/Chessboard.jsx';",resolveDir:process.cwd(),loader:'jsx'},bundle:true,platform:'node',format:'esm',external:['react','react-dom','react-dom/*'],loader:{'.css':'empty'},write:false,define:{'import.meta.env.BASE_URL':'"/"'}});
await writeFile('.test-ui-components.mjs',output.outputFiles[0].text);
const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');
const root=createRoot(document.getElementById('root'));
const flush=async()=>{await act(async()=>{await new Promise(r=>setTimeout(r,30));});};
const click=async(node)=>{assert(node,'Missing click target');await act(async()=>node.dispatchEvent(new MouseEvent('click',{bubbles:true})));await flush();};
const byText=(selector,text)=>[...document.querySelectorAll(selector)].find(n=>n.textContent.trim()===text);
try {
 const {App,AuthGate,Chessboard}=await import('../.test-ui-components.mjs');
 await act(async()=>root.render(React.createElement(AuthGate,null,React.createElement(App))));await flush();
 assert(!document.querySelector('.auth-page'));assert.equal(document.querySelector('.cc-shell').dataset.ccTheme,'light');assert(document.querySelector('header').textContent.includes('Dashboard'));assert(document.querySelector('cg-board'));assert(document.querySelector('piece.white'));
 await click(byText('span','Play Chess').parentElement);assert(document.querySelector('.auth-page'));assert(document.querySelector('[hidden]'));
 await click(byText('button','← Back to browsing'));assert(!document.querySelector('.auth-page'));assert(document.querySelector('header').textContent.includes('Dashboard'));
 await click(byText('span','Play Chess').parentElement);
 const setValue=async(input,value)=>{await act(async()=>{Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value').set.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}));});};
 await setValue(document.querySelector('input[type=email]'),'test@example.com');await setValue(document.querySelector('input[type=password]'),'test-password');
 await act(async()=>document.querySelector('.auth-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));await flush();
 assert(!document.querySelector('.auth-page'));assert(document.querySelector('.play-setup'));assert(document.querySelector('header').textContent.includes('Play Chess'));assert(!document.querySelector('.play-credit'));assert(!document.querySelector('.side-options'));assert(!document.querySelector('.board-keyboard'));assert(document.querySelector('.play-board-panel').lastElementChild.classList.contains('play-board-frame'));assert(!document.querySelector('.play-board-panel .play-status'));assert(!document.querySelector('.play-board-panel .board-keyboard'));
 await click(document.querySelector('[aria-label="Open profile"]'));assert(document.querySelector('dialog[open]'));assert.equal(document.querySelector('#profile-email').value,'test@example.com');
 await setValue(document.querySelector('#profile-name'),'Updated Player');
 await act(async()=>document.querySelector('.profile-dialog form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));await flush();assert(document.querySelector('.profile-saved'));assert.equal(document.querySelector('.header-profile').title,'Updated Player');
 await click(byText('button','Back to chess'));assert(!document.querySelector('dialog'));assert(document.querySelector('.play-setup'));
 const selectValue=async(input,value)=>{await act(async()=>{input.value=value;input.dispatchEvent(new Event('change',{bubbles:true}));});await flush();};
 await click(byText('button','＋ Create scenario'));assert(document.querySelector('.scenario-card'));
 await setValue(document.querySelector('[aria-label="Scenario name"]'),'Rook practice');
 await selectValue(document.querySelector('[aria-label="Scenario preset"]'),'2');
 await selectValue(document.querySelector('[aria-label="Play as"]'),'b');
 await click(byText('button','Save scenario'));assert(document.querySelector('.play-setup'));assert.equal(document.querySelector('[aria-label="Starting position"]').value,'Rook practice');assert(localStorage.getItem('chess-coach-scenarios').includes('Rook practice'));
 assert.equal(document.querySelector('.play-layout').children.length,3);assert(document.querySelector('.play-settings'));assert(document.querySelector('.moves-panel'));
 await click(byText('button','Play Stockfish →'));await flush();await flush();assert(document.querySelector('.play-active'));assert(engineCommands.some(c=>c.startsWith('position fen 8/5pk1/6p1/8/8/6P1/5PK1/R6r w')));assert(document.querySelector('.play-history').textContent.includes('1.'));
 assert.equal(document.querySelectorAll('[aria-label="Open profile"]').length,1);assert(!byText('button','Sign out'));
 await click(document.querySelector('[aria-label="Open profile"]'));
 await click(byText('button','Sign out'));assert(!document.querySelector('.auth-page'));assert(document.querySelector('header').textContent.includes('Dashboard'));
 await click(byText('span','Learn Openings').parentElement);await flush();assert.equal(document.querySelectorAll('.opening-result').length,24);assert(document.querySelector('.opening-library-heading').textContent.includes('3,864'));assert(!document.querySelector('.opening-library a'));
 await setValue(document.querySelector('#opening-search'),'Najdorf');await flush();assert([...document.querySelectorAll('.opening-result')].every(n=>n.textContent.includes('Najdorf')));
 await click(document.querySelector('.opening-result'));assert(document.querySelector('.opening-detail'));assert(!document.querySelector('.opening-detail a'));await click(document.querySelector('[aria-label="Next move"]'));assert(document.querySelector('.opening-step').textContent.includes('Move 1'));
 await click(byText('button','← All openings'));assert.equal(document.querySelector('#opening-search').value,'Najdorf');
 let moved;
 await act(async()=>root.render(React.createElement(Chessboard,{fen:chess.fen(),interactive:false,legalMoves:[],onMove:()=>{}})));await flush();assert(document.querySelector('cg-board'));assert(!document.querySelector('.board-keyboard'));
 await act(async()=>root.render(React.createElement(Chessboard,{fen:chess.fen(),interactive:true,legalMoves:chess.moves({verbose:true}),onMove:(a,b)=>{moved=[a,b];}})));await flush();assert(!document.querySelector('.board-keyboard'));
 const {Chessground}=await import('@lichess-org/chessground');const mount=document.createElement('div');document.body.append(mount);const cg=Chessground(mount,{...boardConfig({fen:chess.fen(),interactive:true,legalMoves:chess.moves({verbose:true}),onMove:()=>{}},(a,b)=>{moved=[a,b];}),trustAllEvents:true});
 const board=mount.querySelector('cg-board');
 const squareClick=async(x,y)=>{await act(async()=>{board.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,clientX:x,clientY:y,button:0}));document.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,clientX:x,clientY:y,button:0}));});await flush();};
 await squareClick(360,520);assert(document.querySelector('square.move-dest'));
 await squareClick(360,360);assert.deepEqual(moved,['e2','e4']);cg.destroy();mount.remove();
 console.log('PASS: legal Chessground destinations and actual click move; public dashboard; Play triggers login; cancel returns to browsing; login resumes Play; logout restores public dashboard; single profile entry, profile editing, no content below board, full opening catalog search and replay; Light default; scenario save and Stockfish play from custom FEN.');
}finally{await act(async()=>root.unmount());await unlink('.test-ui-components.mjs');dom.window.close();}
