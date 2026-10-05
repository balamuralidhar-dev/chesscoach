import { Chess, DEFAULT_POSITION } from 'chess.js';
export { DEFAULT_POSITION };
export function piecesFromFen(fen) {
  const pieces={};for(const [row,line] of fen.split(' ')[0].split('/').entries()){let file=0;for(const ch of line){if(/[1-8]/.test(ch))file+=Number(ch);else pieces['abcdefgh'[file++]+(8-row)]=ch;}}return pieces;
}
export function positionFen(pieces, turn='w') {
  const rows=[];for(let rank=8;rank>=1;rank--){let row='',empty=0;for(const file of 'abcdefgh'){const p=pieces[file+rank];if(p){if(empty){row+=empty;empty=0;}row+=p;}else empty++;}if(empty)row+=empty;rows.push(row);}return `${rows.join('/')} ${turn} - - 0 1`;
}
export function validateScenario(fen) {
  const game=new Chess(fen);const pieces=game.board().flat().filter(Boolean);
  for(const color of ['w','b']){const own=pieces.filter(p=>p.color===color);if(own.length>16 || own.filter(p=>p.type==='p').length>8)throw new Error('Too many pieces for one side.');}
  const waiting=game.turn()==='w' ? 'b' : 'w';const king=pieces.find(p=>p.color===waiting && p.type==='k');
  if(game.isAttacked(king.square,game.turn()))throw new Error('The king of the side that just moved cannot be in check. Check the position and whose turn it is.');
  if(game.isGameOver())throw new Error('This position is already checkmate or a draw. Set up a position that can be played.');
  return game.fen();
}
export function enginePosition(initialFen, history) {
  const moves=history.map(m=>m.from+m.to+(m.promotion || '')).join(' ');
  return `position fen ${initialFen}${moves ? ' moves '+moves : ''}`;
}
export function loadScenarios() {
  try {const saved=JSON.parse(localStorage.getItem('chess-coach-scenarios') || '[]');return Array.isArray(saved) ? saved.filter(s=>typeof s.name==='string' && typeof s.fen==='string' && ['w','b'].includes(s.side)).slice(0,30) : [];} catch {return [];}
}
export const SCENARIO_PRESETS=[
  {name:'Starting position',fen:DEFAULT_POSITION},
  {name:'Rook endgame',fen:'8/5pk1/6p1/8/8/6P1/5PK1/R6r w - - 0 1'},
  {name:'Italian middlegame',fen:'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 w - - 0 7'},
];
