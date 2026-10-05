import React, { useLayoutEffect, useRef } from 'react';
import { Chessground } from '@lichess-org/chessground';
import '@lichess-org/chessground/assets/chessground.base.css';
import '@lichess-org/chessground/assets/chessground.cburnett.css';
import { boardConfig } from './chessground-config.js';

export default function Chessboard(props) {
  const element = useRef(null), ground = useRef(null), latest = useRef(props);
  latest.current=props;
  const after = (origin,destination) => {
    latest.current.onMove?.(origin,destination);
    // chess.js owns the position, including illegal moves and promotion selection.
    ground.current?.set(boardConfig(latest.current,after));
    ground.current?.selectSquare(null);
  };
  useLayoutEffect(()=>{
    ground.current=Chessground(element.current,boardConfig(latest.current,after));
    return ()=>{ground.current?.destroy();ground.current=null;};
  },[props.interactive !== false && !!props.onMove]);
  useLayoutEffect(()=>{
    ground.current?.set(boardConfig(props,after));
    ground.current?.selectSquare(null);
  },[props.fen,props.orientation,props.interactive,props.coords,props.legalMoves,props.marks,props.arrows]);
  const place = e => {
    if(!props.onPlace)return;
    const bounds=element.current.getBoundingClientRect();
    const col=Math.floor((e.clientX-bounds.left)/bounds.width*8),row=Math.floor((e.clientY-bounds.top)/bounds.height*8);
    if(col<0 || col>7 || row<0 || row>7)return;
    const flipped=props.orientation==='black';
    props.onPlace('abcdefgh'[flipped ? 7-col : col]+(flipped ? row+1 : 8-row));
  };
  return <div className={`chessground-board ${props.onPlace ? 'scenario-board' : ''}`} onClick={place}>
    <div ref={element} className="cg-wrap" role="img" aria-label={`Chessboard, ${props.orientation === 'black' ? 'Black' : 'White'} perspective. ${props.fen?.split(' ')[1] === 'b' ? 'Black' : 'White'} to move.`} />

  </div>;
}
