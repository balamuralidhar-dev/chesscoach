import React from 'react';

// Vector pieces keep their shape and contrast across devices and board sizes.
export default function ChessPiece({ type, white }) {
  const shapes = {
    p: <><circle cx="24" cy="13" r="6"/><path d="M20 19h8l-1 8 5 9H16l5-9z"/></>,
    r: <><path d="M13 9h6v5h5V9h5v5h6V9h1v12l-5 4 1 11H16l1-11-4-4z"/><path d="M17 22h14"/></>,
    n: <><path d="M15 36l2-9 10-7-9 3-6-4 7-11 12 4 5 9-2 15z"/><path d="M19 8l1-4 5 6M17 17l4-2"/><circle cx="27" cy="15" r="1.3" fill={white ? '#26312d' : '#f4f1e7'} stroke="none"/></>,
    b: <><path d="M24 5c-4 5-9 8-9 14 0 4 4 7 9 7s9-3 9-7c0-6-5-9-9-14z"/><path d="M26 12l-5 8M20 26l-4 10h16l-4-10"/></>,
    q: <><path d="M12 13l6 8 6-12 6 12 6-8-5 21H17z"/><circle cx="11" cy="11" r="3"/><circle cx="24" cy="7" r="3"/><circle cx="37" cy="11" r="3"/><path d="M17 29h14"/></>,
    k: <><path d="M24 4v10M19 8h10" fill="none"/><path d="M24 17c-7-9-15-2-10 6l5 9h10l5-9c5-8-3-15-10-6z"/><path d="M18 32h12l2 4H16z"/></>,
  };
  return <svg className="chess-piece" viewBox="0 0 48 48" aria-hidden="true" fill={white ? '#fff8e9' : '#293630'} stroke={white ? '#3a443d' : '#101b16'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{shapes[type]}<path d="M16 36h16l3 5H13z"/><path d="M13 42h22"/></svg>;
}
