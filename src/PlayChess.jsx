import React, { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import Chessboard from './Chessboard.jsx';
import ChessPiece from './ChessPiece.jsx';
import { useAuth } from './auth-context.js';
import ScenarioEditor from './ScenarioEditor.jsx';
import { DEFAULT_POSITION, piecesFromFen, positionFen, validateScenario, enginePosition, loadScenarios } from './scenarios.js';

export default function PlayChess({ coords }) {
  const auth = useAuth();
  const initialFen=useRef(DEFAULT_POSITION);
  const [scenarios,setScenarios]=useState(loadScenarios);
  const [editor,setEditor]=useState(null);
  const [scenarioError,setScenarioError]=useState('');
  const game = useRef(new Chess()).current;
  const [fen, setFen] = useState(game.fen());
  const [phase, setPhase] = useState('setup');
  const [draft, setDraft] = useState({ mode: 'engine', side: 'w', skill: '3', startFen: DEFAULT_POSITION, scenarioName: '' });
  const [showHelp, setShowHelp] = useState(false);
  const [mode, setMode] = useState('engine');
  const [side, setSide] = useState('w');
  const [flipped, setFlipped] = useState(false);
  const [skill, setSkill] = useState('3');
  const [epoch, setEpoch] = useState(0);
  const [engineState, setEngineState] = useState('loading');
  const [promotion, setPromotion] = useState(null);
  const [message, setMessage] = useState('');
  const engine = useRef(null);
  const historyRef = useRef(null);
  useEffect(() => { if (historyRef.current) historyRef.current.scrollTop = historyRef.current.scrollHeight; }, [fen]);
  const update = () => { setFen(game.fen()); setMessage(''); setPromotion(null); };

  // A fresh worker on cancellation prevents an old bestmove affecting a new position.
  useEffect(() => {
    if (phase !== 'playing' || mode !== 'engine') { setEngineState('local'); return; }
    let worker;
    let active = true;
    let watchdog;
    let searchFen;
    const fail = () => { if (active) { setEngineState('error'); setMessage('Stockfish could not load. Retry the engine or choose two players.'); } };
    try { worker = new Worker(`${import.meta.env.BASE_URL}engine/stockfish-19-lite-single.js`); }
    catch { fail(); return; }
    engine.current = worker;
    setEngineState('loading');
    watchdog = setTimeout(fail, 30000);
    worker.onerror = fail;
    worker.onmessage = ({ data }) => {
      if (!active || typeof data !== 'string') return;
      for (const line of data.split('\n')) {
        if (line === 'uciok') {
          worker.postMessage(`setoption name Skill Level value ${skill}`);
          worker.postMessage('ucinewgame');
          worker.postMessage('isready');
        }
        if (line === 'readyok') { clearTimeout(watchdog); setEngineState('ready'); }
        if (line.startsWith('bestmove ') && searchFen === game.fen()) {
          clearTimeout(watchdog);
          const uci = line.split(' ')[1];
          try { game.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] || 'q' }); update(); setEngineState('ready'); }
          catch { fail(); }
        }
      }
    };
    worker.postMessage('uci');
    worker.search = () => {
      searchFen = game.fen();
      worker.postMessage(enginePosition(initialFen.current,game.history({verbose:true})));
      worker.postMessage(`go movetime ${skill === '3' ? 350 : skill === '10' ? 700 : 1200}`);
      watchdog = setTimeout(fail, 15000);
    };
    return () => { active = false; clearTimeout(watchdog); worker.terminate(); engine.current = null; };
  }, [mode, skill, side, epoch, game, phase]);

  useEffect(() => {
    if (phase === 'playing' && mode === 'engine' && engineState === 'ready' && game.turn() !== side && !game.isGameOver()) {
      setEngineState('thinking'); engine.current?.search();
    }
  }, [fen, engineState, mode, side, game, phase]);

  const canMove = phase === 'playing' && !game.isGameOver() && !promotion && (mode === 'local' || (game.turn() === side && engineState === 'ready'));
  const move = (from, to, piece) => {
    if (!canMove && !piece) return;
    const choices = game.moves({ square: from, verbose: true }).filter(m => m.to === to);
    if (!choices.length) { setMessage('That move is not legal. Choose a highlighted square.'); return; }
    if (!piece && choices.some(m => m.promotion)) { setPromotion({ from, to }); return; }
    try { game.move({ from, to, promotion: piece || 'q' }); update(); } catch { setMessage('That move is not legal.'); }
  };
  const undo = () => {
    if (!game.history().length) return;
    game.undo();
    if (mode === 'engine' && game.turn() !== side && game.history().length) game.undo();
    update(); setEpoch(n => n + 1);
  };
  const history = game.history({ verbose: true });
  const historyRows=[];
  for(const [i,m] of history.entries()) {const number=Number(m.before.split(' ')[5]);let row=historyRows.at(-1);if(!row || row.number!==number){row={number};historyRows.push(row);}row[m.color]={san:m.san,latest:i===history.length-1};}
  const last = history.at(-1);
  const marks = last ? { [last.from]: 'last', [last.to]: 'last' } : {};
  if (game.isCheck()) for (const row of game.board()) for (const p of row) if (p?.type === 'k' && p.color === game.turn()) marks[p.square] = 'bad';
  let status = `${game.turn() === 'w' ? 'White' : 'Black'} to move${game.isCheck() ? ' · Check' : ''}`;
  if (game.isCheckmate()) status = `Checkmate · ${game.turn() === 'w' ? 'Black' : 'White'} wins`;
  else if (game.isStalemate()) status = 'Draw · Stalemate';
  else if (game.isThreefoldRepetition()) status = 'Draw · Threefold repetition';
  else if (game.isInsufficientMaterial()) status = 'Draw · Insufficient material';
  else if (game.isDraw()) status = 'Draw · Fifty-move rule';
  const exportGame = () => {
    const blob = new Blob([game.pgn()], { type: 'application/x-chess-pgn' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'chess-game.pgn'; a.click(); URL.revokeObjectURL(url);
  };
  const begin = config => {
    try {const position=validateScenario(config.startFen);auth.requireAuth(()=>{initialFen.current=position;game.load(position);setSkill(config.skill);setSide(config.side);setMode(config.mode);setFlipped(config.side==='b');update();setEpoch(n=>n+1);setPhase('playing');});}catch(e){setScenarioError(e.message);}
  };
  const startGame = () => begin(draft);
  const createScenario = () => {setScenarioError('');setEditor({name:'',fen:draft.startFen,turn:draft.startFen.split(' ')[1],side:'w',piece:'P',input:draft.startFen});setPhase('editing');};
  const changeEditor = patch => {setEditor(e=>({...e,...patch}));setScenarioError('');};
  const preset = position => {changeEditor({fen:position,turn:position.split(' ')[1],input:position});};
  const place = square => {const pieces=piecesFromFen(editor.fen);if(editor.piece==='erase')delete pieces[square];else pieces[square]=editor.piece;const position=positionFen(pieces,editor.turn);changeEditor({fen:position,input:position});};
  const importPosition = () => {try{const position=new Chess(editor.input.trim()).fen();preset(position);}catch(e){setScenarioError(e.message);}};
  const saveScenario = play => {
    try {
      const position=validateScenario(editor.fen);const name=editor.name.trim();if(!name)throw new Error('Give your scenario a name.');
      const entry={name,fen:position,side:editor.side};const saved=[entry,...scenarios.filter(s=>s.name!==name)].slice(0,30);
      localStorage.setItem('chess-coach-scenarios',JSON.stringify(saved));setScenarios(saved);
      const config={...draft,startFen:position,scenarioName:name,side:editor.side,mode:'engine'};setDraft(config);setScenarioError('');
      if(play)begin(config);else{setPhase('setup');setMessage(`Saved “${name}”. Choose Start game when you’re ready.`);}
    }catch(e){setScenarioError(e.message || 'Could not save the scenario.');}
  };
  const backToSetup = () => {setDraft(d=>({...d,mode,side,skill,startFen:initialFen.current}));setPhase('setup');setPromotion(null);setMessage('');setScenarioError('');setEpoch(n=>n+1);};
  const displayMode = phase === 'setup' ? draft.mode : mode;
  const displaySide = phase === 'setup' ? draft.side : side;
  const player = color => displayMode === 'engine' ? (color === displaySide ? 'You' : 'Stockfish') : (color === 'w' ? 'White player' : 'Black player');
  const playerBar = color => <div className={`play-player ${phase === 'playing' && game.turn() === color && !game.isGameOver() ? 'is-turn' : ''}`}><div className="player-identity"><span className={`player-avatar ${color}`}><ChessPiece type="k" white={color === 'w'} /></span><div><strong>{player(color)}</strong><small>{color === 'w' ? 'White pieces' : 'Black pieces'}</small></div></div><span className="turn-label">{phase === 'playing' && game.turn() === color && !game.isGameOver() ? 'To move' : color === displaySide && displayMode === 'engine' ? 'Your side' : ''}</span></div>;
  return <div className="play-layout">
    <section className="play-board-panel">
      <div className="play-heading"><div><span className="play-eyebrow">PLAY • LEARN • IMPROVE</span><h1>{phase === 'editing' ? 'Build your scenario.' : phase === 'setup' ? 'Make your next move.' : 'Your game.'}</h1></div><button className="play-help-button" onClick={() => setShowHelp(h => !h)} aria-expanded={showHelp}>How to play</button></div>
      <div className="play-board-frame"><Chessboard key={`${epoch}-${flipped}`} fen={phase === 'editing' ? editor.fen : phase === 'setup' ? draft.startFen : fen} orientation={flipped ? 'black' : 'white'} interactive={canMove} onMove={move} onPlace={phase === 'editing' ? place : undefined} marks={phase === 'playing' ? marks : {}} coords={coords} legalMoves={canMove ? game.moves({ verbose: true }) : []} /></div>
    </section>
    <aside className="play-settings">
    {showHelp && <div className="play-help"><strong>Choose how to play</strong><p>Start a game, or create a scenario by placing pieces on the board. Choose a piece and tap a destination to make a legal move.</p><button onClick={() => setShowHelp(false)}>Got it</button></div>}
    {phase === 'editing' ? <ScenarioEditor editor={editor} onChange={changeEditor} onPreset={preset} onImport={importPosition} onSave={()=>saveScenario(false)} onPlay={()=>saveScenario(true)} onCancel={()=>{setPhase('setup');setScenarioError('');}} error={scenarioError}/> : phase === 'setup' ? <section className="play-card play-setup"><span className="play-eyebrow">SET UP YOUR MATCH</span><h2>Make it your game</h2><p className="play-description">Play from the start or build a position to practice.</p><label>Opponent<select value={draft.mode} onChange={e=>setDraft(d=>({...d,mode:e.target.value}))}><option value="engine">Stockfish</option><option value="local">A friend · same device</option></select></label>
      <label>Starting position<select aria-label="Starting position" value={draft.scenarioName} onChange={e=>{const entry=scenarios.find(s=>s.name===e.target.value);setDraft(d=>({...d,startFen:entry?.fen || DEFAULT_POSITION,side:entry?.side || 'w',scenarioName:entry?.name || ''}));setScenarioError('');setMessage('');}}><option value="">Standard chess</option>{scenarios.map(s=><option key={s.name}>{s.name}</option>)}</select></label>
      <button className="create-scenario" onClick={createScenario}>＋ Create scenario</button>
      {draft.mode === 'engine' && <label>Challenge<select value={draft.skill} onChange={e => setDraft(d => ({...d,skill:e.target.value}))}><option value="3">Easy</option><option value="10">Medium</option><option value="20">Hard</option></select></label>}
      {scenarioError && <p className="play-error" role="alert">{scenarioError}</p>}{message && <p className="scenario-saved" role="status">{message}</p>}
      <button className="play-primary" onClick={startGame}>{draft.mode === 'engine' ? 'Play Stockfish' : 'Start game'} <span>→</span></button><small className="setup-note">No clock. Take your time.</small>
    </section> : <section className="play-card play-active"><span className="play-eyebrow">{game.isGameOver() ? 'GAME COMPLETE' : 'IN PLAY'}</span><h2>{game.isGameOver() ? 'Well played.' : 'Your game'}</h2>{draft.scenarioName && <p className="scenario-title">{draft.scenarioName}</p>}{playerBar('b')}{playerBar('w')}
      <div className="play-status" role="status" aria-live="polite"><span className={`status-dot ${engineState === 'thinking' ? 'thinking' : ''}`} />{status}<small>{game.isGameOver() ? 'Play again to try another position.' : engineState === 'error' ? 'Retry your opponent to continue.' : engineState === 'loading' ? 'Preparing your opponent…' : engineState === 'thinking' ? 'Stockfish is thinking…' : 'Select a piece to see its legal moves.'}</small></div>
      {message && <p className="play-error" role="alert">{message}</p>}
      {promotion && <div className="play-promotion" role="dialog" aria-label="Choose promotion"><strong>Choose your new piece</strong>{[['q','Queen'],['r','Rook'],['b','Bishop'],['n','Knight']].map(([p, label]) => <button autoFocus={p === 'q'} key={p} onClick={() => move(promotion.from, promotion.to, p)}><ChessPiece type={p} white={game.turn() === 'w'} />{label}</button>)}<button onClick={() => setPromotion(null)}>Cancel</button></div>}
      <div className="play-actions"><button disabled={!history.length || !!promotion} onClick={undo}>↶ Undo</button><button onClick={() => setFlipped(f => !f)}>⇅ Flip</button></div><button className="play-new-game" onClick={backToSetup}>{game.isGameOver() ? 'Play again' : 'New game'}</button>{engineState === 'error' && <button onClick={() => setEpoch(n => n + 1)}>Retry opponent</button>}
    </section>}
    </aside>
    <section className="play-card moves-panel"><div className="play-heading"><h2>Moves</h2><span className="move-count">{phase === 'playing' ? history.length : 0} played</span></div><div className="history-labels"><span>#</span><span>White</span><span>Black</span></div><div className="play-history" ref={historyRef}>{phase !== 'playing' || !history.length ? <div className="history-empty"><span>♧</span><strong>Your moves, right here</strong><p>Start playing to build<br/>your move history.</p></div> : historyRows.map(row => <div key={row.number}><span>{row.number}.</span><span className={row.w?.latest ? 'latest-move' : ''}>{row.w?.san || '—'}</span><span className={row.b?.latest ? 'latest-move' : ''}>{row.b?.san || '—'}</span></div>)}</div><button className="export-game" disabled={phase !== 'playing' || !history.length} onClick={exportGame}>↓ Download game</button></section>
  </div>;
}
