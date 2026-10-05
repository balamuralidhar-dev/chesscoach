const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w';
const brushes = {
  green:{key:'green',color:'#5bd28a',opacity:0.85,lineWidth:10},
  amber:{key:'amber',color:'#f2b84b',opacity:0.85,lineWidth:10},
  red:{key:'red',color:'#ef6b6b',opacity:0.85,lineWidth:10},
  coach:{key:'coach',color:'#a596ff',opacity:0.85,lineWidth:10},
  blue:{key:'blue',color:'#7aa2ff',opacity:0.85,lineWidth:10},
};
export function boardConfig(props, after) {
  const fen = props.fen || START;
  const turn = fen.split(' ')[1] === 'b' ? 'black' : 'white';
  const interactive = props.interactive !== false && !!props.onMove;
  const dests = new Map();
  for(const move of props.legalMoves || []) {
    const list=dests.get(move.from) || [];
    if(!list.includes(move.to)) list.push(move.to);
    dests.set(move.from,list);
  }
  const marks=props.marks || {};
  return {
    fen, orientation:props.orientation === 'black' ? 'black' : 'white',turnColor:turn,
    coordinates:props.coords !== false,coordinatesOnSquares:true,
    viewOnly:!interactive,check:false,autoCastle:true,
    lastMove:Object.keys(marks).filter(square=>marks[square]==='last'),
    highlight:{lastMove:true,check:true,custom:new Map(Object.entries(marks).filter(([,mark])=>mark!=='last').map(([square,mark])=>[square,`cc-mark-${mark}`]))},
    animation:{enabled:!(typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches),duration:180},
    movable:{free:!props.legalMoves,color:interactive ? turn : undefined,dests,showDests:true,rookCastle:false,events:{after}},
    premovable:{enabled:false},draggable:{enabled:interactive,showGhost:true},selectable:{enabled:interactive},
    drawable:{enabled:interactive,visible:true,brushes,autoShapes:(props.arrows || []).filter(a=>a?.from && a?.to).map(a=>({orig:a.from,dest:a.to,brush:brushes[a.color] ? a.color : 'green'}))},
  };
}
