import React from 'react';
import Chessboard from './Chessboard.jsx';
import PlayChess from './PlayChess.jsx';
import { AuthContext } from './auth-context.js';
const OpeningLibrary = React.lazy(() => import('./OpeningLibrary.jsx'));

class App extends React.Component {
  static contextType = AuthContext;
  START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w';
  T = {
    base: ['e2e4', 'c7c6', 'd2d4', 'd7d5', 'b1c3'],
    baseSan: ['e4', 'c6', 'd4', 'd5', 'Nc3'],
    steps: [
      { exp: 'd5e4', san: '3...dxe4', short: 'dxe4', reply: 'c3e4', replySan: 'Nxe4', ctx: 'White just played 3.Nc3, defending the pawn on e4.', hint: 'Look at the tension between your d5 pawn and White’s e4 pawn.', hintSq: 'd5',
        explain: 'You temporarily give up the center but force White to spend time recovering the pawn.', simple: 'Take the pawn. White has to take back, and that gives your bishop a free road to f5.',
        why: 'Black wants to develop the light-squared bishop before playing ...e6.',
        next: [['4.', 'Nxe4', 'w'], ['', 'Bf5', 'b'], ['5.', 'Ng3', 'w'], ['', 'Bg6', 'b'], ['6.', 'Nf3', 'w'], ['', 'Nd7', 'b']], show: [['c3', 'e4', 'blue'], ['c8', 'f5', 'green']], ev: '+0.31' },
      { exp: 'c8f5', san: '4...Bf5', short: 'Bf5', reply: 'e4g3', replySan: 'Ng3', ctx: 'White recaptured with 4.Nxe4. The knight sits in the center.', hint: 'Which of your pieces gets locked in if you play ...e6 first?', hintSq: 'c8',
        explain: 'Develop the bishop outside the pawn chain — and hit the knight on e4 while you do it.', simple: 'Get the bishop out now, before your own pawns trap it.',
        why: 'Once ...e6 is played, the c8 bishop has no way out. Bf5 solves the Caro-Kann’s biggest problem piece.',
        next: [['5.', 'Ng3', 'w'], ['', 'Bg6', 'b'], ['6.', 'h4', 'w'], ['', 'h6', 'b'], ['7.', 'Nf3', 'w'], ['', 'Nd7', 'b']], show: [['e4', 'g3', 'blue'], ['f5', 'g6', 'green']], ev: '+0.24' },
      { exp: 'f5g6', san: '5...Bg6', short: 'Bg6', reply: 'g1f3', replySan: 'Nf3', ctx: '5.Ng3 attacks your bishop on f5.', hint: 'Keep the bishop on the same diagonal.', hintSq: 'f5',
        explain: 'Retreat, but stay on the h7–b1 diagonal — the bishop keeps watching White’s queenside.', simple: 'Step back to g6. The bishop is safe there and still useful.',
        why: 'Trading the bishop for the knight would only help White develop. Keep your best minor piece.',
        next: [['6.', 'Nf3', 'w'], ['', 'Nd7', 'b'], ['7.', 'h4', 'w'], ['', 'h6', 'b'], ['8.', 'h5', 'w'], ['', 'Bh7', 'b']], show: [['g1', 'f3', 'blue'], ['b8', 'd7', 'green']], ev: '+0.27' }
    ],
    alts: [
      [{ key: 'e6', uci: 'e7e6', san: '3...e6', ev: '+0.40', explain: '...e6 is a fine move, but it turns the game into a French Defense — your light-squared bishop gets locked behind the pawns, which is exactly what the Caro-Kann tries to avoid.', line: ['3...e6', '4.e5', 'c5', '5.Nf3'], down: 'Your c8 bishop becomes your worst piece.' },
       { key: 'Nf6', uci: 'g8f6', san: '3...Nf6', ev: '+0.70', explain: '...Nf6 develops, but invites 4.e5 — White kicks the knight and gains space with tempo.', line: ['3...Nf6', '4.e5', 'Nfd7', '5.f4'], down: 'White gains space and time in the center.' }],
      [{ key: 'Nf6', uci: 'g8f6', san: '4...Nf6', ev: '+0.45', explain: '...Nf6 is playable, but ...Bf5 is more natural because it develops the bishop outside the pawn chain before ...e6. After ...Nf6, White can trade on f6 and damage your structure.', line: ['4...Nf6', '5.Nxf6+', 'exf6', '6.c3'], down: 'After 5.Nxf6+ you recapture with a pawn and get doubled f-pawns.' },
       { key: 'Bg4', uci: 'c8g4', san: '4...Bg4', ev: '+0.55', explain: '...Bg4 gets the bishop out, but there is nothing to pin yet. White simply plays f3 or Nf3 and h3, and your bishop is chased around.', line: ['4...Bg4', '5.f3', 'Bf5', '6.Ng3'], down: 'The bishop gets kicked and you lose time.' },
       { key: 'e6', uci: 'e7e6', san: '4...e6', ev: '+0.50', explain: '...e6 is solid but shuts your light-squared bishop inside the pawn chain — the very problem the Caro-Kann exists to solve.', line: ['4...e6', '5.Nf3', 'Nf6', '6.Bd3'], down: 'A passive bishop for the rest of the game.' }],
      [{ key: 'Bd7', uci: 'f5d7', san: '5...Bd7', ev: '+0.60', explain: '...Bd7 keeps the bishop, but on a passive square where it blocks your queenside knight.', line: ['5...Bd7', '6.Nf3', 'Nf6', '7.Bd3'], down: 'Your pieces start tripping over each other.' },
       { key: 'Be6', uci: 'f5e6', san: '5...Be6', ev: '+0.80', explain: '...Be6 blocks your own e-pawn and gives White a target to hit with Nf4 or Ng5.', line: ['5...Be6', '6.Nf3', 'Nd7', '7.Bd3'], down: 'Your e-pawn is stuck and the bishop becomes a target.' }]
    ],
    why: [
      { r: ['Claims the center', 'Opens lines for the queen and bishop'], a: [['e2', 'e4', 'blue'], ['e4', 'd5', 'amber'], ['e4', 'f5', 'amber']], idea: 'White stakes a claim to the center right away.' },
      { r: ['Prepares ...d5 with support', 'Keeps the c8 bishop’s diagonal open'], a: [['c7', 'c6', 'blue'], ['c6', 'd5', 'amber']], idea: 'Black wants to hit e4 with ...d5 without locking in the light-squared bishop.' },
      { r: ['Builds a broad pawn center', 'Frees the c1 bishop'], a: [['d2', 'd4', 'blue'], ['d4', 'e5', 'amber'], ['d4', 'c5', 'amber']], idea: 'With pawns on e4 and d4, White controls the key central squares.' },
      { r: ['Challenges e4 directly', 'Backed up by the c6 pawn'], a: [['d7', 'd5', 'blue'], ['d5', 'e4', 'red'], ['c6', 'd5', 'green']], idea: 'This is the point of 1...c6: strike the center with a supported pawn.' },
      { r: ['Defends the e4 pawn', 'Develops toward the center', 'Keeps f3 free for the other knight'], a: [['b1', 'c3', 'blue'], ['c3', 'e4', 'green'], ['c3', 'd5', 'amber']], idea: 'White protects the center with a piece instead of a pawn, staying flexible.' },
      { r: ['Removes White’s central pawn', 'Forces Nxe4 — then your bishop develops with tempo'], a: [['d5', 'e4', 'blue']], idea: 'You trade central space for time and free development.' },
      { r: ['Wins back the pawn', 'Centralizes the knight'], a: [['c3', 'e4', 'blue'], ['e4', 'd6', 'amber'], ['e4', 'f6', 'amber']], idea: 'White’s knight is strong on e4 — but it can also be hit.' },
      { r: ['Develops outside the pawn chain', 'Attacks the knight on e4', 'Prepares ...e6 without trapping the bishop'], a: [['c8', 'f5', 'blue'], ['f5', 'e4', 'red']], idea: 'The signature move of the Caro-Kann main line.' },
      { r: ['Attacks the bishop on f5', 'Gains a tempo'], a: [['e4', 'g3', 'blue'], ['g3', 'f5', 'red']], idea: 'White uses the bishop as a target to speed up development.' },
      { r: ['Stays on the h7–b1 diagonal', 'Avoids trading your best minor piece'], a: [['f5', 'g6', 'blue'], ['g6', 'c2', 'amber']], idea: 'The bishop remains active and safe.' },
      { r: ['Develops a piece', 'Controls e5', 'Supports d4', 'Prepares castling'], a: [['g1', 'f3', 'blue'], ['f3', 'e5', 'amber'], ['f3', 'd4', 'green']], idea: 'White finishes kingside development and gets ready to castle before doing anything ambitious.' }
    ],
    planArrows: [['c8', 'f5', 'green'], ['b8', 'd7', 'coach'], ['g8', 'f6', 'coach'], ['e7', 'e6', 'amber']]
  };
  OPEN = [
    { id: 'caro', name: 'Caro-Kann Defense', moves: '1.e4 c6', uci: ['e2e4', 'c7c6'], side: 'Black', diff: 'Intermediate', pop: 'Very popular', mastery: 51, eco: 'B10–B19', time: '3h 20m', desc: 'A solid response to 1.e4 focused on challenging White’s center while developing safely.' },
    { id: 'italian', name: 'Italian Game', moves: '1.e4 e5 2.Nf3 Nc6 3.Bc4', uci: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4'], side: 'White', diff: 'Beginner', pop: 'Very popular', mastery: 82, eco: 'C50–C54', time: '2h 40m', desc: 'Quick development and a bishop aimed at f7 — classical, flexible, and easy to build on.' },
    { id: 'london', name: 'London System', moves: '1.d4 d5 2.Bf4', uci: ['d2d4', 'd7d5', 'c1f4'], side: 'White', diff: 'Beginner', pop: 'Popular', mastery: 68, eco: 'D02', time: '2h 10m', desc: 'A dependable setup you can play against almost anything, with clear plans and few forcing lines.' },
    { id: 'sicilian', name: 'Sicilian Defense', moves: '1.e4 c5', uci: ['e2e4', 'c7c5'], side: 'Black', diff: 'Advanced', pop: 'Most popular', mastery: 31, eco: 'B20–B99', time: '5h 30m', desc: 'Black fights for the center asymmetrically and plays for the win from move one.' },
    { id: 'qg', name: 'Queen’s Gambit', moves: '1.d4 d5 2.c4', uci: ['d2d4', 'd7d5', 'c2c4'], side: 'White', diff: 'Intermediate', pop: 'Very popular', mastery: 0, eco: 'D06–D69', time: '3h 45m', desc: 'White offers a wing pawn to pull Black’s d-pawn away from the center.' },
    { id: 'french', name: 'French Defense', moves: '1.e4 e6', uci: ['e2e4', 'e7e6'], side: 'Black', diff: 'Intermediate', pop: 'Popular', mastery: 0, eco: 'C00–C19', time: '3h 30m', desc: 'A sturdy pawn chain and counter-attacks against White’s center with ...c5 and ...f6.' },
    { id: 'kid', name: 'King’s Indian Defense', moves: '1.d4 Nf6 2.c4 g6', uci: ['d2d4', 'g8f6', 'c2c4', 'g7g6'], side: 'Black', diff: 'Advanced', pop: 'Popular', mastery: 0, eco: 'E60–E99', time: '4h 50m', desc: 'Let White build a big center, then attack it — and White’s king — later.' },
    { id: 'ruy', name: 'Ruy Lopez', moves: '1.e4 e5 2.Nf3 Nc6 3.Bb5', uci: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1b5'], side: 'White', diff: 'Advanced', pop: 'Very popular', mastery: 0, eco: 'C60–C99', time: '5h 10m', desc: 'Long-term pressure on e5 through the knight that defends it.' }
  ];
  P = [
    { uci: ['e2e4', 'c7c6', 'd2d4', 'd7d5', 'b1c3', 'd5e4', 'c3e4'], exp: 'c8f5', san: '4...Bf5', side: 'black', title: 'Caro-Kann · Main line', why: 'Develops the bishop outside the pawn chain before ...e6, with tempo on the e4 knight.', mistake: '4...e6?! — solid, but it locks your light-squared bishop in for the rest of the game.' },
    { uci: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'g8f6', 'f3g5', 'd7d5', 'e4d5'], exp: 'c6a5', san: '5...Na5', side: 'black', title: 'Two Knights · 4.Ng5', why: 'Hits the bishop on c4 so White can’t keep piling up on f7. You give a pawn for fast development.', mistake: '5...Nxd5? — natural, but 6.Nxf7! drags your king into the open.' },
    { uci: ['d2d4', 'd7d5', 'c1f4', 'c7c5', 'e2e3', 'b8c6', 'c2c3', 'd8b6'], exp: 'd1b3', san: '5.Qb3', side: 'white', title: 'London · ...Qb6 line', why: 'Meets the queen head-on and covers b2. If Black trades on b3, your a-pawn recaptures toward the center.', mistake: '5.Nf3? — natural development, but it leaves b2 hanging to 5...Qxb2.' }
  ];
  A = {
    uci: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'f8c5', 'c2c3', 'g8f6', 'd2d3', 'd7d6', 'e1g1', 'e8g8'],
    san: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd3', 'd6', 'O-O', 'O-O'],
    ev: [0.25, 0.3, 0.28, 0.3, 0.24, 0.3, 0.25, 0.2, 0.24, 0.22, 0.2, 0.24, 0.22],
    ideas: ['Claims the center and opens lines for the queen and bishop.', 'Black mirrors, fighting for the same central squares.', 'Develops with an attack on e5.', 'Defends e5 and develops.', 'Aims at f7, the weakest square in Black’s camp.', 'Black copies the idea, eyeing f2.', 'Prepares d4 and gives the bishop a retreat square later.', 'Develops and puts pressure on e4.', 'The slow approach — a solid center with no early commitments.', 'Supports e5 and opens the c8 bishop.', 'King to safety; the rook comes toward the center.', 'Both kings are safe. Now the real middlegame decisions begin.'],
    teach: [
      { exp: 'a2a4', san: '7.a4', fb: 'Space on the queenside, and your bishop now has a safe home on a2.', hint: 'Think about the queenside — Black would love to play ...b5.', reply: 'a7a5', replySan: '7...a5' },
      { exp: 'h2h3', san: '8.h3', fb: 'Takes g4 away from Black’s bishop, so your f3 knight can never be pinned.', hint: 'Which square could Black’s light bishop use to annoy your knight?', reply: 'c8e6', replySan: '8...Be6' },
      { exp: 'b1d2', san: '9.Nbd2', fb: 'Develops the last minor piece and starts the classic Nd2–f1–g3 reroute.', hint: 'You still have one undeveloped piece.', reply: 'h7h6', replySan: '9...h6' },
      { exp: 'f1e1', san: '10.Re1', fb: 'The rook supports e4 and clears f1 for your knight.', hint: 'Your knight wants to go to f1 — what has to move first?', reply: 'f8e8', replySan: '10...Re8' }
    ],
    alts: [
      { key: 'd4', uci: 'd3d4', san: '7.d4', ev: '+0.05', explain: 'Striking now opens the center before your pieces are ready. After 7...exd4 8.cxd4 Bb4, Black’s pieces spring to life.', down: 'You give Black the open position they want.' },
      { key: 'Ng5', uci: 'f3g5', san: '7.Ng5', ev: '−0.20', explain: 'An attack on f7 with only two pieces. After 7...h6 8.Nf3 you’ve simply lost two tempi.', down: 'Premature attacks cost time.' },
      { key: 'Bg5', uci: 'c1g5', san: '7.Bg5', ev: '+0.15', explain: 'Reasonable — it pins the knight. But after ...h6 you must decide between giving up the bishop or retreating.', down: 'Commits your bishop early.' }
    ]
  };
  R = {
    uci: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'f8c5', 'c2c3', 'g8f6', 'd2d3', 'd7d6', 'e1g1', 'e8g8', 'f1e1', 'a7a6', 'c4b3', 'c5a7', 'b1d2', 'c8e6', 'b3c2', 'f8e8', 'd2f1', 'h7h6', 'h2h3', 'd6d5', 'e4d5', 'e6d5', 'f1g3'],
    san: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd3', 'd6', 'O-O', 'O-O', 'Re1', 'a6', 'Bb3', 'Ba7', 'Nbd2', 'Be6', 'Bc2', 'Re8', 'Nf1', 'h6', 'h3', 'd5', 'exd5', 'Bxd5', 'Ng3'],
    cls: ['book', 'book', 'book', 'book', 'book', 'book', 'book', 'book', 'book', 'book', 'best', 'best', 'best', 'good', 'best', 'good', 'best', 'good', 'good', 'good', 'best', 'good', 'mistake', 'best', 'inacc', 'best', 'good'],
    notes: { 10: 'Castling before any action in the center — exactly right.', 12: 'The rook supports e4 and prepares Nbd2–f1.', 14: 'Tucks the bishop away from ...Na5 ideas.', 16: 'Starts the knight’s journey toward g3.', 18: 'Keeps your good bishop rather than trading on e6.', 20: 'The knight heads for g3, where it eyes f5 and h5.', 23: 'Black seizes the central break you allowed.', 25: 'Black’s bishop lands on a dominant central square.', 26: 'Back on track — the knight finally reaches g3.' },
    bad: {
      22: { better: 'd3d4', betterSan: '12.d4', why: 'You spent a tempo on a move that wasn’t necessary while the center needed immediate attention. With 12.d4 you stake your claim before Black does.' },
      24: { better: 'd1e2', betterSan: '13.Qe2', why: 'Exchanging on d5 hands Black’s bishop a beautiful central post. Keeping the tension with 13.Qe2 makes Black resolve it.' }
    }
  };
  GAMES = [
    { opp: 'kasparov_fan92', rating: 1288, result: 'Loss', color: 'White', opening: 'Italian Game', acc: 71, mistake: '12.h3', date: 'Sep 30' },
    { opp: 'm_tal_reborn', rating: 1201, result: 'Win', color: 'Black', opening: 'Caro-Kann Defense', acc: 84, mistake: '—', date: 'Sep 29' },
    { opp: 'pawnstorm', rating: 1174, result: 'Win', color: 'White', opening: 'London System', acc: 79, mistake: '—', date: 'Sep 28' },
    { opp: 'ellie_k', rating: 1240, result: 'Draw', color: 'Black', opening: 'Sicilian Defense', acc: 66, mistake: '3...e5?!', date: 'Sep 27' },
    { opp: 'nimzo_now', rating: 1192, result: 'Loss', color: 'Black', opening: 'Caro-Kann Defense', acc: 62, mistake: '4...e6?!', date: 'Sep 25' },
    { opp: 'quietmove', rating: 1163, result: 'Win', color: 'White', opening: 'Italian Game', acc: 81, mistake: '—', date: 'Sep 24' }
  ];
  Q = {
    due: [
      { op: 'Caro-Kann', after: '1.e4 c6 2.d4 d5 3.Nc3', uci: ['e2e4', 'c7c6', 'd2d4', 'd7d5', 'b1c3'], acc: 42, last: '2 days ago', side: 'black', pi: 0 },
      { op: 'Italian Game', after: '1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 d5 5.exd5', uci: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'g8f6', 'f3g5', 'd7d5', 'e4d5'], acc: 55, last: '3 days ago', side: 'black', pi: 1 },
      { op: 'London System', after: '1.d4 d5 2.Bf4 c5 3.e3 Nc6 4.c3 Qb6', uci: ['d2d4', 'd7d5', 'c1f4', 'c7c5', 'e2e3', 'b8c6', 'c2c3', 'd8b6'], acc: 61, last: 'Yesterday', side: 'white', pi: 2 },
      { op: 'Sicilian Defense', after: '1.e4 c5 2.Nf3 d6 3.d4', uci: ['e2e4', 'c7c5', 'g1f3', 'd7d6', 'd2d4'], acc: 38, last: '4 days ago', side: 'black', pi: 0 }
    ],
    learning: [
      { op: 'Caro-Kann · Advance', after: '1.e4 c6 2.d4 d5 3.e5', uci: ['e2e4', 'c7c6', 'd2d4', 'd7d5', 'e4e5'], acc: 58, last: 'Today', side: 'black', pi: 0 },
      { op: 'Italian Game', after: '1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3', uci: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'f8c5', 'c2c3'], acc: 70, last: 'Yesterday', side: 'white', pi: 1 },
      { op: 'London System', after: '1.d4 Nf6 2.Bf4', uci: ['d2d4', 'g8f6', 'c1f4'], acc: 64, last: '2 days ago', side: 'white', pi: 2 }
    ],
    mastered: [
      { op: 'Italian Game', after: '1.e4 e5 2.Nf3 Nc6 3.Bc4', uci: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4'], acc: 94, last: '6 days ago', side: 'white', pi: 1 },
      { op: 'London System', after: '1.d4 d5 2.Bf4', uci: ['d2d4', 'd7d5', 'c1f4'], acc: 91, last: '1 week ago', side: 'white', pi: 2 },
      { op: 'Caro-Kann · Exchange', after: '1.e4 c6 2.d4 d5 3.exd5 cxd5', uci: ['e2e4', 'c7c6', 'd2d4', 'd7d5', 'e4d5', 'c6d5'], acc: 89, last: '5 days ago', side: 'black', pi: 0 }
    ],
    weak: [
      { op: 'Caro-Kann', after: '1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4', uci: ['e2e4', 'c7c6', 'd2d4', 'd7d5', 'b1c3', 'd5e4', 'c3e4'], acc: 33, last: 'Yesterday', side: 'black', pi: 0 },
      { op: 'Sicilian Defense', after: '1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4', uci: ['e2e4', 'c7c5', 'g1f3', 'd7d6', 'd2d4', 'c5d4', 'f3d4'], acc: 29, last: '3 days ago', side: 'black', pi: 0 },
      { op: 'London System', after: '1.d4 d5 2.Bf4 c5 3.e3 Nc6 4.c3 Qb6', uci: ['d2d4', 'd7d5', 'c1f4', 'c7c5', 'e2e3', 'b8c6', 'c2c3', 'd8b6'], acc: 40, last: '2 days ago', side: 'white', pi: 2 }
    ]
  };
  frameRef = React.createRef();
  chatRef = React.createRef();
  state = Object.assign({
    screen: 'dashboard', obStep: 0, obLevel: null, obRating: '', obGoals: ['Opening preparation', 'Understand why moves are played'], obSide: 'Black', obPick: 'caro', theme: null, board: null, coords: true, depth: 'Standard', w: 1440, fl: 0,
    showEngine: false, tab: 'coach', whyIdx: 4, posNo: 4, sheet: false,
    chat: [{ role: 'coach', text: 'I’m looking at your position after 3.Nc3 — Black to move. Ask me anything about it.', actions: [] }],
    chatIn: '', chatBusy: false, chatArrows: [], chatMarks: {},
    libQ: '', libF: [], openId: 'caro',
    pView: 'queue', pTab: 'due', pIdx: 0, pPhase: 'ask', pTries: 0, pMarks: {}, pFlash: null, pAcc: [8, 10], pStreak: 5, pDone: false,
    aPly: 12, aMode: 'explain', aWi: null, tch: null, engineOpen: true,
    rPly: 22, pasteOpen: false, toast: null
  }, this.buildT(0));

  parse(fen) { const [pl, turn] = fen.split(' '); const b = {}; pl.split('/').forEach((row, i) => { let f = 0; for (const ch of row) { if (ch >= '1' && ch <= '8') f += +ch; else { b['abcdefgh'[f] + (8 - i)] = ch; f++; } } }); return { b, turn: turn || 'w' }; }
  ser(b, turn) { const rows = []; for (let r = 8; r >= 1; r--) { let s = '', e = 0; for (let f = 0; f < 8; f++) { const p = b['abcdefgh'[f] + r]; if (p) { if (e) { s += e; e = 0; } s += p; } else e++; } if (e) s += e; rows.push(s); } return rows.join('/') + ' ' + turn; }
  apply(fen, uci) {
    const from = uci.slice(0, 2), to = uci.slice(2, 4); const { b, turn } = this.parse(fen); const p = b[from]; if (!p) return fen;
    delete b[from];
    if ((p === 'K' || p === 'k') && Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) === 2) { const r = to[1]; if (to[0] === 'g') { b['f' + r] = b['h' + r]; delete b['h' + r]; } else { b['d' + r] = b['a' + r]; delete b['a' + r]; } }
    b[to] = p === 'P' && to[1] === '8' ? 'Q' : p === 'p' && to[1] === '1' ? 'q' : p;
    return this.ser(b, turn === 'w' ? 'b' : 'w');
  }
  line(ucis, start) { const out = [start || this.START]; ucis.forEach(u => out.push(this.apply(out[out.length - 1], u))); return out; }
  lastFen(ucis, start) { const l = this.line(ucis, start); return l[l.length - 1]; }
  lm(uci) { return uci ? { [uci.slice(0, 2)]: 'last', [uci.slice(2, 4)]: 'last' } : {}; }
  arr(list) { return (list || []).map(a => ({ from: a[0], to: a[1], color: a[2] })); }
  label(i, san) { return i % 2 === 0 ? `${i / 2 + 1}.${san}` : `${(i + 1) / 2}...${san}`; }
  guess(fen, from, to) { const b = this.parse(fen).b; const p = b[from]; const t = p.toLowerCase(); const cap = b[to] ? 'x' : ''; return t === 'p' ? (cap ? from[0] + 'x' + to : to) : t.toUpperCase() + cap + to; }
  toastMsg(t) { this.setState({ toast: t }); clearTimeout(this._tt); this._tt = setTimeout(() => this.setState({ toast: null }), 2600); }
  go(screen, extra) { if (['play','trainer'].includes(screen) && !this.context.user) { this.context.requireAuth(() => this.setState(Object.assign({screen,sheet:false},extra || {}))); return; } this.setState(Object.assign({ screen, sheet: false }, extra || {})); try { window.scrollTo(0, 0); } catch (e) {} }

  buildT(k) {
    const m = this.T.base.slice(), s = this.T.baseSan.slice();
    for (let i = 0; i < k; i++) { const st = this.T.steps[i]; m.push(st.exp, st.reply); s.push(st.short, st.replySan); }
    return { tMoves: m, tSan: s, tStep: k, tPhase: 'ask', tMarks: this.lm(m[m.length - 1]), tArrows: [], tWrong: null, hintLvl: 0, tFlash: null, simpler: false, wiKey: null, wiMiss: null, wiText: '' };
  }
  componentDidMount() {
    const el = this.frameRef.current; if (!el || !window.ResizeObserver) return;
    this.ro = new ResizeObserver(() => { const r = el.getBoundingClientRect(); this.setState({ w: r.width, fl: r.left }); });
    this.ro.observe(el);
  }
  componentDidUpdate() { if (!this.context.user && ['play','trainer'].includes(this.state.screen)) {this.setState({screen:'dashboard'});return;} const n = this.state.chat.length * 2 + (this.state.chatBusy ? 1 : 0); if (n !== this._lastChatN) { this._lastChatN = n; const c = this.chatRef.current; if (c) c.scrollTop = c.scrollHeight; } }
  componentWillUnmount() { this.ro && this.ro.disconnect(); clearTimeout(this._tt); clearTimeout(this._ft); clearTimeout(this._pt); clearTimeout(this._at); }

  trainerMove(from, to) {
    const s = this.state, fen = this.lastFen(s.tMoves); const b = this.parse(fen).b; const p = b[from];
    if (!p || p !== p.toLowerCase() || s.tFlash) return;
    const uci = from + to, step = this.T.steps[s.tStep];
    if (s.tPhase === 'done') return;
    const alts = this.T.alts[s.tStep] || [];
    if (s.tab === 'whatif' && s.tPhase === 'ask') {
      const alt = alts.find(a => a.uci === uci);
      if (alt) return this.setState({ wiKey: alt.key, wiMiss: null });
      if (uci !== step.exp) return this.setState({ wiKey: null, wiMiss: this.guess(fen, from, to) });
    }
    if (s.tPhase !== 'ask') return;
    if (uci === step.exp) {
      this.setState({ tMoves: [...s.tMoves, uci], tSan: [...s.tSan, step.short], tPhase: 'correct', tMarks: { [from]: 'last', [to]: 'good' }, tArrows: [], tWrong: null, hintLvl: 0, tab: s.tab === 'chat' ? 'chat' : 'coach', wiKey: null });
    } else {
      const alt = alts.find(a => a.uci === uci);
      const n = Math.floor(s.tMoves.length / 2) + 1;
      this.setState({ tFlash: { fen: this.apply(fen, uci), marks: { [from]: 'last', [to]: 'bad' } }, tWrong: { san: alt ? alt.san : `${n}...${this.guess(fen, from, to)}`, key: alt ? alt.key : null }, tab: s.tab === 'chat' ? 'chat' : 'coach' });
      clearTimeout(this._ft); this._ft = setTimeout(() => this.setState({ tFlash: null }), 850);
    }
  }
  trainerNext() {
    const s = this.state; if (s.tPhase !== 'correct') return; const st = this.T.steps[s.tStep];
    const last = s.tStep >= this.T.steps.length - 1;
    this.setState({ tMoves: [...s.tMoves, st.reply], tSan: [...s.tSan, st.replySan], tMarks: this.lm(st.reply), tArrows: [], simpler: false, tStep: last ? s.tStep : s.tStep + 1, tPhase: last ? 'done' : 'ask', tab: s.tab === 'chat' ? 'chat' : 'coach' });
  }
  whatIfAsk(text) {
    const t = (text || '').toLowerCase().replace(/[^a-z0-9]/g, ''); if (!t) return;
    const alts = this.T.alts[this.state.tStep] || []; const step = this.T.steps[this.state.tStep];
    const hit = alts.find(a => t.includes(a.key.toLowerCase()));
    if (hit) return this.setState({ wiKey: hit.key, wiMiss: null, wiText: '' });
    if (t.includes(step.short.toLowerCase().replace(/[^a-z0-9]/g, ''))) return this.setState({ wiKey: null, wiMiss: 'MAIN', wiText: '' });
    this.setState({ wiKey: null, wiMiss: text, wiText: '' });
  }

  canned(q) {
    const step = this.T.steps[this.state.tStep];
    const map = {
      'What should I do next?': { text: `Play ${step.san}. ${step.explain}`, actions: [{ label: 'Show move', arrows: [[step.exp.slice(0, 2), step.exp.slice(2, 4), 'green']] }, { label: 'Add to practice', kind: 'practice' }] },
      'Why is d4 important?': { text: 'With pawns on e4 and d4, White controls the center and frees the c1 bishop. But a big center is also a target — that’s why you hit it with ...d5.', actions: [{ label: 'Draw arrow', arrows: [['d4', 'e5', 'amber'], ['d4', 'c5', 'amber']] }, { label: 'Highlight square', sq: 'd4' }] },
      'What happens if I play Nf6?': { text: 'Here ...Nf6 isn’t a disaster, but White gets a useful gain of time — either e5 kicking the knight or a trade on f6 that damages your pawns.', actions: [{ label: 'Show move', arrows: [['g8', 'f6', 'amber']] }, { label: 'Try this position', kind: 'whatif', key: 'Nf6' }] },
      'Where should my bishop go?': { text: 'f5 — outside the pawn chain, before you play ...e6. From there it eyes White’s queenside and can never be locked in.', actions: [{ label: 'Draw arrow', arrows: [['c8', 'f5', 'green']] }, { label: 'Highlight square', sq: 'f5' }] },
      'What is White trying to do?': { text: 'White wants a big center and quick development. Soon White will try to chase your bishop with Ng3 and h4–h5 to grab kingside space.', actions: [{ label: 'Draw arrow', arrows: [['h2', 'h4', 'red'], ['g1', 'f3', 'blue']] }, { label: 'Highlight square', sq: 'h5' }] },
      'Show me the plan.': { text: 'Bishop to f5, knights to d7 and f6, then ...e6 and castle. Later, challenge the center with ...c5.', actions: [{ label: 'Show on board', arrows: this.T.planArrows }, { label: 'Add to practice', kind: 'practice' }] },
      'What mistake did I make?': this.state.tWrong ? { text: `You tried ${this.state.tWrong.san}. ${step.hint} The key move here was ${step.san}.`, actions: [{ label: 'Show move', arrows: [[step.exp.slice(0, 2), step.exp.slice(2, 4), 'green']] }, { label: 'Add to practice', kind: 'practice' }] } : { text: 'No mistakes in this position so far. Your most recent slip was forgetting ...Bf5 after 4.Nxe4 — it’s already in your review queue.', actions: [{ label: 'Try this position', kind: 'practice' }] }
    };
    return map[q];
  }
  async sendChat(text) {
    text = (text || '').trim(); if (!text || this.state.chatBusy) return;
    const msgs = [...this.state.chat, { role: 'user', text, actions: [] }];
    this.setState({ chat: msgs, chatIn: '', chatBusy: true });
    let reply = this.canned(text);
    if (reply) await new Promise(r => setTimeout(r, 650));
    else {
      try {
        if (!window.claude || !window.claude.complete) throw new Error('no');
        const s = this.state; const fen = this.lastFen(s.tMoves);
        const moves = s.tSan.map((m, i) => this.label(i, m)).join(' ');
        const out = await window.claude.complete(`You are a warm, clear chess coach. The student plays Black in the Caro-Kann. Current position FEN: ${fen}. Moves: ${moves}. Student asks: "${text}". Reply in at most 3 short sentences of plain human explanation (no engine numbers). Then on the final line output only JSON: {"arrow":["from","to"] or null,"square":"e4" or null}`);
        const lines = out.trim().split('\n'); let meta = {}; try { meta = JSON.parse(lines[lines.length - 1]); lines.pop(); } catch (e) {}
        const actions = []; if (meta.arrow) actions.push({ label: 'Draw arrow', arrows: [[meta.arrow[0], meta.arrow[1], 'coach']] }); if (meta.square) actions.push({ label: 'Highlight square', sq: meta.square }); actions.push({ label: 'Add to practice', kind: 'practice' });
        reply = { text: lines.join(' ').trim(), actions };
      } catch (e) {
        reply = { text: 'Good question. In this position, focus on finishing development: bishop to f5, knights to d7 and f6, then ...e6 and castle.', actions: [{ label: 'Show on board', arrows: this.T.planArrows }] };
      }
    }
    this.setState({ chat: [...msgs, { role: 'coach', text: reply.text, actions: reply.actions }], chatBusy: false });
  }
  runAction(a) {
    if (a.arrows) this.setState({ chatArrows: a.arrows, chatMarks: {} });
    else if (a.sq) this.setState({ chatMarks: { [a.sq]: 'focus' }, chatArrows: [] });
    else if (a.kind === 'practice') this.toastMsg('Added to your review queue');
    else if (a.kind === 'whatif') this.setState({ tab: 'whatif', wiKey: a.key });
  }

  pPuzzle() { return this.P[this.state.pIdx]; }
  startSession(i) { this.go('practice', { pView: 'session', pIdx: i || 0, pPhase: 'ask', pTries: 0, pMarks: {}, pFlash: null, pDone: false, pFen: null }); }
  practiceMove(from, to) {
    const s = this.state, P = this.pPuzzle(); if (s.pPhase !== 'ask' || s.pFlash) return;
    const fen = this.lastFen(P.uci); const p = this.parse(fen).b[from]; if (!p) return;
    if ((p === p.toUpperCase()) !== (P.side === 'white')) return;
    const uci = from + to;
    if (uci === P.exp) {
      const first = s.pTries === 0;
      this.setState({ pPhase: 'right', pFen: this.apply(fen, uci), pMarks: { [from]: 'last', [to]: 'good' }, pAcc: first ? [s.pAcc[0] + 1, s.pAcc[1] + 1] : s.pAcc, pStreak: first ? s.pStreak + 1 : s.pStreak });
    } else {
      const tries = s.pTries + 1;
      this.setState({ pFlash: { fen: this.apply(fen, uci), marks: { [from]: 'last', [to]: 'bad' } }, pTries: tries, pWrongSan: this.guess(fen, from, to), pAcc: s.pTries === 0 ? [s.pAcc[0], s.pAcc[1] + 1] : s.pAcc, pStreak: 0 });
      clearTimeout(this._pt); this._pt = setTimeout(() => this.setState({ pFlash: null, pPhase: tries >= 2 ? 'reveal' : 'ask' }), 800);
    }
  }
  practiceNext() { const s = this.state; if (s.pIdx >= this.P.length - 1) return this.setState({ pDone: true }); this.setState({ pIdx: s.pIdx + 1, pPhase: 'ask', pTries: 0, pMarks: {}, pFlash: null, pFen: null }); }

  aFens() { return this._af || (this._af = this.line(this.A.uci)); }
  startTeach() { this.setState({ aPly: 12, aMode: 'teach', aWi: null, tch: { step: 0, moves: [], phase: 'ask', missThis: 0, miss: 0, firstMiss: null, log: [], flash: null, marks: this.lm('e8g8') } }); }
  teachMove(from, to) {
    const s = this.state, t = s.tch; if (!t || t.phase !== 'ask' || t.flash) return;
    const base = this.aFens()[12]; const fen = this.lastFen(t.moves, base); const p = this.parse(fen).b[from];
    if (!p || p !== p.toUpperCase()) return;
    const st = this.A.teach[t.step], uci = from + to;
    if (uci === st.exp) {
      const log = [...t.log, { you: st.san, fb: st.fb, clean: t.missThis === 0, reply: '' }];
      this.setState({ tch: Object.assign({}, t, { moves: [...t.moves, uci], phase: 'good', marks: { [from]: 'last', [to]: 'good' }, log }) });
      clearTimeout(this._at);
      this._at = setTimeout(() => {
        const c = this.state.tch; if (!c) return; const lg = c.log.slice(); lg[lg.length - 1] = Object.assign({}, lg[lg.length - 1], { reply: st.replySan });
        const done = c.step >= this.A.teach.length - 1;
        this.setState({ tch: Object.assign({}, c, { moves: [...c.moves, st.reply], step: done ? c.step : c.step + 1, phase: done ? 'done' : 'ask', missThis: 0, marks: this.lm(st.reply), log: lg }) });
      }, 1100);
    } else {
      const g = this.guess(fen, from, to);
      this.setState({ tch: Object.assign({}, t, { flash: { fen: this.apply(fen, uci), marks: { [from]: 'last', [to]: 'bad' } }, missThis: t.missThis + 1, miss: t.miss + 1, firstMiss: t.firstMiss || { played: g, best: st.san } }) });
      clearTimeout(this._at); this._at = setTimeout(() => { const c = this.state.tch; if (c) this.setState({ tch: Object.assign({}, c, { flash: null }) }); }, 800);
    }
  }
  analysisMove(from, to) {
    if (this.state.aMode === 'teach') return this.teachMove(from, to);
    const uci = from + to; const alt = this.A.alts.find(a => a.uci === uci);
    if (this.state.aPly === 12 && alt) return this.setState({ aMode: 'whatif', aWi: alt.key });
    this.toastMsg('Use “Teach me from here” to play moves with your coach');
  }

  renderVals() {
    const s = this.state, p = this.props, self = this;
    const theme = s.theme || p.theme || 'light';
    const boardTheme = s.board || p.boardTheme || 'walnut';
    const empty = (p.demoData || 'Returning user') === 'New user';
    const vp = p.viewport || 'auto';
    const frameMax = { desktop: '1440px', tablet: '834px', mobile: '390px' }[vp] || 'none';
    const w = s.w, isMobile = w < 720, isTablet = w >= 720 && w < 1100;
    const sc = s.screen;
    const session = sc === 'practice' && s.pView === 'session';
    const isOnb = sc === 'onboarding';
    const chrome = !session && !isOnb;
    const obCan = s.obStep === 1 ? !!(s.obLevel || s.obRating) : s.obStep === 2 ? s.obGoals.length > 0 : s.obStep === 3 ? !!s.obPick : true;
    const sel = (on) => ({ border: on ? 'var(--coach)' : 'var(--border)', bg: on ? 'var(--coach-soft)' : 'var(--surface)' });
    const obLevels = [['Beginner', 'Below 800'], ['Improving', '800–1200'], ['Intermediate', '1200–1600'], ['Advanced', '1600+']].map(([t, r]) => { const on = s.obLevel === t; return Object.assign({ t, r, onClick: () => this.setState({ obLevel: t, obRating: '' }), ring: on ? 'var(--coach)' : 'var(--border-2)', dot: on ? 'var(--coach)' : 'transparent' }, sel(on)); });
    const obGoals = ['Opening preparation', 'Understand why moves are played', 'Improve middlegame plans', 'Analyze my games', 'Fix recurring mistakes', 'Learn tactical patterns'].map(t => { const on = s.obGoals.includes(t); return Object.assign({ t, onClick: () => this.setState({ obGoals: on ? s.obGoals.filter(x => x !== t) : [...s.obGoals, t] }), cb: on ? 'var(--coach)' : 'var(--border-2)', cf: on ? 'var(--coach)' : 'transparent', mark: on ? '✓' : '' }, sel(on)); });
    const obSides = ['White', 'Black'].map(o => ({ label: 'Play as ' + o, onClick: () => this.setState({ obSide: o, obPick: null }), bg: s.obSide === o ? 'var(--surface-3)' : 'transparent', color: s.obSide === o ? 'var(--text)' : 'var(--text-3)' }));
    const obOpenings = ['italian', 'london', 'qg', 'sicilian', 'caro', 'french', 'kid'].map(id => this.OPEN.find(o => o.id === id)).filter(o => o.side === s.obSide).map(o => Object.assign({ name: o.name, eco: o.eco, diff: o.diff, time: o.time, fen: this.lastFen(o.uci), orient: o.side.toLowerCase(), started: o.mastery > 0, w: o.mastery + '%', diffColor: o.diff === 'Beginner' ? 'var(--green)' : o.diff === 'Intermediate' ? 'var(--amber)' : 'var(--red)', onClick: () => this.setState({ obPick: o.id }) }, sel(s.obPick === o.id)));
    const obVals = {
      isOnb, ob0: isOnb && s.obStep === 0, ob1: isOnb && s.obStep === 1, ob2: isOnb && s.obStep === 2, ob3: isOnb && s.obStep === 3, obShowDots: s.obStep > 0,
      obDots: [0, 1, 2, 3].map(i => ({ w: i === s.obStep ? '22px' : '6px', bg: i <= s.obStep ? 'var(--text)' : 'var(--surface-3)' })),
      obLevels, obGoals, obSides, obOpenings, obRating: s.obRating, onObRating: (e) => this.setState({ obRating: e.target.value.replace(/[^0-9]/g, '').slice(0, 4), obLevel: null }),
      obHeroArrows: [{ from: 'd5', to: 'e4', color: 'green' }, { from: 'c8', to: 'f5', color: 'coach' }],
      obNextOp: obCan ? '1' : '.4', obNextCursor: obCan ? 'pointer' : 'not-allowed',
      obGetStarted: () => this.setState({ obStep: 1 }), obAlready: () => this.setState({ obStep: 1, obLevel: s.obLevel || 'Improving' }),
      obNext: () => { if (obCan) this.setState({ obStep: Math.min(3, s.obStep + 1) }); }, obBack: () => this.setState({ obStep: Math.max(0, s.obStep - 1) }),
      obSkip: () => this.go('dashboard'), obStart: () => { if (s.obPick) { this.go('overview', { openId: s.obPick }); this.toastMsg('Welcome, Bala — your plan is ready'); } },
      replayOnb: () => this.go('onboarding', { obStep: 0 })
    };
    const I = {
      dash: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z', learn: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5',
      practice: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', coach: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
      analysis: 'M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18', games: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01', progress: 'M3 3v18h18M7 15l4-4 3 3 5-6', settings: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6'
    };
    const navDef = [['Play Chess', 'play', I.analysis, ['play']], ['Dashboard', 'dashboard', I.dash, ['dashboard']], ['Learn Openings', 'library', I.learn, ['library', 'overview']], ['Practice', 'practice', I.practice, ['practice']], ['Play With Coach', 'trainer', I.coach, ['trainer']], ['Analysis Board', 'analysis', I.analysis, ['analysis']], ['My Games', 'games', I.games, ['games', 'review']], ['Progress', 'progress', I.progress, ['progress']], ['Settings', 'settings', I.settings, ['settings']]];
    const nav = navDef.map(([label, to, icon, act]) => { const on = act.includes(sc); return { label, icon, onClick: () => this.go(to, to === 'practice' ? { pView: 'queue' } : null), bg: on ? 'var(--surface-2)' : 'transparent', color: on ? 'var(--text)' : 'var(--text-2)', ic: on ? 'var(--coach)' : 'var(--text-3)' }; });
    const bottomNav = [['Play', 'play', I.analysis, ['play']], ['Home', 'dashboard', I.dash, ['dashboard']], ['Learn', 'library', I.learn, ['library', 'overview']], ['Practice', 'practice', I.practice, ['practice']], ['Coach', 'trainer', I.coach, ['trainer', 'analysis']], ['Progress', 'progress', I.progress, ['progress', 'games', 'review', 'settings']]].map(([label, to, icon, act]) => { const on = act.includes(sc); return { label, icon, onClick: () => this.go(to, to === 'practice' ? { pView: 'queue' } : null), color: on ? 'var(--text)' : 'var(--text-3)', ic: on ? 'var(--coach)' : 'var(--text-3)' }; });
    const titles = { play: 'Play Chess', dashboard: 'Dashboard', library: 'Learn Openings', overview: 'Learn Openings', trainer: 'Play With Coach', practice: 'Practice', analysis: 'Analysis Board', games: 'My Games', review: 'Game Review', progress: 'Progress', settings: 'Settings' };

    // Dashboard
    const fen = (u) => this.lastFen(u);
    const heroFen = fen(this.T.base);
    const streakDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => ({ d, bg: i < 6 ? 'var(--green)' : 'var(--surface-3)', color: i < 6 ? 'var(--bg)' : 'var(--text-3)', mark: i < 6 ? '✓' : '·' }));
    const dashStats = [['Positions to Review', '12', 'Due today'], ['Mistakes to Fix', '7', 'From your last 10 games'], ['Lessons Completed', '34', '+3 this week'], ['Training Accuracy', '76%', '+4% vs last week']].map(([label, value, sub]) => ({ label, value, sub }));
    const masteryCards = ['italian', 'caro', 'sicilian', 'london'].map(id => { const o = this.OPEN.find(x => x.id === id); return { name: o.name.replace(' Defense', '').replace(' System', ' System'), pct: o.mastery + '%', w: o.mastery + '%', side: 'As ' + o.side, color: o.mastery >= 70 ? 'var(--green)' : o.mastery >= 45 ? 'var(--amber)' : 'var(--red)', onClick: () => this.go('overview', { openId: id }) }; });
    const weakItems = [['Forgetting ...Bf5 in Caro-Kann', 'Caro-Kann · after 4.Nxe4 · missed 4 of last 7', 0], ['Playing d4 too early in Sicilian', 'Sicilian · seen in 3 recent games', 0], ['Missing kingside development', 'Italian Game · castling 2 moves late on average', 1]].map(([t, c, i]) => ({ title: t, ctx: c, onClick: () => this.startSession(i) }));

    // Library
    const q = s.libQ.trim().toLowerCase();
    const libFilters = ['White', 'Black', 'Beginner', 'Intermediate', 'Advanced'].map(f => { const on = s.libF.includes(f); return { label: f, onClick: () => this.setState({ libF: on ? s.libF.filter(x => x !== f) : [...s.libF, f] }), bg: on ? 'var(--text)' : 'transparent', color: on ? 'var(--bg)' : 'var(--text-2)', border: on ? 'var(--text)' : 'var(--border-2)' }; });
    const sides = s.libF.filter(f => f === 'White' || f === 'Black'), diffs = s.libF.filter(f => f !== 'White' && f !== 'Black');
    const openings = this.OPEN.filter(o => (!q || (o.name + ' ' + o.moves + ' ' + o.eco).toLowerCase().includes(q)) && (!sides.length || sides.includes(o.side)) && (!diffs.length || diffs.includes(o.diff))).map(o => ({
      name: o.name, moves: o.moves, side: 'As ' + o.side, diff: o.diff, pop: o.pop, eco: o.eco, fen: fen(o.uci), orient: o.side.toLowerCase(),
      pct: o.mastery ? o.mastery + '% Mastered' : 'Not started', w: o.mastery + '%', cta: o.mastery ? 'Continue →' : 'Start →',
      color: o.mastery >= 70 ? 'var(--green)' : o.mastery >= 45 ? 'var(--amber)' : 'var(--red)', diffColor: o.diff === 'Beginner' ? 'var(--green)' : o.diff === 'Intermediate' ? 'var(--amber)' : 'var(--red)',
      onClick: () => this.go('overview', { openId: o.id })
    }));

    // Overview
    const op = this.OPEN.find(o => o.id === s.openId) || this.OPEN[0];
    const lessonNames = op.id === 'caro' ? [['Opening idea', 'Why 1...c6 and 2...d5'], ['Main line', '3.Nc3 dxe4 4.Nxe4 Bf5'], ['Advance variation', '3.e5 and the ...c5 break'], ['Exchange variation', '3.exd5 cxd5 structures'], ['Typical middlegame plans', 'Where your pieces belong'], ['Common mistakes', 'Traps and natural errors'], ['Practice positions', '20 key positions'], ['Final test', 'Play it from memory']] : [['Opening idea', 'The core concept'], ['Main line', 'The most common path'], ['Key variation', 'White’s best try'], ['Sidelines', 'Surprise moves'], ['Typical middlegame plans', 'Where your pieces belong'], ['Common mistakes', 'Traps and natural errors'], ['Practice positions', '20 key positions'], ['Final test', 'Play it from memory']];
    const doneN = op.id === 'caro' ? 1 : Math.floor(op.mastery / 100 * 8);
    const lessons = lessonNames.map(([t, d], i) => {
      const st = i < doneN ? 'done' : i === doneN ? 'current' : 'locked';
      return { n: 'Lesson ' + (i + 1), title: t, desc: d, isDone: st === 'done', isCurrent: st === 'current', isLocked: st === 'locked', status: st === 'done' ? 'Completed' : st === 'current' ? (op.id === 'caro' ? 'In progress · 4 / 10' : 'Up next') : 'Locked',
        border: st === 'current' ? 'var(--coach-line)' : 'var(--border)', bg: st === 'current' ? 'var(--coach-soft)' : 'var(--surface)', op: st === 'locked' ? '.55' : '1', cursor: st === 'locked' ? 'default' : 'pointer',
        onClick: st === 'locked' ? undefined : () => this.go('trainer') };
    });
    const ovStats = [[op.mastery + '%', 'Mastered'], ['8', 'Lessons'], [op.time, 'Est. learning time'], [op.eco, 'ECO']].map(([v, l]) => ({ v, l }));

    // Trainer
    const T = this.T, step = T.steps[s.tStep];
    const tFens = this.line(s.tMoves); const tFen = tFens[tFens.length - 1];
    const preFen = s.tPhase === 'correct' ? tFens[tFens.length - 2] : tFen;
    const alts = T.alts[s.tStep] || [];
    const wi = alts.find(a => a.key === s.wiKey);
    let bFen = tFen, bMarks = s.tMarks, bArrows = this.arr(s.tArrows);
    if (s.tab === 'why' && s.whyIdx != null && s.whyIdx < s.tMoves.length) { bFen = tFens[s.whyIdx + 1]; bMarks = this.lm(s.tMoves[s.whyIdx]); bArrows = this.arr(T.why[s.whyIdx] && T.why[s.whyIdx].a); }
    else if (s.tab === 'whatif') { bFen = preFen; bMarks = {}; bArrows = wi ? this.arr([[wi.uci.slice(0, 2), wi.uci.slice(2, 4), 'amber'], [step.exp.slice(0, 2), step.exp.slice(2, 4), 'green']]) : []; }
    else if (s.tab === 'plan') { bArrows = this.arr(s.tArrows.length ? s.tArrows : []); }
    else if (s.tab === 'chat') { bArrows = this.arr(s.chatArrows); bMarks = Object.assign({}, s.tMarks, s.chatMarks); }
    if (s.tab === 'coach' && s.tPhase === 'ask' && s.hintLvl > 0) { bMarks = Object.assign({}, s.tMarks, { [step.hintSq]: 'hint' }); if (s.hintLvl > 1) bArrows = this.arr([[step.exp.slice(0, 2), step.exp.slice(2, 4), 'amber']]); }
    if (s.tFlash) { bFen = s.tFlash.fen; bMarks = s.tFlash.marks; bArrows = []; }
    const tPlies = s.tSan.map((san, i) => ({ label: i % 2 === 0 ? `${i / 2 + 1}.${san}` : san, onClick: () => this.setState({ tab: 'why', whyIdx: i }), bg: s.tab === 'why' && s.whyIdx === i ? 'var(--coach-soft)' : 'transparent', color: s.tab === 'why' && s.whyIdx === i ? 'var(--coach)' : i % 2 === 0 ? 'var(--text)' : 'var(--text-2)' }));
    const tabs = [['coach', 'Coach'], ['whatif', 'What if'], ['why', 'Why'], ['plan', 'Plan'], ['chat', 'Chat']].map(([k, l]) => ({ label: l, onClick: () => this.setState({ tab: k, chatArrows: k === 'chat' ? s.chatArrows : [], tArrows: k === s.tab ? s.tArrows : [] }), bg: s.tab === k ? 'var(--surface-3)' : 'transparent', color: s.tab === k ? 'var(--text)' : 'var(--text-3)' }));
    const posSegs = Array.from({ length: 10 }, (_, i) => ({ bg: i < s.posNo - 1 ? 'var(--green)' : i === s.posNo - 1 ? 'var(--coach)' : 'var(--surface-3)' }));
    const nextSeq = step.next.map((m, i) => ({ n: m[0], san: m[1], bg: m[2] === 'w' ? 'var(--chip-w)' : 'var(--surface-3)', color: m[2] === 'w' ? 'var(--chip-w-ink)' : 'var(--text)', arrow: i < step.next.length - 1 ? '→' : '' }));
    const plan = ['Develop the bishop', 'Develop knights', 'Play ...e6', 'Castle', 'Challenge the center later with ...c5'].map((t, i) => ({ n: String(i + 1), t, done: s.tStep > 0 && i === 0 ? 'var(--green)' : 'var(--text-3)' }));
    const why = T.why[s.whyIdx] || T.why[4];
    const whyMove = this.label(s.whyIdx, s.tSan[s.whyIdx] || 'Nc3');
    const wiChips = alts.map(a => ({ label: 'What if I play ' + a.san.replace(/^\d+\.+/, s.tMoves.length % 2 ? '...' : '') + '?', onClick: () => this.setState({ wiKey: a.key, wiMiss: null }), bg: s.wiKey === a.key ? 'var(--coach-soft)' : 'var(--surface-2)', border: s.wiKey === a.key ? 'var(--coach-line)' : 'var(--border)' }));
    const tBoard = { fen: bFen, marks: bMarks, arrows: bArrows };
    const sideToMove = this.parse(bFen).turn === 'w' ? 'White to move' : 'Black to move';
    const chatSuggest = ['What should I do next?', 'Why is d4 important?', 'What happens if I play Nf6?', 'Where should my bishop go?', 'What is White trying to do?', 'Show me the plan.', 'What mistake did I make?'].map(t => ({ t, onClick: () => this.sendChat(t) }));
    const chat = s.chat.map((m) => ({ text: m.text, isCoach: m.role === 'coach', isUser: m.role === 'user', actions: (m.actions || []).map(a => ({ label: a.label, onClick: () => this.runAction(a) })), hasActions: (m.actions || []).length > 0 }));
    const ctxLine = 'Position after ' + this.label(s.tSan.length - 1, s.tSan[s.tSan.length - 1]) + ' · ' + (this.parse(tFen).turn === 'w' ? 'White' : 'Black') + ' to move';
    const sheetOpen = isMobile && s.sheet;

    // Practice
    const qTabs = [['due', 'Due Today', 12], ['learning', 'Learning', 9], ['mastered', 'Mastered', 41], ['weak', 'Weak Positions', 5]].map(([k, l, n]) => ({ label: l, n: String(n), onClick: () => this.setState({ pTab: k }), bg: s.pTab === k ? 'var(--surface-3)' : 'transparent', color: s.pTab === k ? 'var(--text)' : 'var(--text-3)' }));
    const qCards = (this.Q[s.pTab] || []).map(c => ({ op: c.op, after: c.after, fen: fen(c.uci), orient: c.side, acc: c.acc + '%', last: c.last, accColor: c.acc >= 80 ? 'var(--green)' : c.acc >= 50 ? 'var(--amber)' : 'var(--red)', onClick: () => this.startSession(c.pi) }));
    const PZ = this.pPuzzle(); const pzFen = fen(PZ.uci);
    const pBoard = { fen: s.pFlash ? s.pFlash.fen : s.pFen || pzFen, marks: s.pFlash ? s.pFlash.marks : s.pPhase === 'reveal' ? {} : s.pMarks, arrows: s.pPhase === 'reveal' ? this.arr([[PZ.exp.slice(0, 2), PZ.exp.slice(2, 4), 'green']]) : [], orient: PZ.side };
    const pPosNo = s.pIdx + 3;

    // Analysis
    const af = this.aFens(); const t = s.tch;
    let aBoard = { fen: af[s.aPly], marks: s.aPly ? this.lm(this.A.uci[s.aPly - 1]) : {}, arrows: [] };
    const aWi = this.A.alts.find(a => a.key === s.aWi);
    if (s.aMode === 'plan') aBoard.arrows = this.arr([['a2', 'a4', 'green'], ['h2', 'h3', 'coach'], ['b1', 'd2', 'coach'], ['d3', 'd4', 'amber']]);
    if (s.aMode === 'why') aBoard.arrows = this.arr([['a2', 'a4', 'green'], ['c4', 'a2', 'coach'], ['a4', 'a5', 'amber']]);
    if (s.aMode === 'whatif' && aWi) aBoard.arrows = this.arr([[aWi.uci.slice(0, 2), aWi.uci.slice(2, 4), 'amber'], ['a2', 'a4', 'green']]);
    if (s.aMode === 'teach' && t) {
      const tf = this.lastFen(t.moves, af[12]); const tst = this.A.teach[t.step];
      aBoard = { fen: t.flash ? t.flash.fen : tf, marks: t.flash ? t.flash.marks : t.marks, arrows: t.phase === 'ask' && t.missThis >= 2 ? this.arr([[tst.exp.slice(0, 2), tst.exp.slice(2, 4), 'amber']]) : [] };
    }
    const evNow = s.aMode === 'teach' ? 0.3 : this.A.ev[s.aPly];
    const evalPct = Math.max(6, Math.min(94, 50 + evNow * 12)) + '%';
    const aPairs = []; for (let i = 0; i < this.A.san.length; i += 2) { const mk = (j) => ({ san: this.A.san[j], onClick: () => this.setState({ aPly: j + 1, aMode: 'explain', tch: null, aWi: null }), bg: s.aPly === j + 1 && s.aMode !== 'teach' ? 'var(--coach-soft)' : 'transparent', color: s.aPly === j + 1 && s.aMode !== 'teach' ? 'var(--coach)' : 'var(--text)' }); aPairs.push({ n: i / 2 + 1 + '.', w: mk(i), b: mk(i + 1) }); }
    const aModes = [['explain', 'Explain position'], ['plan', 'What is my plan?'], ['why', 'Why is this move best?'], ['whatif', 'What if I play...?']].map(([k, l]) => ({ label: l, onClick: () => this.setState({ aMode: k, aPly: 12, tch: null }), bg: s.aMode === k ? 'var(--surface-3)' : 'transparent', color: s.aMode === k ? 'var(--text)' : 'var(--text-2)', border: s.aMode === k ? 'var(--border-2)' : 'var(--border)' }));
    const aFinal = s.aPly === 12;
    const aAltChips = this.A.alts.map(a => ({ label: a.san, onClick: () => this.setState({ aWi: a.key }), bg: s.aWi === a.key ? 'var(--coach-soft)' : 'var(--surface-2)', border: s.aWi === a.key ? 'var(--coach-line)' : 'var(--border)' }));
    const tchLog = t ? t.log.map(l => ({ you: l.you, fb: l.fb, reply: l.reply, hasReply: !!l.reply, dot: l.clean ? 'var(--green)' : 'var(--amber)' })) : [];
    const tchStep = t ? this.A.teach[t.step] : this.A.teach[0];

    // Review
    const rf = this._rf || (this._rf = this.line(this.R.uci));
    const rBad = this.R.bad[s.rPly];
    const rBoard = rBad ? { fen: rf[s.rPly], marks: {}, arrows: this.arr([[this.R.uci[s.rPly].slice(0, 2), this.R.uci[s.rPly].slice(2, 4), 'red'], [rBad.better.slice(0, 2), rBad.better.slice(2, 4), 'green']]) } : { fen: rf[s.rPly + 1], marks: this.lm(this.R.uci[s.rPly]), arrows: [] };
    const CLS = { book: ['Book', 'var(--text-3)'], best: ['Best', 'var(--green)'], good: ['Good', '#7cb8a0'], inacc: ['Inaccuracy', 'var(--amber)'], mistake: ['Mistake', 'var(--orange)'], blunder: ['Blunder', 'var(--red)'] };
    const rPairs = []; for (let i = 0; i < this.R.san.length; i += 2) { const mk = (j) => j < this.R.san.length ? { san: this.R.san[j], dot: CLS[this.R.cls[j]][1], onClick: () => this.setState({ rPly: j }), bg: s.rPly === j ? 'var(--surface-3)' : 'transparent', show: true } : { san: '', dot: 'transparent', onClick: undefined, bg: 'transparent' }; rPairs.push({ n: i / 2 + 1 + '.', w: mk(i), b: mk(i + 1) }); }
    const rCounts = ['best', 'good', 'inacc', 'mistake', 'blunder'].map(k => ({ label: CLS[k][0], color: CLS[k][1], n: String(this.R.cls.filter((c, i) => i % 2 === 0 && c === k).length) }));
    const rCls = CLS[this.R.cls[s.rPly]];
    const rMoments = Object.keys(this.R.bad).map(k => ({ label: this.label(+k, this.R.san[k]), cls: CLS[this.R.cls[k]][0], color: CLS[this.R.cls[k]][1], onClick: () => this.setState({ rPly: +k }) }));
    const games = this.GAMES.map(g => ({ ...g, accS: g.acc + '%', ratingS: '(' + g.rating + ')', resColor: g.result === 'Win' ? 'var(--green)' : g.result === 'Loss' ? 'var(--red)' : 'var(--text-2)', accColor: g.acc >= 80 ? 'var(--green)' : g.acc >= 65 ? 'var(--amber)' : 'var(--red)', onClick: () => this.go('review', { rPly: 22 }) }));
    const importOpts = [['Upload PGN', 'Drop a .pgn file', 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12', () => this.toastMsg('Choose a .pgn file to upload')], ['Paste PGN', 'From any site or app', 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6v4H9z', () => this.setState({ pasteOpen: !s.pasteOpen })], ['Connect Lichess', 'Auto-import new games', 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71', () => this.toastMsg('Connected to Lichess — importing 48 games')], ['Connect Chess.com', 'Auto-import new games', 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71', () => this.toastMsg('Connected to Chess.com — importing 112 games')]].map(([t, d, icon, onClick]) => ({ t, d, icon, onClick }));

    // Progress
    const progStats = [['Current streak', '7 days', 'Best: 12 days'], ['Rating level', '1184', '+46 this month'], ['Positions mastered', '41', '+9 this week'], ['Training accuracy', '76%', '+4% vs last week'], ['Weekly practice', '3h 05m', '7 of 7 days'], ['Weak positions', '5', '2 fewer than last week']].map(([l, v, d]) => ({ l, v, d }));
    const progOpen = this.OPEN.filter(o => o.mastery).sort((a, b) => b.mastery - a.mastery).map(o => ({ name: o.name, pct: o.mastery + '%', w: o.mastery + '%', color: o.mastery >= 70 ? 'var(--green)' : o.mastery >= 45 ? 'var(--amber)' : 'var(--red)' }));
    const mins = [28, 35, 22, 40, 18, 25, 17];
    const weekBars = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({ d, h: Math.round(mins[i] / 40 * 100) + '%', m: mins[i] + 'm', bg: i === 6 ? 'var(--coach)' : 'var(--surface-3)' }));
    const accT = [61, 63, 62, 66, 69, 71, 73, 76];
    const accPts = accT.map((v, i) => `${(i / 7 * 100).toFixed(1)},${(100 - (v - 55) / 25 * 100).toFixed(1)}`).join(' ');
    const improvements = [['Caro-Kann main line', 'Accuracy 38% → 71%', '+33%'], ['Italian: c3–d3 setup', '9 new positions mastered', '+9'], ['Development speed', 'Castling 2 moves earlier on average', '−2 moves']].map(([t, d, v]) => ({ t, d, v }));
    const weaknesses = [['Sicilian after 3.d4', '29% accuracy · 6 attempts'], ['Forgetting ...Bf5 in Caro-Kann', 'Missed 4 of the last 7'], ['Playing d4 too early', 'Seen in 3 recent games']].map(([t, d]) => ({ t, d, onClick: () => this.startSession(0) }));

    // Settings
    const seg = (opts, cur, set) => opts.map(o => ({ label: o, onClick: () => set(o), bg: cur === o ? 'var(--surface-3)' : 'transparent', color: cur === o ? 'var(--text)' : 'var(--text-3)' }));
    const cap = (x) => x[0].toUpperCase() + x.slice(1);
    const setTheme = seg(['Dark', 'Light'], cap(theme), o => this.setState({ theme: o.toLowerCase() }));
    const setBoard = seg(['Walnut', 'Slate', 'Sage'], cap(boardTheme), o => this.setState({ board: o.toLowerCase() }));
    const setDepth = seg(['Simple', 'Standard', 'Detailed'], s.depth, o => this.setState({ depth: o }));

    return {
      ...obVals,
      theme, boardTheme, frameRef: this.frameRef, chatRef: this.chatRef, frameMax, frameBorder: vp === 'auto' ? 'none' : '1px solid var(--border)',
      isMobile, notMobile: !isMobile, showSidebar: chrome && !isMobile, sideW: isTablet ? '76px' : '236px', sideFull: !isTablet, chrome, showBottomNav: chrome && isMobile,
      pad: isMobile ? '16px 16px 24px' : isTablet ? '24px' : '32px 36px', nav, bottomNav, pageTitle: titles[sc],
      isDark: theme === 'dark', isLight: theme === 'light', toggleTheme: () => this.setState({ theme: theme === 'dark' ? 'light' : 'dark' }),
      toast: s.toast, hasToast: !!s.toast,
      isDash: sc === 'dashboard', isLib: sc === 'library', isOver: sc === 'overview', isTrainer: sc === 'trainer', isPracticeQ: sc === 'practice' && !session, isSession: session, isAnalysis: sc === 'analysis', isGames: sc === 'games', isReview: sc === 'review', isProgress: sc === 'progress', isSettings: sc === 'settings',
      hasData: !empty, isEmpty: empty,
      goTrainer: () => this.go('trainer'), goLibrary: () => this.go('library'), goPractice: () => this.go('practice', { pView: 'queue' }), goGames: () => this.go('games'), goProgress: () => this.go('progress'), goCaro: () => this.go('overview', { openId: 'caro' }), goAnalysis: () => this.go('analysis'),
      heroFen, heroMarks: this.lm('b1c3'), streakDays, dashStats, masteryCards, weakItems,
      libQ: s.libQ, onLibQ: (e) => this.setState({ libQ: e.target.value }), libFilters, openings, noOpenings: openings.length === 0, libCount: openings.length + (openings.length === 1 ? ' opening' : ' openings'),
      op, opFen: fen(op.uci), opOrient: op.side.toLowerCase(), opSide: 'Play as ' + op.side, opW: op.mastery + '%', lessons, ovStats, ovCta: op.id === 'caro' ? 'Continue Lesson 2' : 'Start Lesson ' + (doneN + 1),
      tBoard, onTrainerMove: (f, to) => this.trainerMove(f, to), coords: s.coords, sideToMove, tEval: step.ev, showEngine: s.showEngine, engineLabel: s.showEngine ? 'Hide Engine' : 'Show Engine', tPlies, posSegs, posLabel: s.posNo + ' / 10 positions',
      tabs, tabCoach: s.tab === 'coach', tabWhatIf: s.tab === 'whatif', tabWhy: s.tab === 'why', tabPlan: s.tab === 'plan', tabChat: s.tab === 'chat',
      tAsk: s.tPhase === 'ask', tCorrect: s.tPhase === 'correct', tDone: s.tPhase === 'done', step, explainText: s.simpler ? step.simple : step.explain, simplerLabel: s.simpler ? 'Explain normally' : 'Explain simpler',
      hasWrong: !!s.tWrong && s.tPhase === 'ask', wrongSan: s.tWrong ? s.tWrong.san : '', wrongHasAlt: !!(s.tWrong && s.tWrong.key), wrongNoAlt: !!(s.tWrong && !s.tWrong.key),
      showHint: s.hintLvl > 0 && s.tPhase === 'ask', hintLabel: s.hintLvl > 0 ? 'Show hint arrow' : 'Hint',
      nextSeq, plan,
      onPrev: () => this.setState(this.buildT(Math.max(0, s.tPhase === 'ask' ? s.tStep - 1 : s.tStep))), onReset: () => this.setState(this.buildT(0)), onHint: () => this.setState({ hintLvl: Math.min(2, s.hintLvl + 1), tab: 'coach' }),
      onEngine: () => this.setState({ showEngine: !s.showEngine }), onNextPos: () => { this.setState(Object.assign(this.buildT(0), { posNo: Math.min(10, s.posNo + 1), tab: 'coach' })); this.toastMsg('Position ' + Math.min(10, s.posNo + 1) + ' of 10'); },
      onNextMove: () => this.trainerNext(), onWhy: () => this.setState({ tab: 'why', whyIdx: s.tMoves.length - 1 }), onWhatIf: () => this.setState({ tab: 'whatif' }), onPlan: () => this.setState({ tab: 'plan', tArrows: T.planArrows }),
      onShowBoard: () => this.setState({ tArrows: step.show }), onSimpler: () => this.setState({ simpler: !s.simpler }), onWrongWhatIf: () => this.setState({ tab: 'whatif', wiKey: s.tWrong && s.tWrong.key }),
      onWhatNext: () => this.setState({ tab: 'coach', tArrows: step.show, sheet: true }),
      whyMove, why, whyReasons: why.r.map(t => ({ t })), toChat: () => this.setState({ tab: 'chat' }), backToCurrent: () => this.setState({ tab: 'coach' }),
      wi, hasWi: !!wi, noWi: !wi && !s.wiMiss, wiMain: s.wiMiss === 'MAIN', wiUnknown: !!s.wiMiss && s.wiMiss !== 'MAIN', wiMissText: s.wiMiss, wiChips, wiText: s.wiText, recSan: step.san, recEval: step.ev,
      wiLine: wi ? wi.line.map((m, i) => ({ m, arrow: i < wi.line.length - 1 ? '→' : '' })) : [], onWiText: (e) => this.setState({ wiText: e.target.value }), onWiKey: (e) => { if (e.key === 'Enter') this.whatIfAsk(s.wiText); }, onWiSend: () => this.whatIfAsk(s.wiText),
      showBetterPlan: () => this.setState({ tab: 'plan', tArrows: T.planArrows }), planShow: () => this.setState({ tArrows: T.planArrows }),
      chat, chatSuggest, chatIn: s.chatIn, chatBusy: s.chatBusy, onChatIn: (e) => this.setState({ chatIn: e.target.value }), onChatKey: (e) => { if (e.key === 'Enter') this.sendChat(s.chatIn); }, onChatSend: () => this.sendChat(s.chatIn), ctxLine,
      sheetPos: sheetOpen ? 'fixed' : 'relative', sheetLeft: sheetOpen ? s.fl + 'px' : 'auto', sheetW: sheetOpen ? w + 'px' : 'auto', sheetZ: sheetOpen ? '60' : '1', sheetMaxH: sheetOpen ? '78vh' : 'none', sheetRadius: sheetOpen ? '18px 18px 0 0' : '16px', sheetOpen, toggleSheet: () => this.setState({ sheet: !s.sheet }), sheetLabel: s.sheet ? 'Collapse' : 'Expand',
      qTabs, qCards, startDaily: () => this.startSession(0), exitSession: () => this.go('practice', { pView: 'queue' }),
      pBoard, onPracticeMove: (f, to) => this.practiceMove(f, to), PZ, pPos: 'Position ' + pPosNo + ' / 12', pPosW: Math.round(pPosNo / 12 * 100) + '%', pSide: PZ.side === 'white' ? 'White to move' : 'Black to move',
      pAsk: s.pPhase === 'ask' && !s.pDone, pTryAgain: s.pPhase === 'ask' && s.pTries > 0 && !s.pFlash, pFlashing: !!s.pFlash, pRight: s.pPhase === 'right' && !s.pDone, pReveal: s.pPhase === 'reveal' && !s.pDone, pResult: (s.pPhase === 'right' || s.pPhase === 'reveal') && !s.pDone, pDone: s.pDone, pNotDone: !s.pDone,
      pWrongSan: s.pWrongSan, pAccLabel: s.pAcc[0] + ' / ' + s.pAcc[1], pStreak: String(s.pStreak), onPracticeNext: () => this.practiceNext(), pNextLabel: s.pIdx >= this.P.length - 1 ? 'Finish review' : 'Next position', pShowSolution: () => this.setState({ pPhase: 'reveal' }),
      aBoard, onAnalysisMove: (f, to) => this.analysisMove(f, to), evalPct, evalText: (evNow >= 0 ? '+' : '') + evNow.toFixed(1), aPairs, aModes, aFinal, aNotFinal: !aFinal && s.aMode !== 'teach', aIdea: s.aPly ? this.A.ideas[s.aPly - 1] : 'The starting position.', aMoveLabel: s.aPly ? 'After ' + this.label(s.aPly - 1, this.A.san[s.aPly - 1]) : 'Starting position',
      aExplain: aFinal && s.aMode === 'explain', aPlan: s.aMode === 'plan', aWhy: s.aMode === 'why', aWhatIf: s.aMode === 'whatif', aTeach: s.aMode === 'teach' && !!t, aNotTeach: !(s.aMode === 'teach' && t), aWiSel: aWi, hasAWi: !!aWi, noAWi: !aWi, aAltChips,
      aFirst: () => this.setState({ aPly: 0, aMode: 'explain', tch: null }), aPrev: () => this.setState({ aPly: Math.max(0, s.aPly - 1), aMode: 'explain', tch: null }), aNext: () => this.setState({ aPly: Math.min(12, s.aPly + 1), aMode: 'explain', tch: null }), aLast: () => this.setState({ aPly: 12, aMode: 'explain', tch: null }),
      startTeach: () => this.startTeach(), exitTeach: () => this.setState({ aMode: 'explain', tch: null }), engineOpen: s.engineOpen, toggleEngine: () => this.setState({ engineOpen: !s.engineOpen }), engineChevron: s.engineOpen ? 'Hide' : 'Show',
      tchAsk: t && t.phase === 'ask', tchGood: t && t.phase === 'good', tchDone: t && t.phase === 'done', tchActive: t && t.phase !== 'done', tchStepLabel: t ? 'Move ' + (t.step + 1) + ' of ' + this.A.teach.length : '', tchSegs: this.A.teach.map((_, i) => ({ bg: t && (i < t.step || t.phase === 'done' || (i === t.step && t.phase === 'good')) ? 'var(--green)' : t && i === t.step ? 'var(--coach)' : 'var(--surface-3)' })),
      tchHint: t && t.missThis > 0 && t.phase === 'ask', tchHintText: tchStep.hint, tchLog, tchHasLog: tchLog.length > 0, tchMistake: t && t.firstMiss ? `You tried ${t.firstMiss.played} where ${t.firstMiss.best} was the idea.` : 'None — you found every move first try.', tchFen: this.lastFen(['a2a4', 'a7a5', 'h2h3', 'c8e6', 'b1d2', 'h7h6', 'f1e1', 'f8e8'], af[12]),
      addReview: () => this.toastMsg('Added 4 positions to your review queue'),
      rBoard, rPairs, rCounts, rIsBad: !!rBad, rIsOk: !rBad, rBad, rPlayed: this.label(s.rPly, this.R.san[s.rPly]), rClsLabel: rCls[0], rClsColor: rCls[1], rNote: this.R.notes[s.rPly] || (this.R.cls[s.rPly] === 'book' ? 'Book move — known opening theory.' : 'A solid, natural move.'), rMoments,
      rPrev: () => this.setState({ rPly: Math.max(0, s.rPly - 1) }), rNext: () => this.setState({ rPly: Math.min(this.R.san.length - 1, s.rPly + 1) }), practiceMistake: () => this.toastMsg('Converted to a training position · due tomorrow'),
      games, importOpts, connectLichess: importOpts[2].onClick, pasteOpen: s.pasteOpen, analyzePaste: () => this.go('review', { rPly: 22, pasteOpen: false }),
      progStats, progOpen, weekBars, accPts, improvements, weaknesses,
      setTheme, setBoard, setDepth, coordsLabel: s.coords ? 'On' : 'Off', toggleCoords: () => this.setState({ coords: !s.coords }), coordsBg: s.coords ? 'var(--green)' : 'var(--surface-3)', coordsX: s.coords ? '18px' : '2px',
      engineDefaultBg: s.showEngine ? 'var(--green)' : 'var(--surface-3)', engineDefaultX: s.showEngine ? '18px' : '2px'
    };
  }
  render() {
    const v = this.renderVals();
    return (
      <div className="cc-shell" data-screen={this.state.screen} data-cc-theme={v.theme} data-cc-board={v.boardTheme} style={{ minHeight: "100vh", background: "var(--outer)", color: "var(--text)" }}>
        <div className="app-frame" ref={v.frameRef} style={{ position: "relative", margin: "0 auto", maxWidth: v.frameMax, minHeight: "100vh", display: "flex", background: "var(--bg)", borderLeft: v.frameBorder, borderRight: v.frameBorder }}>
          {v.showSidebar ? (
            <>
              <aside style={{ position: "sticky", top: "0", height: "100vh", width: v.sideW, flex: "none", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: "18px 12px", gap: "4px", background: "var(--bg)" }}>
                <div onClick={v.goTrainer} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "4px 8px 22px", cursor: "pointer" }}>
                  <div style={{ width: "32px", height: "32px", flex: "none", borderRadius: "9px", background: "var(--text)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Sans Symbols 2',serif", fontSize: "21px", lineHeight: "1" }}>
                    {"♞"}
                  </div>
                  {v.sideFull ? (
                    <>
                      <div style={{ fontWeight: "600", fontSize: "16px", letterSpacing: "-.01em" }}>
                        {"Chess Coach"}
                      </div>
                    </>
                  ) : null}
                </div>
                {(v.nav || []).map((n, $index) => (
                  <React.Fragment key={n && n.key != null ? n.key : $index}>
                    <div onClick={n.onClick} title={n.label} style={{ display: "flex", alignItems: "center", gap: "12px", height: "40px", padding: "0 12px", borderRadius: "10px", background: n.bg, color: n.color, cursor: "pointer", fontSize: "14px", fontWeight: "500" }} className="cc-hover-1">
                      <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} style={{ flex: "none", color: n.ic, strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }}>
                        <path d={n.icon} />
                      </svg>
                      {v.sideFull ? (
                        <>
                          <span style={{ whiteSpace: "nowrap" }}>
                            {n.label}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </React.Fragment>
                ))}
              </aside>
            </>
          ) : null}
          <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
            {v.chrome ? (
              <>
                <header style={{ position: "sticky", top: "0", zIndex: "20", height: "64px", display: "flex", alignItems: "center", gap: "10px", padding: "0 20px", borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
                  {v.isMobile ? (
                    <>
                      <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "var(--text)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Sans Symbols 2',serif", fontSize: "19px" }}>
                        {"♞"}
                      </div>
                    </>
                  ) : null}
                  <div style={{ fontSize: "15px", fontWeight: "600", flex: "1", minWidth: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {v.pageTitle}
                  </div>
                  <div title={"Current streak"} style={{ display: "flex", alignItems: "center", gap: "6px", height: "32px", padding: "0 10px", borderRadius: "999px", background: "var(--amber-soft)", color: "var(--amber)", fontSize: "13px", fontWeight: "600" }}>
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"currentColor"} stroke={"none"}>
                      <path d={"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"} />
                    </svg>
                    {"7 "}
                  </div>
                  {v.notMobile ? (
                    <>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <div title={"Learning score"} style={{ display: "flex", alignItems: "center", gap: "6px", height: "32px", padding: "0 10px", borderRadius: "999px", background: "var(--coach-soft)", color: "var(--coach)", fontSize: "13px", fontWeight: "600" }}>
                          <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"currentColor"}>
                            <path d={"M13 2L3 14h9l-1 8 10-12h-9l1-8z"} />
                          </svg>
                          {"2,340 XP "}
                        </div>
                        <div title={"Rating"} style={{ display: "flex", alignItems: "center", gap: "6px", height: "32px", padding: "0 10px", borderRadius: "999px", border: "1px solid var(--border)", fontSize: "13px", color: "var(--text-2)" }}>
                          <span style={{ fontFamily: "'Geist Mono',monospace", color: "var(--text)", fontWeight: "500" }}>
                            {"1184"}
                          </span>
                          {"Rapid"}
                        </div>
                      </div>
                    </>
                  ) : null}
                  <button onClick={v.toggleTheme} title={"Toggle theme"} style={{ width: "34px", height: "34px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--text-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} className="cc-hover-2">
                    {v.isDark ? (
                      <>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} style={{ strokeWidth: "1.8", strokeLinecap: "round" }}>
                          <path d={"M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"} />
                        </svg>
                      </>
                    ) : null}
                    {v.isLight ? (
                      <>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} style={{ strokeWidth: "1.8", strokeLinecap: "round" }}>
                          <path d={"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"} />
                        </svg>
                      </>
                    ) : null}
                  </button>
                  <button className="header-profile" onClick={this.context.openProfile} disabled={this.context.loading} aria-label={this.context.user ? 'Open profile' : 'Sign in'} title={this.context.user?.name || 'Sign in'}>{this.context.user ? this.context.user.name[0]?.toUpperCase() : 'Sign in'}</button>
                </header>
              </>
            ) : null}
            <main className={this.state.screen === 'play' ? 'play-page' : undefined} style={{ flex: "1", padding: v.pad, minWidth: "0" }}>
              {v.isOnb ? (
                <>
                  <div style={{ maxWidth: "920px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px", paddingTop: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "var(--text)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI Symbol','Apple Symbols',serif", fontSize: "21px", lineHeight: "1" }}>
                        {"♞"}
                      </div>
                      <span style={{ fontWeight: "600", fontSize: "16px" }}>
                        {"Chess Coach"}
                      </span>
                      <div style={{ flex: "1" }} />
                      {v.obShowDots ? (
                        <>
                          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                            {(v.obDots || []).map((d, $index) => (
                              <React.Fragment key={d && d.key != null ? d.key : $index}>
                                <div style={{ width: d.w, height: "6px", borderRadius: "3px", background: d.bg, transition: "all .3s" }} />
                              </React.Fragment>
                            ))}
                          </div>
                        </>
                      ) : null}
                      <span onClick={v.obSkip} style={{ fontSize: "13px", color: "var(--text-3)", cursor: "pointer", marginLeft: "12px" }}>
                        {"Skip"}
                      </span>
                    </div>
                    {v.ob0 ? (
                      <>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "48px", alignItems: "center", padding: "24px 0", animation: "ccIn .4s ease-out" }}>
                          <div style={{ flex: "1 1 340px", minWidth: "0", display: "flex", flexDirection: "column", gap: "18px" }}>
                            <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", textTransform: "uppercase", color: "var(--coach)" }}>
                              {"Welcome"}
                            </span>
                            <h1 style={{ margin: "0", fontSize: "46px", lineHeight: "1.05", fontWeight: "600", letterSpacing: "-.035em", textWrap: "balance" }}>
                              {"Your personal AI chess coach"}
                            </h1>
                            <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "var(--text-2)", maxWidth: "460px", textWrap: "pretty" }}>
                              {"Learn openings, understand every move, practice positions, and improve from your mistakes."}
                            </p>
                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", paddingTop: "8px" }}>
                              <button onClick={v.obGetStarted} style={{ height: "46px", padding: "0 22px", borderRadius: "12px", border: "none", background: "var(--text)", color: "var(--bg)", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                                {"Get Started"}
                              </button>
                              <button onClick={v.obAlready} style={{ height: "46px", padding: "0 20px", borderRadius: "12px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", fontSize: "15px", fontWeight: "500", cursor: "pointer" }} className="cc-hover-3">
                                {"I Already Play Chess"}
                              </button>
                            </div>
                          </div>
                          <div style={{ flex: "0 1 360px", minWidth: "240px", display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div style={{ width: "100%" }}><Chessboard fen={v.heroFen} orientation={"black"} interactive={false} coords={false} arrows={v.obHeroArrows} /></div>
                            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "12px 14px", borderRadius: "12px", background: "var(--surface)", border: "1px solid var(--border)" }}>
                              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--coach)", marginTop: "6px", flex: "none" }} />
                              <span style={{ fontSize: "13.5px", lineHeight: "1.5", color: "var(--text-2)" }}>
                                {"“Take on e4, then your bishop comes out to f5 — before ...e6 locks it in.”"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}
                    {v.ob1 ? (
                      <>
                        <div style={{ display: "flex", flexDirection: "column", gap: "22px", animation: "ccIn .35s ease-out" }}>
                          <div>
                            <div style={{ fontSize: "13px", color: "var(--text-3)" }}>
                              {"Step 2 of 4"}
                            </div>
                            <h1 style={{ margin: "6px 0 0", fontSize: "32px", fontWeight: "600", letterSpacing: "-.025em" }}>
                              {"What is your current chess level?"}
                            </h1>
                            <p style={{ margin: "8px 0 0", fontSize: "15px", color: "var(--text-2)" }}>
                              {"Your coach adjusts explanations and lesson difficulty to match."}
                            </p>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "12px" }}>
                            {(v.obLevels || []).map((l, $index) => (
                              <React.Fragment key={l && l.key != null ? l.key : $index}>
                                <div onClick={l.onClick} style={{ border: `1px solid ${l.border}`, background: l.bg, borderRadius: "14px", padding: "18px", display: "flex", gap: "14px", alignItems: "center", cursor: "pointer", transition: "all .15s" }}>
                                  <span style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${l.ring}`, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: l.dot }} />
                                  </span>
                                  <div>
                                    <div style={{ fontSize: "16px", fontWeight: "600" }}>
                                      {l.t}
                                    </div>
                                    <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12.5px", color: "var(--text-3)", marginTop: "3px" }}>
                                      {l.r}
                                    </div>
                                  </div>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "14px", color: "var(--text-2)" }}>
                              {"Or enter your rating"}
                            </span>
                            <input value={v.obRating} onChange={v.onObRating} inputMode={"numeric"} placeholder={"e.g. 1350"} style={{ width: "140px", height: "42px", padding: "0 14px", borderRadius: "11px", border: "1px solid var(--border-2)", background: "var(--surface)", color: "var(--text)", fontFamily: "'Geist Mono',monospace", fontSize: "14px", outline: "none" }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                            <button onClick={v.obBack} style={{ height: "44px", padding: "0 18px", borderRadius: "11px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
                              {"← Back"}
                            </button>
                            <button onClick={v.obNext} style={{ height: "44px", padding: "0 22px", borderRadius: "11px", border: "none", background: "var(--text)", color: "var(--bg)", fontSize: "14px", fontWeight: "600", cursor: v.obNextCursor, opacity: v.obNextOp }}>
                              {"Continue"}
                            </button>
                          </div>
                        </div>
                      </>
                    ) : null}
                    {v.ob2 ? (
                      <>
                        <div style={{ display: "flex", flexDirection: "column", gap: "22px", animation: "ccIn .35s ease-out" }}>
                          <div>
                            <div style={{ fontSize: "13px", color: "var(--text-3)" }}>
                              {"Step 3 of 4"}
                            </div>
                            <h1 style={{ margin: "6px 0 0", fontSize: "32px", fontWeight: "600", letterSpacing: "-.025em" }}>
                              {"What do you want to learn?"}
                            </h1>
                            <p style={{ margin: "8px 0 0", fontSize: "15px", color: "var(--text-2)" }}>
                              {"Pick as many as you like."}
                            </p>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "12px" }}>
                            {(v.obGoals || []).map((g, $index) => (
                              <React.Fragment key={g && g.key != null ? g.key : $index}>
                                <div onClick={g.onClick} style={{ border: `1px solid ${g.border}`, background: g.bg, borderRadius: "14px", padding: "18px", display: "flex", gap: "14px", alignItems: "center", cursor: "pointer", transition: "all .15s" }}>
                                  <span style={{ width: "20px", height: "20px", borderRadius: "6px", border: `2px solid ${g.cb}`, background: g.cf, color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", flex: "none" }}>
                                    {g.mark}
                                  </span>
                                  <span style={{ fontSize: "15px", fontWeight: "500" }}>
                                    {g.t}
                                  </span>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                            <button onClick={v.obBack} style={{ height: "44px", padding: "0 18px", borderRadius: "11px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
                              {"← Back"}
                            </button>
                            <button onClick={v.obNext} style={{ height: "44px", padding: "0 22px", borderRadius: "11px", border: "none", background: "var(--text)", color: "var(--bg)", fontSize: "14px", fontWeight: "600", cursor: v.obNextCursor, opacity: v.obNextOp }}>
                              {"Continue"}
                            </button>
                          </div>
                        </div>
                      </>
                    ) : null}
                    {v.ob3 ? (
                      <>
                        <div style={{ display: "flex", flexDirection: "column", gap: "22px", animation: "ccIn .35s ease-out" }}>
                          <div>
                            <div style={{ fontSize: "13px", color: "var(--text-3)" }}>
                              {"Step 4 of 4"}
                            </div>
                            <h1 style={{ margin: "6px 0 0", fontSize: "32px", fontWeight: "600", letterSpacing: "-.025em" }}>
                              {"Choose your first opening"}
                            </h1>
                            <p style={{ margin: "8px 0 0", fontSize: "15px", color: "var(--text-2)" }}>
                              {"You can add more any time from the opening library."}
                            </p>
                          </div>
                          <div style={{ display: "flex", gap: "2px", padding: "3px", borderRadius: "11px", background: "var(--surface)", border: "1px solid var(--border)", alignSelf: "flex-start" }}>
                            {(v.obSides || []).map((o, $index) => (
                              <React.Fragment key={o && o.key != null ? o.key : $index}>
                                <button onClick={o.onClick} style={{ height: "34px", padding: "0 16px", border: "none", borderRadius: "8px", background: o.bg, color: o.color, fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                                  {o.label}
                                </button>
                              </React.Fragment>
                            ))}
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "14px" }}>
                            {(v.obOpenings || []).map((o, $index) => (
                              <React.Fragment key={o && o.key != null ? o.key : $index}>
                                <div onClick={o.onClick} style={{ border: `1px solid ${o.border}`, background: o.bg, borderRadius: "16px", padding: "12px", display: "flex", flexDirection: "column", gap: "10px", cursor: "pointer", transition: "all .15s" }}>
                                  <div style={{ width: "100%" }}><Chessboard fen={o.fen} orientation={o.orient} interactive={false} coords={false} /></div>
                                  <div style={{ padding: "0 4px", display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                                      <span style={{ fontSize: "15px", fontWeight: "600" }}>
                                        {o.name}
                                      </span>
                                      <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", color: "var(--text-3)" }}>
                                        {o.eco}
                                      </span>
                                    </div>
                                    <div style={{ display: "flex", gap: "10px", fontSize: "12px" }}>
                                      <span style={{ color: o.diffColor, fontWeight: "500" }}>
                                        {o.diff}
                                      </span>
                                      <span style={{ color: "var(--text-3)" }}>
                                        {o.time}
                                      </span>
                                    </div>
                                    {o.started ? (
                                      <>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "2px" }}>
                                          <div style={{ flex: "1", height: "4px", borderRadius: "2px", background: "var(--surface-3)", overflow: "hidden" }}>
                                            <div style={{ width: o.w, height: "100%", background: "var(--amber)" }} />
                                          </div>
                                          <span style={{ fontSize: "11px", color: "var(--text-2)" }}>
                                            {o.w}
                                          </span>
                                        </div>
                                      </>
                                    ) : null}
                                  </div>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                            <button onClick={v.obBack} style={{ height: "44px", padding: "0 18px", borderRadius: "11px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
                              {"← Back"}
                            </button>
                            <button onClick={v.obStart} style={{ height: "44px", padding: "0 22px", borderRadius: "11px", border: "none", background: "var(--coach)", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: v.obNextCursor, opacity: v.obNextOp }}>
                              {"Start Learning →"}
                            </button>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </>
              ) : null}
              {v.isDash ? (
                <>
                  <div style={{ maxWidth: "1240px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px", animation: "ccIn .35s ease-out" }}>
                    <div style={{ padding: "4px 0 6px" }}>
                      <h1 style={{ margin: "0", fontSize: "30px", fontWeight: "600", letterSpacing: "-.025em" }}>
                        {"Good evening, Bala"}
                      </h1>
                      <p style={{ margin: "6px 0 0", color: "var(--text-2)", fontSize: "15px" }}>
                        {"Here’s what your chess training looks like today."}
                      </p>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                      {v.hasData ? (
                        <>
                          <div style={{ flex: "2 1 520px", minWidth: "0", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", display: "flex", gap: "28px", alignItems: "center", flexWrap: "wrap" }}>
                            <div style={{ flex: "1 1 260px", minWidth: "0", display: "flex", flexDirection: "column", gap: "14px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--coach)" }} />
                                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", textTransform: "uppercase", color: "var(--coach)" }}>
                                  {"Today’s training"}
                                </span>
                              </div>
                              <div style={{ fontSize: "28px", fontWeight: "600", letterSpacing: "-.02em" }}>
                                {"Caro-Kann Defense"}
                              </div>
                              <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", color: "var(--text-2)", fontSize: "14px" }}>
                                <span>
                                  {"8 positions to review"}
                                </span>
                                <span>
                                  {"Estimated time: 12 min"}
                                </span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{ flex: "1", height: "6px", borderRadius: "3px", background: "var(--surface-3)", overflow: "hidden" }}>
                                  <div style={{ width: "51%", height: "100%", borderRadius: "3px", background: "var(--amber)" }} />
                                </div>
                                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--text-2)" }}>
                                  {"51% mastered"}
                                </span>
                              </div>
                              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "6px" }}>
                                <button onClick={v.goTrainer} style={{ display: "inline-flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 18px", borderRadius: "10px", border: "none", background: "var(--text)", color: "var(--bg)", fontSize: "14px", fontWeight: "600", cursor: "pointer" }} className="cc-hover-4">
                                  {"Continue Training"}
                                  <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} style={{ strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }}>
                                    <path d={"M5 12h14M12 5l7 7-7 7"} />
                                  </svg>
                                </button>
                                <button onClick={v.goPractice} style={{ height: "40px", padding: "0 16px", borderRadius: "10px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", fontSize: "14px", fontWeight: "500", cursor: "pointer" }} className="cc-hover-5">
                                  {"Review queue"}
                                </button>
                              </div>
                            </div>
                            <div style={{ width: "196px", flex: "none" }}>
                              <div style={{ width: "196px" }}><Chessboard fen={v.heroFen} orientation={"black"} interactive={false} coords={false} marks={v.heroMarks} /></div>
                            </div>
                          </div>
                        </>
                      ) : null}
                      {v.isEmpty ? (
                        <>
                          <div style={{ flex: "2 1 520px", minWidth: "0", background: "var(--surface)", border: "1px dashed var(--border-2)", borderRadius: "16px", padding: "36px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
                            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", textTransform: "uppercase", color: "var(--text-3)" }}>
                              {"Today’s training"}
                            </div>
                            <div style={{ fontSize: "22px", fontWeight: "600", letterSpacing: "-.015em" }}>
                              {"No opening selected yet"}
                            </div>
                            <p style={{ margin: "0", color: "var(--text-2)", fontSize: "14px", maxWidth: "440px", lineHeight: "1.55" }}>
                              {"Pick your first opening and your coach will build a short daily session around it — new moves, review, and the ideas behind them."}
                            </p>
                            <button onClick={v.goLibrary} style={{ marginTop: "6px", height: "40px", padding: "0 18px", borderRadius: "10px", border: "none", background: "var(--text)", color: "var(--bg)", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                              {"Choose an opening"}
                            </button>
                          </div>
                        </>
                      ) : null}
                      <div style={{ flex: "1 1 260px", minWidth: "0", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                          <span style={{ fontSize: "40px", fontWeight: "600", letterSpacing: "-.03em", color: "var(--amber)" }}>
                            {"7"}
                          </span>
                          <span style={{ fontSize: "16px", fontWeight: "600" }}>
                            {"Day Streak"}
                          </span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "6px" }}>
                          {(v.streakDays || []).map((d, $index) => (
                            <React.Fragment key={d && d.key != null ? d.key : $index}>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                                <div style={{ width: "100%", aspectRatio: "1", maxWidth: "34px", borderRadius: "9px", background: d.bg, color: d.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700" }}>
                                  {d.mark}
                                </div>
                                <span style={{ fontSize: "11px", color: "var(--text-3)" }}>
                                  {d.d}
                                </span>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                        <p style={{ margin: "0", fontSize: "13px", color: "var(--text-2)", lineHeight: "1.5" }}>
                          {"Finish today’s review to make it 8 days in a row."}
                        </p>
                      </div>
                    </div>
                    {v.hasData ? (
                      <>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "16px" }}>
                          {(v.dashStats || []).map((st, $index) => (
                            <React.Fragment key={st && st.key != null ? st.key : $index}>
                              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                                <span style={{ fontSize: "13px", color: "var(--text-2)" }}>
                                  {st.label}
                                </span>
                                <span style={{ fontSize: "28px", fontWeight: "600", letterSpacing: "-.02em" }}>
                                  {st.value}
                                </span>
                                <span style={{ fontSize: "12px", color: "var(--text-3)" }}>
                                  {st.sub}
                                </span>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                          <div style={{ flex: "1.1 1 420px", minWidth: "0", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                                {"Opening mastery"}
                              </span>
                              <span onClick={v.goLibrary} style={{ fontSize: "13px", color: "var(--text-2)", cursor: "pointer" }}>
                                {"All openings →"}
                              </span>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: "12px" }}>
                              {(v.masteryCards || []).map((m, $index) => (
                                <React.Fragment key={m && m.key != null ? m.key : $index}>
                                  <div onClick={m.onClick} style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px", cursor: "pointer", background: "var(--surface)" }} className="cc-hover-6">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                                      <span style={{ fontSize: "14px", fontWeight: "600" }}>
                                        {m.name}
                                      </span>
                                      <span style={{ fontSize: "12px", color: "var(--text-3)" }}>
                                        {m.side}
                                      </span>
                                    </div>
                                    <span style={{ fontSize: "26px", fontWeight: "600", letterSpacing: "-.02em" }}>
                                      {m.pct}
                                    </span>
                                    <div style={{ height: "5px", borderRadius: "3px", background: "var(--surface-3)", overflow: "hidden" }}>
                                      <div style={{ width: m.w, height: "100%", background: m.color, borderRadius: "3px", transition: "width .6s" }} />
                                    </div>
                                  </div>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                          <div style={{ flex: "1 1 380px", minWidth: "0", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column", gap: "6px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "8px" }}>
                              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                                {"Your recent weaknesses"}
                              </span>
                              <span style={{ fontSize: "12px", color: "var(--text-3)" }}>
                                {"From games + training"}
                              </span>
                            </div>
                            {(v.weakItems || []).map((wk, $index) => (
                              <React.Fragment key={wk && wk.key != null ? wk.key : $index}>
                                <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 0", borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
                                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--amber)", flex: "none" }} />
                                  <div style={{ flex: "1 1 180px", minWidth: "0" }}>
                                    <div style={{ fontSize: "14px", fontWeight: "500" }}>
                                      {wk.title}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "3px" }}>
                                      {wk.ctx}
                                    </div>
                                  </div>
                                  <button onClick={wk.onClick} style={{ height: "32px", padding: "0 12px", borderRadius: "9px", border: "1px solid var(--coach-line)", background: "var(--coach-soft)", color: "var(--coach)", fontSize: "13px", fontWeight: "500", cursor: "pointer", whiteSpace: "nowrap" }}>
                                    {"Practice this position"}
                                  </button>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </>
              ) : null}
              {v.isLib ? <React.Suspense fallback={<p role="status">Loading opening library…</p>}><OpeningLibrary coords={this.state.coords}/></React.Suspense> : null}
              {v.isOver ? (
                <>
                  <div style={{ maxWidth: "1240px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px", animation: "ccIn .35s ease-out" }}>
                    <span onClick={v.goLibrary} style={{ fontSize: "13px", color: "var(--text-2)", cursor: "pointer", alignSelf: "flex-start" }}>
                      {"← All openings"}
                    </span>
                    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "18px", padding: "24px", display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "center" }}>
                      <div style={{ width: "260px", maxWidth: "100%", flex: "none" }}>
                        <div style={{ width: "100%" }}><Chessboard fen={v.opFen} orientation={v.opOrient} interactive={false} coords={false} /></div>
                      </div>
                      <div style={{ flex: "1 1 320px", minWidth: "0", display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", textTransform: "uppercase", color: "var(--text-3)" }}>
                          {v.opSide}{" · ECO "}{v.op.eco}
                        </div>
                        <h1 style={{ margin: "0", fontSize: "34px", fontWeight: "600", letterSpacing: "-.03em" }}>
                          {v.op.name}
                        </h1>
                        <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6", color: "var(--text-2)", maxWidth: "560px", textWrap: "pretty" }}>
                          {v.op.desc}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", maxWidth: "520px" }}>
                          <div style={{ flex: "1", height: "6px", borderRadius: "3px", background: "var(--surface-3)", overflow: "hidden" }}>
                            <div style={{ width: v.opW, height: "100%", background: "var(--amber)" }} />
                          </div>
                          <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--text-2)" }}>
                            {v.opW}{" Mastered"}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", paddingTop: "4px" }}>
                          {(v.ovStats || []).map((st, $index) => (
                            <React.Fragment key={st && st.key != null ? st.key : $index}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <span style={{ fontSize: "17px", fontWeight: "600" }}>
                                  {st.v}
                                </span>
                                <span style={{ fontSize: "12px", color: "var(--text-3)" }}>
                                  {st.l}
                                </span>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", paddingTop: "4px" }}>
                          <button onClick={v.goTrainer} style={{ height: "40px", padding: "0 18px", borderRadius: "10px", border: "none", background: "var(--text)", color: "var(--bg)", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                            {v.ovCta}{" →"}
                          </button>
                          <button onClick={v.goPractice} style={{ height: "40px", padding: "0 16px", borderRadius: "10px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", fontSize: "14px", fontWeight: "500", cursor: "pointer" }} className="cc-hover-8">
                            {"Practice positions"}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <h2 style={{ margin: "0", fontSize: "18px", fontWeight: "600" }}>
                        {"Learning path"}
                      </h2>
                      <span style={{ fontSize: "13px", color: "var(--text-3)" }}>
                        {"8 lessons"}
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: "14px" }}>
                      {(v.lessons || []).map((l, $index) => (
                        <React.Fragment key={l && l.key != null ? l.key : $index}>
                          <div onClick={l.onClick} style={{ background: l.bg, border: `1px solid ${l.border}`, borderRadius: "14px", padding: "18px", display: "flex", flexDirection: "column", gap: "10px", opacity: l.op, cursor: l.cursor, minHeight: "150px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-3)" }}>
                                {l.n}
                              </span>
                              {l.isDone ? (
                                <>
                                  <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "var(--green)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} style={{ strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round" }}>
                                      <path d={"M20 6L9 17l-5-5"} />
                                    </svg>
                                  </span>
                                </>
                              ) : null}
                              {l.isLocked ? (
                                <>
                                  <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} style={{ color: "var(--text-3)", strokeWidth: "1.8", strokeLinecap: "round" }}>
                                    <path d={"M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4"} />
                                  </svg>
                                </>
                              ) : null}
                              {l.isCurrent ? (
                                <>
                                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--coach)", boxShadow: "0 0 0 4px var(--coach-soft)" }} />
                                </>
                              ) : null}
                            </div>
                            <div style={{ fontSize: "16px", fontWeight: "600" }}>
                              {l.title}
                            </div>
                            <div style={{ fontSize: "13px", color: "var(--text-2)", flex: "1" }}>
                              {l.desc}
                            </div>
                            <div style={{ fontSize: "12px", fontWeight: "500", color: "var(--text-3)" }}>
                              {l.status}
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
              {this.state.screen === 'play' ? <PlayChess coords={this.state.coords} /> : null}
              {v.isTrainer ? (
                <>
                  <div style={{ maxWidth: "1320px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "18px", animation: "ccIn .35s ease-out" }}>
                    <div style={{ display: "flex", gap: "16px", alignItems: "flex-end", flexWrap: "wrap" }}>
                      <div style={{ flex: "1 1 280px", minWidth: "0" }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", textTransform: "uppercase", color: "var(--text-3)" }}>
                          <span onClick={v.goCaro} style={{ cursor: "pointer", color: "var(--text-2)" }}>
                            {"Caro-Kann Defense"}
                          </span>
                          <span>
                            {"·"}
                          </span>
                          <span>
                            {"Lesson 2 of 8"}
                          </span>
                        </div>
                        <h1 style={{ margin: "6px 0 0", fontSize: "26px", fontWeight: "600", letterSpacing: "-.02em" }}>
                          {"Main Line"}
                        </h1>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "220px" }}>
                        <span style={{ fontSize: "13px", color: "var(--text-2)", textAlign: "right" }}>
                          {"Progress: "}
                          <span style={{ color: "var(--text)", fontWeight: "600" }}>
                            {v.posLabel}
                          </span>
                        </span>
                        <div style={{ display: "flex", gap: "4px" }}>
                          {(v.posSegs || []).map((g, $index) => (
                            <React.Fragment key={g && g.key != null ? g.key : $index}>
                              <div style={{ flex: "1", height: "5px", borderRadius: "3px", background: g.bg, transition: "background .4s" }} />
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" }}>
                      <div style={{ flex: "1.5 1 440px", minWidth: "0", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", maxWidth: "640px", width: "100%", margin: "0 auto" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-2)" }}>
                            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#24211d", border: "1px solid var(--border-2)" }} />
                            {v.sideToMove}
                          </div>
                          {v.showEngine ? (
                            <>
                              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--text-3)", padding: "3px 8px", border: "1px solid var(--border)", borderRadius: "6px" }}>
                                {"Engine "}{v.tEval}
                              </span>
                            </>
                          ) : null}
                        </div>
                        <div style={{ maxWidth: "640px", width: "100%", margin: "0 auto" }}>
                          <div style={{ width: "100%" }}><Chessboard fen={v.tBoard.fen} marks={v.tBoard.marks} arrows={v.tBoard.arrows} orientation={"black"} coords={v.coords} onMove={v.onTrainerMove} /></div>
                        </div>
                        {v.notMobile ? (
                          <>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", maxWidth: "640px", width: "100%", margin: "4px auto 0" }}>
                              <button onClick={v.onPrev} style={{ height: "38px", padding: "0 14px", borderRadius: "10px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", fontSize: "13px", fontWeight: "500", cursor: "pointer" }} className="cc-hover-9">
                                {"← Previous"}
                              </button>
                              <button onClick={v.onHint} style={{ height: "38px", padding: "0 14px", borderRadius: "10px", border: "1px solid var(--amber-line)", background: "var(--amber-soft)", color: "var(--amber)", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                                {v.hintLabel}
                              </button>
                              <button onClick={v.onReset} style={{ height: "38px", padding: "0 14px", borderRadius: "10px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", fontSize: "13px", fontWeight: "500", cursor: "pointer" }} className="cc-hover-10">
                                {"Reset"}
                              </button>
                              <button onClick={v.onEngine} style={{ height: "38px", padding: "0 14px", borderRadius: "10px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text-2)", fontSize: "13px", fontWeight: "500", cursor: "pointer" }} className="cc-hover-11">
                                {v.engineLabel}
                              </button>
                              <button onClick={v.onNextPos} style={{ height: "38px", padding: "0 16px", borderRadius: "10px", border: "none", background: "var(--text)", color: "var(--bg)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                                {"Next Position →"}
                              </button>
                            </div>
                          </>
                        ) : null}
                        <div style={{ maxWidth: "640px", width: "100%", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "2px", alignItems: "center", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "12px", background: "var(--surface)" }}>
                          <span style={{ fontSize: "11px", fontFamily: "'Geist Mono',monospace", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--text-3)", marginRight: "8px" }}>
                            {"Moves"}
                          </span>
                          {(v.tPlies || []).map((pl, $index) => (
                            <React.Fragment key={pl && pl.key != null ? pl.key : $index}>
                              <span onClick={pl.onClick} title={"Why was this played?"} style={{ fontFamily: "'Geist Mono',monospace", fontSize: "13px", padding: "4px 7px", borderRadius: "6px", cursor: "pointer", background: pl.bg, color: pl.color }} className="cc-hover-12">
                                {pl.label}
                              </span>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      {v.sheetOpen ? (
                        <>
                          <div onClick={v.toggleSheet} style={{ position: "fixed", inset: "0", background: "rgba(0,0,0,.45)", zIndex: "55" }} />
                        </>
                      ) : null}
                      <div style={{ flex: "1 1 360px", minWidth: "0", position: v.sheetPos, left: v.sheetLeft, width: v.sheetW, bottom: "0", zIndex: v.sheetZ, maxHeight: v.sheetMaxH, overflow: "auto", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: v.sheetRadius, display: "flex", flexDirection: "column" }}>
                        {v.isMobile ? (
                          <>
                            <div onClick={v.toggleSheet} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "10px 0 0", cursor: "pointer" }}>
                              <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "var(--border-2)" }} />
                              <span style={{ fontSize: "11px", color: "var(--text-3)" }}>
                                {v.sheetLabel}
                              </span>
                            </div>
                          </>
                        ) : null}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "18px 20px 14px" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "11px", background: "var(--coach-soft)", border: "1px solid var(--coach-line)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--coach)" }}>
                            <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"currentColor"}>
                              <path d={"M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"} />
                            </svg>
                          </div>
                          <div style={{ flex: "1", minWidth: "0" }}>
                            <div style={{ fontSize: "15px", fontWeight: "600" }}>
                              {"Your Coach"}
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-3)" }}>
                              {"Watching every move on the board"}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "2px", margin: "0 16px", padding: "3px", borderRadius: "10px", background: "var(--surface-2)", overflowX: "auto" }}>
                          {(v.tabs || []).map((tb, $index) => (
                            <React.Fragment key={tb && tb.key != null ? tb.key : $index}>
                              <button onClick={tb.onClick} style={{ flex: "1", height: "30px", padding: "0 10px", border: "none", borderRadius: "8px", background: tb.bg, color: tb.color, fontSize: "13px", fontWeight: "500", cursor: "pointer", whiteSpace: "nowrap" }}>
                                {tb.label}
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                        <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                          {v.tabCoach ? (
                            <>
                              {v.tAsk ? (
                                <>
                                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "ccIn .3s ease-out" }}>
                                    <span style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "7px", height: "26px", padding: "0 10px", borderRadius: "999px", background: "var(--coach-soft)", color: "var(--coach)", fontSize: "12px", fontWeight: "600" }}>
                                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--coach)" }} />
                                      {"Your move"}
                                    </span>
                                    <div style={{ fontSize: "22px", fontWeight: "600", letterSpacing: "-.015em" }}>
                                      {"What would you play here?"}
                                    </div>
                                    <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.6", color: "var(--text-2)" }}>
                                      {v.step.ctx}{" Drag a piece or tap a piece, then a square."}
                                    </p>
                                    {v.hasWrong ? (
                                      <>
                                        <div style={{ border: "1px solid var(--red-line)", background: "var(--red-soft)", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px", animation: "ccIn .25s ease-out" }}>
                                          <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--red)" }}>
                                            {"Not quite — "}{v.wrongSan}
                                          </div>
                                          {v.wrongHasAlt ? (
                                            <>
                                              <p style={{ margin: "0", fontSize: "13.5px", lineHeight: "1.55", color: "var(--text-2)" }}>
                                                {"It’s playable, but there’s a more natural idea here. Want to see what happens after it?"}
                                              </p>
                                              <button onClick={v.onWrongWhatIf} style={{ alignSelf: "flex-start", height: "32px", padding: "0 12px", borderRadius: "9px", border: "1px solid var(--coach-line)", background: "var(--coach-soft)", color: "var(--coach)", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                                                {"What if I play "}{v.wrongSan}{"?"}
                                              </button>
                                            </>
                                          ) : null}
                                          {v.wrongNoAlt ? (
                                            <>
                                              <p style={{ margin: "0", fontSize: "13.5px", lineHeight: "1.55", color: "var(--text-2)" }}>
                                                {"Try again. "}{v.step.hint}
                                              </p>
                                            </>
                                          ) : null}
                                        </div>
                                      </>
                                    ) : null}
                                    {v.showHint ? (
                                      <>
                                        <div style={{ border: "1px solid var(--amber-line)", background: "var(--amber-soft)", borderRadius: "12px", padding: "14px", display: "flex", gap: "10px", animation: "ccIn .25s ease-out" }}>
                                          <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--amber)", fontFamily: "'Geist Mono',monospace", letterSpacing: ".06em" }}>
                                            {"HINT"}
                                          </span>
                                          <span style={{ fontSize: "13.5px", lineHeight: "1.55", color: "var(--text)" }}>
                                            {v.step.hint}
                                          </span>
                                        </div>
                                      </>
                                    ) : null}
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", paddingTop: "4px" }}>
                                      <button onClick={v.onHint} style={{ height: "34px", padding: "0 12px", borderRadius: "9px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", fontSize: "13px", fontWeight: "500", cursor: "pointer" }} className="cc-hover-13">
                                        {v.hintLabel}
                                      </button>
                                      <button onClick={v.onWhatIf} style={{ height: "34px", padding: "0 12px", borderRadius: "9px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", fontSize: "13px", fontWeight: "500", cursor: "pointer" }} className="cc-hover-14">
                                        {"What if I play another move?"}
                                      </button>
                                      <button onClick={v.onPlan} style={{ height: "34px", padding: "0 12px", borderRadius: "9px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", fontSize: "13px", fontWeight: "500", cursor: "pointer" }} className="cc-hover-15">
                                        {"What is my plan?"}
                                      </button>
                                    </div>
                                  </div>
                                </>
                              ) : null}
                              {v.tCorrect ? (
                                <>
                                  <div style={{ display: "flex", flexDirection: "column", gap: "18px", animation: "ccIn .35s ease-out" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", borderRadius: "12px", background: "var(--green-soft)", border: "1px solid var(--green-line)" }}>
                                      <span style={{ width: "30px", height: "30px", borderRadius: "50%", background: "var(--green)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                                        <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} style={{ strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round" }}>
                                          <path d={"M20 6L9 17l-5-5"} />
                                        </svg>
                                      </span>
                                      <div style={{ flex: "1" }}>
                                        <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--green)" }}>
                                          {"Correct Move"}
                                        </div>
                                        <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: "20px", fontWeight: "600" }}>
                                          {v.step.san}
                                        </div>
                                      </div>
                                      {v.showEngine ? (
                                        <>
                                          <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--text-3)" }}>
                                            {v.tEval}
                                          </span>
                                        </>
                                      ) : null}
                                    </div>
                                    <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6", textWrap: "pretty" }}>
                                      {v.explainText}
                                    </p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                      <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", color: "var(--text-3)" }}>
                                        {"WHY THIS MOVE?"}
                                      </span>
                                      <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.6", color: "var(--text-2)" }}>
                                        {v.step.why}
                                      </p>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                      <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", color: "var(--text-3)" }}>
                                        {"WHAT HAPPENS NEXT?"}
                                      </span>
                                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
                                        {(v.nextSeq || []).map((nm, $index) => (
                                          <React.Fragment key={nm && nm.key != null ? nm.key : $index}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "13px", fontWeight: "500", padding: "6px 9px", borderRadius: "8px", background: nm.bg, color: nm.color }}>
                                                {nm.n}{nm.san}
                                              </span>
                                              <span style={{ color: "var(--text-3)", fontSize: "12px" }}>
                                                {nm.arrow}
                                              </span>
                                            </div>
                                          </React.Fragment>
                                        ))}
                                      </div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                      <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", color: "var(--text-3)" }}>
                                        {"YOUR PLAN"}
                                      </span>
                                      {(v.plan || []).map((pn, $index) => (
                                        <React.Fragment key={pn && pn.key != null ? pn.key : $index}>
                                          <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "14px" }}>
                                            <span style={{ width: "20px", height: "20px", borderRadius: "6px", background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "600", color: pn.done, flex: "none" }}>
                                              {pn.n}
                                            </span>
                                            {pn.t}
                                          </div>
                                        </React.Fragment>
                                      ))}
                                    </div>
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                                      <button onClick={v.onWhy} style={{ height: "34px", padding: "0 12px", borderRadius: "9px", border: "1px solid var(--coach-line)", background: "var(--coach-soft)", color: "var(--coach)", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                                        {"Why?"}
                                      </button>
                                      <button onClick={v.onWhatIf} style={{ height: "34px", padding: "0 12px", borderRadius: "9px", border: "1px solid var(--coach-line)", background: "var(--coach-soft)", color: "var(--coach)", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                                        {"What if?"}
                                      </button>
                                      <button onClick={v.onShowBoard} style={{ height: "34px", padding: "0 12px", borderRadius: "9px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", fontSize: "13px", fontWeight: "500", cursor: "pointer" }} className="cc-hover-16">
                                        {"Show on board"}
                                      </button>
                                      <button onClick={v.onSimpler} style={{ height: "34px", padding: "0 12px", borderRadius: "9px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", fontSize: "13px", fontWeight: "500", cursor: "pointer" }} className="cc-hover-17">
                                        {v.simplerLabel}
                                      </button>
                                      <button onClick={v.onNextMove} style={{ height: "34px", padding: "0 14px", borderRadius: "9px", border: "none", background: "var(--text)", color: "var(--bg)", fontSize: "13px", fontWeight: "600", cursor: "pointer", marginLeft: "auto" }}>
                                        {"Next move →"}
                                      </button>
                                    </div>
                                  </div>
                                </>
                              ) : null}
                              {v.tDone ? (
                                <>
                                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", alignItems: "flex-start", animation: "ccIn .35s ease-out" }}>
                                    <span style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--green)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                      <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} style={{ strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round" }}>
                                        <path d={"M20 6L9 17l-5-5"} />
                                      </svg>
                                    </span>
                                    <div style={{ fontSize: "22px", fontWeight: "600", letterSpacing: "-.015em" }}>
                                      {"Position complete"}
                                    </div>
                                    <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.6", color: "var(--text-2)" }}>
                                      {"You found ...dxe4, ...Bf5 and ...Bg6 — the backbone of the main line. White now plays 6.Nf3, and your plan is ...Nd7, ...Ngf6, ...e6 and castle."}
                                    </p>
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                      <button onClick={v.onNextPos} style={{ height: "38px", padding: "0 16px", borderRadius: "10px", border: "none", background: "var(--text)", color: "var(--bg)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                                        {"Next Position →"}
                                      </button>
                                      <button onClick={v.onReset} style={{ height: "38px", padding: "0 14px", borderRadius: "10px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                                        {"Replay"}
                                      </button>
                                    </div>
                                  </div>
                                </>
                              ) : null}
                            </>
                          ) : null}
                          {v.tabWhatIf ? (
                            <>
                              <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "ccIn .3s ease-out" }}>
                                <div>
                                  <div style={{ fontSize: "20px", fontWeight: "600", letterSpacing: "-.015em" }}>
                                    {"What If?"}
                                  </div>
                                  <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "var(--text-2)" }}>
                                    {"Ask about any move — or just play it on the board."}
                                  </p>
                                </div>
                                <div style={{ display: "flex", gap: "8px", alignItems: "center", height: "42px", padding: "0 6px 0 14px", border: "1px solid var(--border-2)", borderRadius: "11px", background: "var(--surface-2)" }}>
                                  <input value={v.wiText} onChange={v.onWiText} onKeyDown={v.onWiKey} placeholder={"What if I play ...Nf6?"} style={{ flex: "1", minWidth: "0", border: "none", outline: "none", background: "transparent", color: "var(--text)", fontSize: "14px" }} />
                                  <button onClick={v.onWiSend} style={{ height: "30px", padding: "0 12px", borderRadius: "8px", border: "none", background: "var(--coach)", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                                    {"Ask"}
                                  </button>
                                </div>
                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                  {(v.wiChips || []).map((c, $index) => (
                                    <React.Fragment key={c && c.key != null ? c.key : $index}>
                                      <button onClick={c.onClick} style={{ height: "30px", padding: "0 11px", borderRadius: "999px", border: `1px solid ${c.border}`, background: c.bg, color: "var(--text)", fontSize: "12.5px", cursor: "pointer" }}>
                                        {c.label}
                                      </button>
                                    </React.Fragment>
                                  ))}
                                </div>
                                {v.hasWi ? (
                                  <>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "ccIn .3s ease-out" }}>
                                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                        <div style={{ border: "1px solid var(--amber-line)", background: "var(--amber-soft)", borderRadius: "12px", padding: "12px 14px" }}>
                                          <div style={{ fontSize: "12px", color: "var(--amber)", fontWeight: "600" }}>
                                            {"Your move"}
                                          </div>
                                          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: "19px", fontWeight: "600", marginTop: "4px" }}>
                                            {v.wi.san}
                                          </div>
                                          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", color: "var(--text-3)", marginTop: "4px" }}>
                                            {"eval "}{v.wi.ev}
                                          </div>
                                        </div>
                                        <div style={{ border: "1px solid var(--green-line)", background: "var(--green-soft)", borderRadius: "12px", padding: "12px 14px" }}>
                                          <div style={{ fontSize: "12px", color: "var(--green)", fontWeight: "600" }}>
                                            {"Recommended"}
                                          </div>
                                          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: "19px", fontWeight: "600", marginTop: "4px" }}>
                                            {v.recSan}
                                          </div>
                                          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", color: "var(--text-3)", marginTop: "4px" }}>
                                            {"eval "}{v.recEval}
                                          </div>
                                        </div>
                                      </div>
                                      <p style={{ margin: "0", fontSize: "14.5px", lineHeight: "1.6", textWrap: "pretty" }}>
                                        {v.wi.explain}
                                      </p>
                                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                        <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", color: "var(--text-3)" }}>
                                          {"IF YOU PLAY "}{v.wi.san}{" · LIKELY CONTINUATION"}
                                        </span>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
                                          {(v.wiLine || []).map((lm, $index) => (
                                            <React.Fragment key={lm && lm.key != null ? lm.key : $index}>
                                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "13px", padding: "6px 9px", borderRadius: "8px", background: "var(--surface-3)" }}>
                                                  {lm.m}
                                                </span>
                                                <span style={{ color: "var(--text-3)", fontSize: "12px" }}>
                                                  {lm.arrow}
                                                </span>
                                              </div>
                                            </React.Fragment>
                                          ))}
                                        </div>
                                      </div>
                                      <div style={{ borderRadius: "12px", background: "var(--surface-2)", padding: "12px 14px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                        <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--amber)" }}>
                                          {"Main downside"}
                                        </span>
                                        <span style={{ fontSize: "14px", lineHeight: "1.5" }}>
                                          {v.wi.down}
                                        </span>
                                      </div>
                                      <button onClick={v.showBetterPlan} style={{ alignSelf: "flex-start", height: "36px", padding: "0 14px", borderRadius: "10px", border: "none", background: "var(--text)", color: "var(--bg)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                                        {"Show better plan →"}
                                      </button>
                                    </div>
                                  </>
                                ) : null}
                                {v.noWi ? (
                                  <>
                                    <div style={{ padding: "22px", border: "1px dashed var(--border-2)", borderRadius: "12px", fontSize: "13.5px", color: "var(--text-2)", lineHeight: "1.55" }}>
                                      {"Pick a question above or move a piece. Your move is drawn in amber, the recommended move in green."}
                                    </div>
                                  </>
                                ) : null}
                                {v.wiMain ? (
                                  <>
                                    <div style={{ padding: "14px", border: "1px solid var(--green-line)", background: "var(--green-soft)", borderRadius: "12px", fontSize: "14px", lineHeight: "1.55" }}>
                                      {"That’s the main move! Switch back to Coach and play "}{v.recSan}{" on the board."}
                                    </div>
                                  </>
                                ) : null}
                                {v.wiUnknown ? (
                                  <>
                                    <div style={{ padding: "14px", border: "1px solid var(--border-2)", borderRadius: "12px", fontSize: "14px", lineHeight: "1.55", color: "var(--text-2)" }}>
                                      {"I don’t have a deep look at “"}{v.wiMissText}{"” yet. In this position, the moves worth comparing are the ones above — or ask me in Chat."}
                                    </div>
                                  </>
                                ) : null}
                              </div>
                            </>
                          ) : null}
                          {v.tabWhy ? (
                            <>
                              <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "ccIn .3s ease-out" }}>
                                <span style={{ fontSize: "12.5px", color: "var(--text-3)" }}>
                                  {"Tap any move in the move list to ask why it was played."}
                                </span>
                                <div style={{ fontSize: "21px", fontWeight: "600", letterSpacing: "-.015em" }}>
                                  {"Why was "}
                                  <span style={{ fontFamily: "'Geist Mono',monospace", color: "var(--coach)" }}>
                                    {v.whyMove}
                                  </span>
                                  {" played?"}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", color: "var(--text-3)" }}>
                                    {"REASONS"}
                                  </span>
                                  {(v.whyReasons || []).map((r, $index) => (
                                    <React.Fragment key={r && r.key != null ? r.key : $index}>
                                      <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "14.5px", padding: "10px 12px", borderRadius: "10px", background: "var(--surface-2)" }}>
                                        <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} style={{ color: "var(--green)", flex: "none", strokeWidth: "2.6", strokeLinecap: "round", strokeLinejoin: "round" }}>
                                          <path d={"M20 6L9 17l-5-5"} />
                                        </svg>
                                        {r.t}
                                      </div>
                                    </React.Fragment>
                                  ))}
                                </div>
                                <div style={{ border: "1px solid var(--coach-line)", background: "var(--coach-soft)", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                  <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--coach)" }}>
                                    {"Strategic idea"}
                                  </span>
                                  <span style={{ fontSize: "14px", lineHeight: "1.55" }}>
                                    {v.why.idea}
                                  </span>
                                </div>
                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                  <button onClick={v.toChat} style={{ height: "34px", padding: "0 12px", borderRadius: "9px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", fontSize: "13px", fontWeight: "500", cursor: "pointer" }} className="cc-hover-18">
                                    {"Ask another question"}
                                  </button>
                                  <button onClick={v.backToCurrent} style={{ height: "34px", padding: "0 12px", borderRadius: "9px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text-2)", fontSize: "13px", fontWeight: "500", cursor: "pointer" }} className="cc-hover-19">
                                    {"Back to current position"}
                                  </button>
                                </div>
                              </div>
                            </>
                          ) : null}
                          {v.tabPlan ? (
                            <>
                              <div style={{ display: "flex", flexDirection: "column", gap: "18px", animation: "ccIn .3s ease-out" }}>
                                <div style={{ fontSize: "20px", fontWeight: "600", letterSpacing: "-.015em" }}>
                                  {"What is my plan?"}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", color: "var(--text-3)" }}>
                                    {"YOUR IMMEDIATE PLAN"}
                                  </span>
                                  <span style={{ fontSize: "16px", fontWeight: "600" }}>
                                    {"Develop your queenside."}
                                  </span>
                                  <div style={{ display: "flex", alignItems: "stretch", gap: "0", marginTop: "4px" }}>
                                    <div style={{ flex: "1", padding: "10px 8px", borderRadius: "10px 0 0 10px", background: "var(--green-soft)", border: "1px solid var(--green-line)", textAlign: "center", fontFamily: "'Geist Mono',monospace", fontSize: "14px", fontWeight: "600" }}>
                                      {"Bf5"}
                                    </div>
                                    <div style={{ flex: "1", padding: "10px 8px", background: "var(--surface-2)", border: "1px solid var(--border)", borderLeft: "none", textAlign: "center", fontFamily: "'Geist Mono',monospace", fontSize: "14px", fontWeight: "600" }}>
                                      {"Nd7"}
                                    </div>
                                    <div style={{ flex: "1", padding: "10px 8px", background: "var(--surface-2)", border: "1px solid var(--border)", borderLeft: "none", textAlign: "center", fontFamily: "'Geist Mono',monospace", fontSize: "14px", fontWeight: "600" }}>
                                      {"Ngf6"}
                                    </div>
                                    <div style={{ flex: "1", padding: "10px 8px", borderRadius: "0 10px 10px 0", background: "var(--surface-2)", border: "1px solid var(--border)", borderLeft: "none", textAlign: "center", fontFamily: "'Geist Mono',monospace", fontSize: "14px", fontWeight: "600" }}>
                                      {"e6"}
                                    </div>
                                  </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", color: "var(--text-3)" }}>
                                    {"YOUR STRATEGIC GOAL"}
                                  </span>
                                  <span style={{ fontSize: "14.5px", lineHeight: "1.55" }}>
                                    {"Complete development without trapping your light-squared bishop."}
                                  </span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", color: "var(--text-3)", marginBottom: "10px" }}>
                                    {"MIDDLEGAME PLAN"}
                                  </span>
                                  <div style={{ display: "flex", gap: "12px" }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--coach)" }} />
                                      <span style={{ width: "2px", flex: "1", background: "var(--border-2)" }} />
                                    </div>
                                    <div style={{ paddingBottom: "14px", fontSize: "14px", marginTop: "-3px" }}>
                                      {"Castle kingside"}
                                    </div>
                                  </div>
                                  <div style={{ display: "flex", gap: "12px" }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", border: "2px solid var(--coach)" }} />
                                      <span style={{ width: "2px", flex: "1", background: "var(--border-2)" }} />
                                    </div>
                                    <div style={{ paddingBottom: "14px", fontSize: "14px", marginTop: "-3px" }}>
                                      {"Challenge White’s center"}
                                    </div>
                                  </div>
                                  <div style={{ display: "flex", gap: "12px" }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", border: "2px solid var(--coach)" }} />
                                      <span style={{ width: "2px", flex: "1", background: "var(--border-2)" }} />
                                    </div>
                                    <div style={{ paddingBottom: "14px", fontSize: "14px", marginTop: "-3px" }}>
                                      {"Prepare ...c5"}
                                    </div>
                                  </div>
                                  <div style={{ display: "flex", gap: "12px" }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", border: "2px solid var(--border-2)" }} />
                                    </div>
                                    <div style={{ fontSize: "14px", marginTop: "-3px", color: "var(--text-2)" }}>
                                      {"Potential queenside expansion"}
                                    </div>
                                  </div>
                                </div>
                                <button onClick={v.planShow} style={{ alignSelf: "flex-start", height: "34px", padding: "0 12px", borderRadius: "9px", border: "1px solid var(--coach-line)", background: "var(--coach-soft)", color: "var(--coach)", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                                  {"Show on board"}
                                </button>
                              </div>
                            </>
                          ) : null}
                          {v.tabChat ? (
                            <>
                              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--text-3)" }}>
                                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--green)" }} />
                                  {v.ctxLine}
                                </div>
                                <div ref={v.chatRef} style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "380px", minHeight: "200px", overflowY: "auto", paddingRight: "4px" }}>
                                  {(v.chat || []).map((m, $index) => (
                                    <React.Fragment key={m && m.key != null ? m.key : $index}>
                                      {m.isCoach ? (
                                        <>
                                          <div style={{ alignSelf: "flex-start", maxWidth: "92%", display: "flex", flexDirection: "column", gap: "8px", animation: "ccIn .3s ease-out" }}>
                                            <div style={{ padding: "11px 14px", borderRadius: "14px 14px 14px 4px", background: "var(--surface-2)", fontSize: "14px", lineHeight: "1.55" }}>
                                              {m.text}
                                            </div>
                                            {m.hasActions ? (
                                              <>
                                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                                  {(m.actions || []).map((a, $index) => (
                                                    <React.Fragment key={a && a.key != null ? a.key : $index}>
                                                      <button onClick={a.onClick} style={{ height: "28px", padding: "0 10px", borderRadius: "8px", border: "1px solid var(--coach-line)", background: "var(--coach-soft)", color: "var(--coach)", fontSize: "12px", fontWeight: "500", cursor: "pointer" }}>
                                                        {a.label}
                                                      </button>
                                                    </React.Fragment>
                                                  ))}
                                                </div>
                                              </>
                                            ) : null}
                                          </div>
                                        </>
                                      ) : null}
                                      {m.isUser ? (
                                        <>
                                          <div style={{ alignSelf: "flex-end", maxWidth: "85%", padding: "10px 14px", borderRadius: "14px 14px 4px 14px", background: "var(--coach)", color: "#fff", fontSize: "14px", lineHeight: "1.5", animation: "ccIn .2s ease-out" }}>
                                            {m.text}
                                          </div>
                                        </>
                                      ) : null}
                                    </React.Fragment>
                                  ))}
                                  {v.chatBusy ? (
                                    <>
                                      <div style={{ alignSelf: "flex-start", padding: "12px 16px", borderRadius: "14px", background: "var(--surface-2)", display: "flex", gap: "5px" }}>
                                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--text-2)", animation: "ccDot 1.2s infinite" }} />
                                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--text-2)", animation: "ccDot 1.2s .2s infinite" }} />
                                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--text-2)", animation: "ccDot 1.2s .4s infinite" }} />
                                      </div>
                                    </>
                                  ) : null}
                                </div>
                                <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "2px" }}>
                                  {(v.chatSuggest || []).map((cs, $index) => (
                                    <React.Fragment key={cs && cs.key != null ? cs.key : $index}>
                                      <button onClick={cs.onClick} style={{ flex: "none", height: "30px", padding: "0 11px", borderRadius: "999px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-2)", fontSize: "12.5px", cursor: "pointer", whiteSpace: "nowrap" }} className="cc-hover-20">
                                        {cs.t}
                                      </button>
                                    </React.Fragment>
                                  ))}
                                </div>
                                <div style={{ display: "flex", gap: "8px", alignItems: "center", height: "44px", padding: "0 6px 0 14px", border: "1px solid var(--border-2)", borderRadius: "12px", background: "var(--surface-2)" }}>
                                  <input value={v.chatIn} onChange={v.onChatIn} onKeyDown={v.onChatKey} placeholder={"Ask about this position…"} style={{ flex: "1", minWidth: "0", border: "none", outline: "none", background: "transparent", color: "var(--text)", fontSize: "14px" }} />
                                  <button onClick={v.onChatSend} title={"Send"} style={{ width: "32px", height: "32px", borderRadius: "9px", border: "none", background: "var(--coach)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                    <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} style={{ strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }}>
                                      <path d={"M22 2L11 13M22 2l-7 20-4-9-9-4z"} />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    {v.isMobile ? (
                      <>
                        <div style={{ position: "sticky", bottom: "74px", zIndex: "25", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "6px", padding: "8px", border: "1px solid var(--border)", borderRadius: "14px", background: "var(--surface)", boxShadow: "0 8px 24px rgba(0,0,0,.3)" }}>
                          <button onClick={v.onHint} style={{ height: "44px", borderRadius: "10px", border: "none", background: "var(--amber-soft)", color: "var(--amber)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                            {"Hint"}
                          </button>
                          <button onClick={v.onWhy} style={{ height: "44px", borderRadius: "10px", border: "none", background: "var(--surface-2)", color: "var(--text)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                            {"Why?"}
                          </button>
                          <button onClick={v.onWhatNext} style={{ height: "44px", borderRadius: "10px", border: "none", background: "var(--surface-2)", color: "var(--text)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                            {"What Next?"}
                          </button>
                          <button onClick={v.onWhatIf} style={{ height: "44px", borderRadius: "10px", border: "none", background: "var(--coach-soft)", color: "var(--coach)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                            {"What If?"}
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                </>
              ) : null}
              {v.isPracticeQ ? (
                <>
                  <div style={{ maxWidth: "1240px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px", animation: "ccIn .35s ease-out" }}>
                    <div>
                      <h1 style={{ margin: "0", fontSize: "30px", fontWeight: "600", letterSpacing: "-.025em" }}>
                        {"Practice"}
                      </h1>
                      <p style={{ margin: "6px 0 0", color: "var(--text-2)", fontSize: "15px" }}>
                        {"Spaced repetition brings positions back right before you’d forget them."}
                      </p>
                    </div>
                    {v.hasData ? (
                      <>
                        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "22px 24px", display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
                          <div style={{ flex: "1 1 260px" }}>
                            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", textTransform: "uppercase", color: "var(--coach)" }}>
                              {"Daily Review"}
                            </div>
                            <div style={{ fontSize: "22px", fontWeight: "600", letterSpacing: "-.015em", marginTop: "6px" }}>
                              {"12 positions due · about 15 min"}
                            </div>
                            <div style={{ fontSize: "13.5px", color: "var(--text-2)", marginTop: "4px" }}>
                              {"Caro-Kann, Italian, London and Sicilian — weakest first."}
                            </div>
                          </div>
                          <button onClick={v.startDaily} style={{ height: "42px", padding: "0 20px", borderRadius: "11px", border: "none", background: "var(--text)", color: "var(--bg)", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                            {"Start Daily Review →"}
                          </button>
                        </div>
                        <div style={{ display: "flex", gap: "2px", padding: "3px", borderRadius: "11px", background: "var(--surface)", border: "1px solid var(--border)", alignSelf: "flex-start", maxWidth: "100%", overflowX: "auto" }}>
                          {(v.qTabs || []).map((qt, $index) => (
                            <React.Fragment key={qt && qt.key != null ? qt.key : $index}>
                              <button onClick={qt.onClick} style={{ height: "34px", padding: "0 14px", border: "none", borderRadius: "8px", background: qt.bg, color: qt.color, fontSize: "13px", fontWeight: "500", cursor: "pointer", whiteSpace: "nowrap", display: "flex", gap: "8px", alignItems: "center" }}>
                                {qt.label}
                                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", color: "var(--text-3)" }}>
                                  {qt.n}
                                </span>
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: "16px" }}>
                          {(v.qCards || []).map((c, $index) => (
                            <React.Fragment key={c && c.key != null ? c.key : $index}>
                              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                                <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                                  <div style={{ width: "104px", flex: "none" }}>
                                    <div style={{ width: "104px" }}><Chessboard fen={c.fen} orientation={c.orient} interactive={false} coords={false} /></div>
                                  </div>
                                  <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <span style={{ fontSize: "15px", fontWeight: "600" }}>
                                      {c.op}
                                    </span>
                                    <span style={{ fontSize: "12px", color: "var(--text-3)" }}>
                                      {"Position after"}
                                    </span>
                                    <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12.5px", color: "var(--text-2)", lineHeight: "1.5" }}>
                                      {c.after}
                                    </span>
                                  </div>
                                </div>
                                <div style={{ display: "flex", gap: "18px", fontSize: "12px", color: "var(--text-3)" }}>
                                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                    {"Your accuracy"}
                                    <span style={{ fontSize: "15px", fontWeight: "600", color: c.accColor }}>
                                      {c.acc}
                                    </span>
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                    {"Last practiced"}
                                    <span style={{ fontSize: "15px", fontWeight: "500", color: "var(--text)" }}>
                                      {c.last}
                                    </span>
                                  </div>
                                </div>
                                <button onClick={c.onClick} style={{ height: "36px", borderRadius: "10px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }} className="cc-hover-21">
                                  {"Practice Now"}
                                </button>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      </>
                    ) : null}
                    {v.isEmpty ? (
                      <>
                        <div style={{ padding: "56px 24px", border: "1px dashed var(--border-2)", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center" }}>
                          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "var(--green-soft)", color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} style={{ strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round" }}>
                              <path d={"M20 6L9 17l-5-5"} />
                            </svg>
                          </div>
                          <div style={{ fontSize: "18px", fontWeight: "600" }}>
                            {"You don’t have any positions to review today."}
                          </div>
                          <div style={{ fontSize: "14px", color: "var(--text-2)", maxWidth: "380px" }}>
                            {"Positions you learn come back here on a schedule, so you remember them for good."}
                          </div>
                          <button onClick={v.goLibrary} style={{ marginTop: "6px", height: "40px", padding: "0 18px", borderRadius: "10px", border: "none", background: "var(--text)", color: "var(--bg)", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                            {"Learn a new opening"}
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                </>
              ) : null}
              {v.isSession ? (
                <>
                  <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "18px", animation: "ccIn .35s ease-out", paddingTop: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <button onClick={v.exitSession} title={"Exit review"} style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text-2)", fontSize: "16px", cursor: "pointer" }}>
                        {"✕"}
                      </button>
                      <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                          <span style={{ fontWeight: "600" }}>
                            {"Daily Review"}
                          </span>
                          <span style={{ color: "var(--text-2)" }}>
                            {v.pPos}
                          </span>
                        </div>
                        <div style={{ height: "5px", borderRadius: "3px", background: "var(--surface-3)", overflow: "hidden" }}>
                          <div style={{ width: v.pPosW, height: "100%", background: "var(--coach)", transition: "width .5s" }} />
                        </div>
                      </div>
                    </div>
                    {v.pNotDone ? (
                      <>
                        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ fontSize: "24px", fontWeight: "600", letterSpacing: "-.02em" }}>
                            {"Find the best move."}
                          </div>
                          <div style={{ fontSize: "13px", color: "var(--text-3)" }}>
                            {v.pSide}{" · "}{v.PZ.title}
                          </div>
                        </div>
                        <div style={{ width: "100%" }}><Chessboard fen={v.pBoard.fen} marks={v.pBoard.marks} arrows={v.pBoard.arrows} orientation={v.pBoard.orient} coords={v.coords} onMove={v.onPracticeMove} /></div>
                        {v.pTryAgain ? (
                          <>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--red-line)", background: "var(--red-soft)", animation: "ccIn .25s ease-out" }}>
                              <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--red)" }}>
                                {"Try Again — "}{v.pWrongSan}{" isn’t it"}
                              </span>
                              <button onClick={v.pShowSolution} style={{ height: "30px", padding: "0 10px", borderRadius: "8px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text-2)", fontSize: "12px", cursor: "pointer" }}>
                                {"Show solution"}
                              </button>
                            </div>
                          </>
                        ) : null}
                        {v.pResult ? (
                          <>
                            <div style={{ border: "1px solid var(--border)", background: "var(--surface)", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "14px", animation: "ccIn .3s ease-out" }}>
                              {v.pRight ? (
                                <>
                                  <div style={{ fontSize: "18px", fontWeight: "600", color: "var(--green)" }}>
                                    {"Correct"}
                                  </div>
                                </>
                              ) : null}
                              {v.pReveal ? (
                                <>
                                  <div style={{ fontSize: "18px", fontWeight: "600", color: "var(--amber)" }}>
                                    {"Here’s the idea"}
                                  </div>
                                </>
                              ) : null}
                              <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "10px 14px", fontSize: "14px", lineHeight: "1.55" }}>
                                <span style={{ color: "var(--text-3)" }}>
                                  {"Best move"}
                                </span>
                                <span style={{ fontFamily: "'Geist Mono',monospace", fontWeight: "600" }}>
                                  {v.PZ.san}
                                </span>
                                <span style={{ color: "var(--text-3)" }}>
                                  {"Why"}
                                </span>
                                <span>
                                  {v.PZ.why}
                                </span>
                                <span style={{ color: "var(--text-3)" }}>
                                  {"Common mistake"}
                                </span>
                                <span style={{ color: "var(--text-2)" }}>
                                  {v.PZ.mistake}
                                </span>
                              </div>
                              <button onClick={v.onPracticeNext} style={{ alignSelf: "flex-end", height: "38px", padding: "0 16px", borderRadius: "10px", border: "none", background: "var(--text)", color: "var(--bg)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                                {v.pNextLabel}{" →"}
                              </button>
                            </div>
                          </>
                        ) : null}
                      </>
                    ) : null}
                    {v.pDone ? (
                      <>
                        <div style={{ border: "1px solid var(--border)", background: "var(--surface)", borderRadius: "18px", padding: "32px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", textAlign: "center", animation: "ccIn .35s ease-out" }}>
                          <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "var(--green)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} style={{ strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round" }}>
                              <path d={"M20 6L9 17l-5-5"} />
                            </svg>
                          </div>
                          <div style={{ fontSize: "22px", fontWeight: "600" }}>
                            {"Session complete"}
                          </div>
                          <div style={{ fontSize: "14px", color: "var(--text-2)", maxWidth: "360px" }}>
                            {"Positions you missed will come back tomorrow. The ones you nailed move further out."}
                          </div>
                          <button onClick={v.exitSession} style={{ marginTop: "6px", height: "40px", padding: "0 18px", borderRadius: "10px", border: "none", background: "var(--text)", color: "var(--bg)", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                            {"Back to queue"}
                          </button>
                        </div>
                      </>
                    ) : null}
                    <div style={{ display: "flex", justifyContent: "center", gap: "40px", padding: "8px 0 20px" }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "12px", color: "var(--text-3)" }}>
                          {"Accuracy"}
                        </div>
                        <div style={{ fontSize: "20px", fontWeight: "600", marginTop: "2px" }}>
                          {v.pAccLabel}
                        </div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "12px", color: "var(--text-3)" }}>
                          {"Streak"}
                        </div>
                        <div style={{ fontSize: "20px", fontWeight: "600", marginTop: "2px", color: "var(--amber)" }}>
                          {v.pStreak}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
              {v.isAnalysis ? (
                <>
                  <div style={{ maxWidth: "1320px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "18px", animation: "ccIn .35s ease-out" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
                      <div style={{ flex: "1 1 260px" }}>
                        <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", textTransform: "uppercase", color: "var(--text-3)" }}>
                          {"Italian Game · Giuoco Pianissimo"}
                        </div>
                        <h1 style={{ margin: "6px 0 0", fontSize: "26px", fontWeight: "600", letterSpacing: "-.02em" }}>
                          {"Analysis Board"}
                        </h1>
                      </div>
                      <button onClick={v.startTeach} style={{ height: "40px", padding: "0 16px", borderRadius: "10px", border: "none", background: "var(--coach)", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                        <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"currentColor"}>
                          <path d={"M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"} />
                        </svg>
                        {"Teach me from here"}
                      </button>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" }}>
                      <div style={{ flex: "1.5 1 440px", minWidth: "0", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", gap: "10px", maxWidth: "660px", width: "100%", margin: "0 auto" }}>
                          <div title={"Evaluation"} style={{ width: "14px", flex: "none", borderRadius: "6px", overflow: "hidden", background: "#2a2723", display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "relative" }}>
                            <div style={{ height: v.evalPct, background: "#f1ede4", transition: "height .5s" }} />
                          </div>
                          <div style={{ flex: "1", minWidth: "0" }}>
                            <div style={{ width: "100%" }}><Chessboard fen={v.aBoard.fen} marks={v.aBoard.marks} arrows={v.aBoard.arrows} orientation={"white"} coords={v.coords} onMove={v.onAnalysisMove} /></div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center", alignItems: "center" }}>
                          <button onClick={v.aFirst} style={{ width: "44px", height: "36px", borderRadius: "9px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", cursor: "pointer", fontFamily: "'Geist Mono',monospace" }}>
                            {"|‹"}
                          </button>
                          <button onClick={v.aPrev} style={{ width: "44px", height: "36px", borderRadius: "9px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", cursor: "pointer", fontFamily: "'Geist Mono',monospace" }}>
                            {"‹"}
                          </button>
                          <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--text-3)", minWidth: "64px", textAlign: "center" }}>
                            {v.evalText}
                          </span>
                          <button onClick={v.aNext} style={{ width: "44px", height: "36px", borderRadius: "9px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", cursor: "pointer", fontFamily: "'Geist Mono',monospace" }}>
                            {"›"}
                          </button>
                          <button onClick={v.aLast} style={{ width: "44px", height: "36px", borderRadius: "9px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", cursor: "pointer", fontFamily: "'Geist Mono',monospace" }}>
                            {"›|"}
                          </button>
                        </div>
                      </div>
                      <div style={{ flex: "1 1 360px", minWidth: "0", display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                          {v.aNotTeach ? (
                            <>
                              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                {(v.aModes || []).map((am, $index) => (
                                  <React.Fragment key={am && am.key != null ? am.key : $index}>
                                    <button onClick={am.onClick} style={{ height: "30px", padding: "0 11px", borderRadius: "8px", border: `1px solid ${am.border}`, background: am.bg, color: am.color, fontSize: "12.5px", fontWeight: "500", cursor: "pointer" }}>
                                      {am.label}
                                    </button>
                                  </React.Fragment>
                                ))}
                              </div>
                            </>
                          ) : null}
                          {v.aNotFinal ? (
                            <>
                              <div style={{ display: "flex", flexDirection: "column", gap: "6px", animation: "ccIn .25s ease-out" }}>
                                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", color: "var(--text-3)" }}>
                                  {v.aMoveLabel}
                                </span>
                                <span style={{ fontSize: "15px", lineHeight: "1.6" }}>
                                  {v.aIdea}
                                </span>
                              </div>
                            </>
                          ) : null}
                          {v.aExplain ? (
                            <>
                              <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "ccIn .25s ease-out" }}>
                                <div style={{ fontSize: "18px", fontWeight: "600" }}>
                                  {"What’s going on"}
                                </div>
                                <p style={{ margin: "0", fontSize: "14.5px", lineHeight: "1.6", textWrap: "pretty" }}>
                                  {"This is the Giuoco Pianissimo — the “very quiet” Italian. Both sides have developed and castled. Nobody is in a hurry; whoever improves their pieces more purposefully usually wins the maneuvering battle."}
                                </p>
                                <div style={{ borderRadius: "12px", background: "var(--surface-2)", padding: "12px 14px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                  <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--red)" }}>
                                    {"What Black is trying to do"}
                                  </span>
                                  <span style={{ fontSize: "14px", lineHeight: "1.55" }}>
                                    {"Play ...a6 and ...Ba7 to keep the bishop, then ...Be6 to trade off your strong bishop on c4."}
                                  </span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                  <span style={{ fontSize: "12px", color: "var(--text-3)" }}>
                                    {"Best move here"}
                                  </span>
                                  <span style={{ fontSize: "15px" }}>
                                    <span style={{ fontFamily: "'Geist Mono',monospace", fontWeight: "600", color: "var(--green)" }}>
                                      {"7.a4"}
                                    </span>
                                    {" — because it grabs queenside space before Black can play ...b5."}
                                  </span>
                                </div>
                              </div>
                            </>
                          ) : null}
                          {v.aPlan ? (
                            <>
                              <div style={{ display: "flex", flexDirection: "column", gap: "12px", animation: "ccIn .25s ease-out" }}>
                                <div style={{ fontSize: "18px", fontWeight: "600" }}>
                                  {"Your plan as White"}
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: "8px" }}>
                                  <div style={{ padding: "10px 12px", borderRadius: "10px", background: "var(--green-soft)", border: "1px solid var(--green-line)" }}>
                                    <div style={{ fontFamily: "'Geist Mono',monospace", fontWeight: "600" }}>
                                      {"a4"}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "var(--text-2)", marginTop: "2px" }}>
                                      {"Queenside space"}
                                    </div>
                                  </div>
                                  <div style={{ padding: "10px 12px", borderRadius: "10px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                                    <div style={{ fontFamily: "'Geist Mono',monospace", fontWeight: "600" }}>
                                      {"h3"}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "var(--text-2)", marginTop: "2px" }}>
                                      {"Take g4 away"}
                                    </div>
                                  </div>
                                  <div style={{ padding: "10px 12px", borderRadius: "10px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                                    <div style={{ fontFamily: "'Geist Mono',monospace", fontWeight: "600" }}>
                                      {"Nd2–f1–g3"}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "var(--text-2)", marginTop: "2px" }}>
                                      {"Reroute the knight"}
                                    </div>
                                  </div>
                                  <div style={{ padding: "10px 12px", borderRadius: "10px", background: "var(--amber-soft)", border: "1px solid var(--amber-line)" }}>
                                    <div style={{ fontFamily: "'Geist Mono',monospace", fontWeight: "600" }}>
                                      {"d4"}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "var(--text-2)", marginTop: "2px" }}>
                                      {"Strike when ready"}
                                    </div>
                                  </div>
                                </div>
                                <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.6", color: "var(--text-2)" }}>
                                  {"Improve every piece first. The d3–d4 break only works once your knight reaches g3 and your rook sits on e1."}
                                </p>
                              </div>
                            </>
                          ) : null}
                          {v.aWhy ? (
                            <>
                              <div style={{ display: "flex", flexDirection: "column", gap: "10px", animation: "ccIn .25s ease-out" }}>
                                <div style={{ fontSize: "18px", fontWeight: "600" }}>
                                  {"Why is "}
                                  <span style={{ fontFamily: "'Geist Mono',monospace", color: "var(--green)" }}>
                                    {"7.a4"}
                                  </span>
                                  {" best?"}
                                </div>
                                <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "14px", padding: "9px 12px", borderRadius: "10px", background: "var(--surface-2)" }}>
                                  {"Grabs space before Black plays ...b5"}
                                </div>
                                <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "14px", padding: "9px 12px", borderRadius: "10px", background: "var(--surface-2)" }}>
                                  {"Creates an a2 retreat for your bishop"}
                                </div>
                                <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "14px", padding: "9px 12px", borderRadius: "10px", background: "var(--surface-2)" }}>
                                  {"Prepares a5, cramping Black’s queenside"}
                                </div>
                                <p style={{ margin: "2px 0 0", fontSize: "14px", lineHeight: "1.55", color: "var(--text-2)" }}>
                                  {"You’re not attacking yet — you’re making Black’s natural plans harder."}
                                </p>
                              </div>
                            </>
                          ) : null}
                          {v.aWhatIf ? (
                            <>
                              <div style={{ display: "flex", flexDirection: "column", gap: "12px", animation: "ccIn .25s ease-out" }}>
                                <div style={{ fontSize: "18px", fontWeight: "600" }}>
                                  {"What if I play…?"}
                                </div>
                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                  {(v.aAltChips || []).map((c, $index) => (
                                    <React.Fragment key={c && c.key != null ? c.key : $index}>
                                      <button onClick={c.onClick} style={{ height: "30px", padding: "0 12px", borderRadius: "999px", border: `1px solid ${c.border}`, background: c.bg, color: "var(--text)", fontFamily: "'Geist Mono',monospace", fontSize: "12.5px", cursor: "pointer" }}>
                                        {c.label}
                                      </button>
                                    </React.Fragment>
                                  ))}
                                </div>
                                {v.hasAWi ? (
                                  <>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                      <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "var(--text-2)" }}>
                                        <span>
                                          {"Your move "}
                                          <span style={{ fontFamily: "'Geist Mono',monospace", color: "var(--amber)", fontWeight: "600" }}>
                                            {v.aWiSel.san}
                                          </span>
                                        </span>
                                        <span>
                                          {"Recommended "}
                                          <span style={{ fontFamily: "'Geist Mono',monospace", color: "var(--green)", fontWeight: "600" }}>
                                            {"7.a4"}
                                          </span>
                                        </span>
                                      </div>
                                      <p style={{ margin: "0", fontSize: "14.5px", lineHeight: "1.6" }}>
                                        {v.aWiSel.explain}
                                      </p>
                                      <div style={{ borderRadius: "10px", background: "var(--surface-2)", padding: "10px 12px", fontSize: "13.5px" }}>
                                        <span style={{ color: "var(--amber)", fontWeight: "600" }}>
                                          {"Main downside · "}
                                        </span>
                                        {v.aWiSel.down}
                                      </div>
                                    </div>
                                  </>
                                ) : null}
                                {v.noAWi ? (
                                  <>
                                    <span style={{ fontSize: "13.5px", color: "var(--text-2)" }}>
                                      {"Pick a move above or play one on the board."}
                                    </span>
                                  </>
                                ) : null}
                              </div>
                            </>
                          ) : null}
                          {v.aTeach ? (
                            <>
                              <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "ccIn .3s ease-out" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--coach)", fontSize: "13px", fontWeight: "600" }}>
                                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"currentColor"}>
                                      <path d={"M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"} />
                                    </svg>
                                    {"Teach me from here"}
                                  </div>
                                  <span onClick={v.exitTeach} style={{ fontSize: "12px", color: "var(--text-3)", cursor: "pointer" }}>
                                    {"Exit"}
                                  </span>
                                </div>
                                <div style={{ display: "flex", gap: "4px" }}>
                                  {(v.tchSegs || []).map((g, $index) => (
                                    <React.Fragment key={g && g.key != null ? g.key : $index}>
                                      <div style={{ flex: "1", height: "4px", borderRadius: "2px", background: g.bg, transition: "background .4s" }} />
                                    </React.Fragment>
                                  ))}
                                </div>
                                {v.tchActive ? (
                                  <>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                      <span style={{ fontSize: "12px", color: "var(--text-3)" }}>
                                        {v.tchStepLabel}{" · White to move"}
                                      </span>
                                      <span style={{ fontSize: "20px", fontWeight: "600", letterSpacing: "-.015em" }}>
                                        {"What would you play?"}
                                      </span>
                                    </div>
                                  </>
                                ) : null}
                                {v.tchHint ? (
                                  <>
                                    <div style={{ padding: "12px 14px", borderRadius: "12px", border: "1px solid var(--amber-line)", background: "var(--amber-soft)", fontSize: "13.5px", lineHeight: "1.5" }}>
                                      <span style={{ color: "var(--amber)", fontWeight: "600" }}>
                                        {"Not quite. "}
                                      </span>
                                      {v.tchHintText}
                                    </div>
                                  </>
                                ) : null}
                                {v.tchHasLog ? (
                                  <>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                                      {(v.tchLog || []).map((l, $index) => (
                                        <React.Fragment key={l && l.key != null ? l.key : $index}>
                                          <div style={{ display: "flex", gap: "12px", animation: "ccIn .3s ease-out" }}>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "5px" }}>
                                              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: l.dot }} />
                                              <span style={{ width: "2px", flex: "1", background: "var(--border)" }} />
                                            </div>
                                            <div style={{ paddingBottom: "14px", display: "flex", flexDirection: "column", gap: "4px", minWidth: "0" }}>
                                              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "14px", fontWeight: "600" }}>
                                                {l.you}
                                              </span>
                                              <span style={{ fontSize: "13.5px", lineHeight: "1.5", color: "var(--text-2)" }}>
                                                {l.fb}
                                              </span>
                                              {l.hasReply ? (
                                                <>
                                                  <span style={{ fontSize: "12.5px", color: "var(--text-3)" }}>
                                                    {"Opponent replies "}
                                                    <span style={{ fontFamily: "'Geist Mono',monospace", color: "var(--text)" }}>
                                                      {l.reply}
                                                    </span>
                                                  </span>
                                                </>
                                              ) : null}
                                            </div>
                                          </div>
                                        </React.Fragment>
                                      ))}
                                    </div>
                                  </>
                                ) : null}
                                {v.tchDone ? (
                                  <>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "12px", borderTop: "1px solid var(--border)", animation: "ccIn .35s ease-out" }}>
                                      <div style={{ fontSize: "18px", fontWeight: "600" }}>
                                        {"Lesson complete"}
                                      </div>
                                      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                                        <div style={{ width: "96px", flex: "none" }}>
                                          <div style={{ width: "96px" }}><Chessboard fen={v.tchFen} interactive={false} coords={false} /></div>
                                          <div style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "4px", textAlign: "center" }}>
                                            {"Key position"}
                                          </div>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px", lineHeight: "1.5", minWidth: "0" }}>
                                          <div>
                                            <div style={{ fontSize: "12px", color: "var(--text-3)" }}>
                                              {"What you learned"}
                                            </div>
                                            {"In the slow Italian, improve your pieces before you strike in the center."}
                                          </div>
                                          <div>
                                            <div style={{ fontSize: "12px", color: "var(--text-3)" }}>
                                              {"Main mistake"}
                                            </div>
                                            {v.tchMistake}
                                          </div>
                                          <div>
                                            <div style={{ fontSize: "12px", color: "var(--text-3)" }}>
                                              {"Recommended plan"}
                                            </div>
                                            {"Nf1–g3, then d3–d4 with the rook already on e1."}
                                          </div>
                                        </div>
                                      </div>
                                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        <button onClick={v.addReview} style={{ height: "36px", padding: "0 14px", borderRadius: "10px", border: "none", background: "var(--text)", color: "var(--bg)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                                          {"Add to review"}
                                        </button>
                                        <button onClick={v.startTeach} style={{ height: "36px", padding: "0 14px", borderRadius: "10px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                                          {"Try again"}
                                        </button>
                                      </div>
                                    </div>
                                  </>
                                ) : null}
                              </div>
                            </>
                          ) : null}
                        </div>
                        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "14px 16px" }}>
                          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", color: "var(--text-3)", paddingBottom: "8px" }}>
                            {"MOVE HISTORY"}
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: "2px 10px" }}>
                            {(v.aPairs || []).map((pr, $index) => (
                              <React.Fragment key={pr && pr.key != null ? pr.key : $index}>
                                <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr", alignItems: "center", fontFamily: "'Geist Mono',monospace", fontSize: "13px" }}>
                                  <span style={{ color: "var(--text-3)" }}>
                                    {pr.n}
                                  </span>
                                  <span onClick={pr.w.onClick} style={{ padding: "4px 6px", borderRadius: "6px", cursor: "pointer", background: pr.w.bg, color: pr.w.color }}>
                                    {pr.w.san}
                                  </span>
                                  <span onClick={pr.b.onClick} style={{ padding: "4px 6px", borderRadius: "6px", cursor: "pointer", background: pr.b.bg, color: pr.b.color }}>
                                    {pr.b.san}
                                  </span>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                          <div onClick={v.toggleEngine} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                            <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", color: "var(--text-3)" }}>
                              {"ENGINE DETAILS"}
                            </span>
                            <span style={{ fontSize: "12px", color: "var(--text-3)" }}>
                              {v.engineChevron}
                            </span>
                          </div>
                          {v.engineOpen ? (
                            <>
                              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-2)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                  <span>
                                    {"Best move "}
                                    <span style={{ fontFamily: "'Geist Mono',monospace", color: "var(--text)" }}>
                                      {"7.a4"}
                                    </span>
                                  </span>
                                  <span>
                                    {"Evaluation "}
                                    <span style={{ fontFamily: "'Geist Mono',monospace", color: "var(--text)" }}>
                                      {"+0.3"}
                                    </span>
                                  </span>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "56px 52px 1fr", gap: "6px 10px", fontFamily: "'Geist Mono',monospace", fontSize: "12.5px", padding: "8px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
                                  <span style={{ color: "var(--text)" }}>
                                    {"7.a4"}
                                  </span>
                                  <span>
                                    {"+0.32"}
                                  </span>
                                  <span style={{ fontFamily: "'Geist',sans-serif" }}>
                                    {"Space on the queenside"}
                                  </span>
                                  <span style={{ color: "var(--text)" }}>
                                    {"7.Re1"}
                                  </span>
                                  <span>
                                    {"+0.27"}
                                  </span>
                                  <span style={{ fontFamily: "'Geist',sans-serif" }}>
                                    {"Rook to the e-file"}
                                  </span>
                                  <span style={{ color: "var(--text)" }}>
                                    {"7.Bb3"}
                                  </span>
                                  <span>
                                    {"+0.24"}
                                  </span>
                                  <span style={{ fontFamily: "'Geist',sans-serif" }}>
                                    {"Pre-empts ...Na5"}
                                  </span>
                                </div>
                                <div>
                                  <span style={{ color: "var(--text-3)" }}>
                                    {"Principal variation · "}
                                  </span>
                                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12.5px" }}>
                                    {"7.a4 a5 8.Re1 Be6 9.Nbd2 h6"}
                                  </span>
                                </div>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
              {v.isGames ? (
                <>
                  <div style={{ maxWidth: "1240px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px", animation: "ccIn .35s ease-out" }}>
                    <div>
                      <h1 style={{ margin: "0", fontSize: "30px", fontWeight: "600", letterSpacing: "-.025em" }}>
                        {"My Games"}
                      </h1>
                      <p style={{ margin: "6px 0 0", color: "var(--text-2)", fontSize: "15px" }}>
                        {"Import your games and your coach turns the mistakes into training positions."}
                      </p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "12px" }}>
                      {(v.importOpts || []).map((io, $index) => (
                        <React.Fragment key={io && io.key != null ? io.key : $index}>
                          <div onClick={io.onClick} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px", display: "flex", gap: "12px", alignItems: "center", cursor: "pointer" }} className="cc-hover-22">
                            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                              <svg width={"17"} height={"17"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} style={{ strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }}>
                                <path d={io.icon} />
                              </svg>
                            </div>
                            <div>
                              <div style={{ fontSize: "14px", fontWeight: "600" }}>
                                {io.t}
                              </div>
                              <div style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "2px" }}>
                                {io.d}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                    {v.pasteOpen ? (
                      <>
                        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px", animation: "ccIn .25s ease-out" }}>
                          <textarea placeholder={"[Event \"Rated Rapid\"] 1. e4 e5 2. Nf3 Nc6 …"} style={{ minHeight: "110px", resize: "vertical", border: "1px solid var(--border-2)", borderRadius: "10px", background: "var(--surface-2)", color: "var(--text)", padding: "12px", fontFamily: "'Geist Mono',monospace", fontSize: "13px", outline: "none" }} />
                          <button onClick={v.analyzePaste} style={{ alignSelf: "flex-end", height: "36px", padding: "0 16px", borderRadius: "10px", border: "none", background: "var(--text)", color: "var(--bg)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                            {"Analyze game"}
                          </button>
                        </div>
                      </>
                    ) : null}
                    {v.hasData ? (
                      <>
                        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
                          <div style={{ padding: "16px 20px", fontSize: "16px", fontWeight: "600", borderBottom: "1px solid var(--border)" }}>
                            {"Recent games"}
                          </div>
                          {v.notMobile ? (
                            <>
                              <div style={{ display: "grid", gridTemplateColumns: "1.6fr .7fr 1.4fr .8fr 1fr .7fr", gap: "12px", padding: "10px 20px", fontSize: "12px", color: "var(--text-3)", borderBottom: "1px solid var(--border)" }}>
                                <span>
                                  {"Opponent"}
                                </span>
                                <span>
                                  {"Result"}
                                </span>
                                <span>
                                  {"Opening"}
                                </span>
                                <span>
                                  {"Accuracy"}
                                </span>
                                <span>
                                  {"Opening mistake"}
                                </span>
                                <span>
                                  {"Date"}
                                </span>
                              </div>
                              {(v.games || []).map((g, $index) => (
                                <React.Fragment key={g && g.key != null ? g.key : $index}>
                                  <div onClick={g.onClick} style={{ display: "grid", gridTemplateColumns: "1.6fr .7fr 1.4fr .8fr 1fr .7fr", gap: "12px", padding: "14px 20px", fontSize: "14px", borderBottom: "1px solid var(--border)", cursor: "pointer", alignItems: "center" }} className="cc-hover-23">
                                    <span style={{ display: "flex", gap: "8px", alignItems: "center", minWidth: "0" }}>
                                      <span style={{ fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {g.opp}
                                      </span>
                                      <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--text-3)" }}>
                                        {g.ratingS}
                                      </span>
                                    </span>
                                    <span style={{ color: g.resColor, fontWeight: "600" }}>
                                      {g.result}
                                    </span>
                                    <span style={{ color: "var(--text-2)" }}>
                                      {g.opening}
                                    </span>
                                    <span style={{ fontFamily: "'Geist Mono',monospace", color: g.accColor }}>
                                      {g.accS}
                                    </span>
                                    <span style={{ fontFamily: "'Geist Mono',monospace", color: "var(--text-2)" }}>
                                      {g.mistake}
                                    </span>
                                    <span style={{ color: "var(--text-3)" }}>
                                      {g.date}
                                    </span>
                                  </div>
                                </React.Fragment>
                              ))}
                            </>
                          ) : null}
                          {v.isMobile ? (
                            <>
                              {(v.games || []).map((g, $index) => (
                                <React.Fragment key={g && g.key != null ? g.key : $index}>
                                  <div onClick={g.onClick} style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "14px 16px", borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
                                    <div style={{ minWidth: "0" }}>
                                      <div style={{ fontSize: "14px", fontWeight: "500" }}>
                                        {g.opp}
                                      </div>
                                      <div style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "3px" }}>
                                        {g.opening}{" · "}{g.date}
                                      </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                      <div style={{ fontSize: "14px", fontWeight: "600", color: g.resColor }}>
                                        {g.result}
                                      </div>
                                      <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: g.accColor, marginTop: "3px" }}>
                                        {g.accS}
                                      </div>
                                    </div>
                                  </div>
                                </React.Fragment>
                              ))}
                            </>
                          ) : null}
                        </div>
                      </>
                    ) : null}
                    {v.isEmpty ? (
                      <>
                        <div style={{ padding: "56px 24px", border: "1px dashed var(--border-2)", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center" }}>
                          <div style={{ fontSize: "18px", fontWeight: "600" }}>
                            {"No games imported yet"}
                          </div>
                          <div style={{ fontSize: "14px", color: "var(--text-2)", maxWidth: "400px" }}>
                            {"Connect Lichess or Chess.com and every new game is reviewed automatically — mistakes become practice positions."}
                          </div>
                          <button onClick={v.connectLichess} style={{ marginTop: "6px", height: "40px", padding: "0 18px", borderRadius: "10px", border: "none", background: "var(--text)", color: "var(--bg)", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                            {"Connect Lichess"}
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                </>
              ) : null}
              {v.isReview ? (
                <>
                  <div style={{ maxWidth: "1320px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "18px", animation: "ccIn .35s ease-out" }}>
                    <span onClick={v.goGames} style={{ fontSize: "13px", color: "var(--text-2)", cursor: "pointer", alignSelf: "flex-start" }}>
                      {"← My Games"}
                    </span>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
                      <div style={{ flex: "1 1 280px" }}>
                        <h1 style={{ margin: "0", fontSize: "26px", fontWeight: "600", letterSpacing: "-.02em" }}>
                          {"vs kasparov_fan92"}
                        </h1>
                        <div style={{ marginTop: "6px", fontSize: "14px", color: "var(--text-2)" }}>
                          {"Italian Game · You played White · "}
                          <span style={{ color: "var(--red)", fontWeight: "600" }}>
                            {"Loss"}
                          </span>
                          {" · Sep 30 · Accuracy 71%"}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {(v.rCounts || []).map((rc, $index) => (
                          <React.Fragment key={rc && rc.key != null ? rc.key : $index}>
                            <div style={{ display: "flex", alignItems: "center", gap: "7px", height: "30px", padding: "0 10px", borderRadius: "8px", background: "var(--surface)", border: "1px solid var(--border)", fontSize: "12.5px" }}>
                              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: rc.color }} />
                              {rc.label}
                              <span style={{ fontFamily: "'Geist Mono',monospace", fontWeight: "600" }}>
                                {rc.n}
                              </span>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" }}>
                      <div style={{ flex: "1.4 1 420px", minWidth: "0", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ maxWidth: "620px", width: "100%", margin: "0 auto" }}>
                          <div style={{ width: "100%" }}><Chessboard fen={v.rBoard.fen} marks={v.rBoard.marks} arrows={v.rBoard.arrows} interactive={false} coords={v.coords} /></div>
                        </div>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                          <button onClick={v.rPrev} style={{ width: "52px", height: "36px", borderRadius: "9px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", cursor: "pointer" }}>
                            {"‹"}
                          </button>
                          <button onClick={v.rNext} style={{ width: "52px", height: "36px", borderRadius: "9px", border: "1px solid var(--border-2)", background: "transparent", color: "var(--text)", cursor: "pointer" }}>
                            {"›"}
                          </button>
                        </div>
                      </div>
                      <div style={{ flex: "1 1 360px", minWidth: "0", display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ height: "24px", padding: "0 9px", borderRadius: "7px", display: "inline-flex", alignItems: "center", fontSize: "12px", fontWeight: "600", color: "var(--bg)", background: v.rClsColor }}>
                              {v.rClsLabel}
                            </span>
                            <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "16px", fontWeight: "600" }}>
                              {v.rPlayed}
                            </span>
                          </div>
                          {v.rIsBad ? (
                            <>
                              <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "ccIn .25s ease-out" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                  <div style={{ padding: "12px 14px", borderRadius: "12px", background: "var(--red-soft)", border: "1px solid var(--red-line)" }}>
                                    <div style={{ fontSize: "12px", color: "var(--red)", fontWeight: "600" }}>
                                      {"You played"}
                                    </div>
                                    <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: "19px", fontWeight: "600", marginTop: "4px" }}>
                                      {v.rPlayed}
                                    </div>
                                  </div>
                                  <div style={{ padding: "12px 14px", borderRadius: "12px", background: "var(--green-soft)", border: "1px solid var(--green-line)" }}>
                                    <div style={{ fontSize: "12px", color: "var(--green)", fontWeight: "600" }}>
                                      {"Better"}
                                    </div>
                                    <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: "19px", fontWeight: "600", marginTop: "4px" }}>
                                      {v.rBad.betterSan}
                                    </div>
                                  </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", color: "var(--text-3)" }}>
                                    {"WHY?"}
                                  </span>
                                  <p style={{ margin: "0", fontSize: "14.5px", lineHeight: "1.6", textWrap: "pretty" }}>
                                    {v.rBad.why}
                                  </p>
                                </div>
                                <button onClick={v.practiceMistake} style={{ alignSelf: "flex-start", height: "36px", padding: "0 14px", borderRadius: "10px", border: "1px solid var(--coach-line)", background: "var(--coach-soft)", color: "var(--coach)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                                  {"Practice this mistake"}
                                </button>
                              </div>
                            </>
                          ) : null}
                          {v.rIsOk ? (
                            <>
                              <p style={{ margin: "0", fontSize: "14.5px", lineHeight: "1.6", color: "var(--text-2)" }}>
                                {v.rNote}
                              </p>
                            </>
                          ) : null}
                        </div>
                        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                          <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", color: "var(--text-3)" }}>
                            {"KEY MOMENTS"}
                          </span>
                          {(v.rMoments || []).map((km, $index) => (
                            <React.Fragment key={km && km.key != null ? km.key : $index}>
                              <div onClick={km.onClick} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "9px", cursor: "pointer", fontSize: "13.5px" }} className="cc-hover-24">
                                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: km.color }} />
                                <span style={{ fontFamily: "'Geist Mono',monospace", fontWeight: "600" }}>
                                  {km.label}
                                </span>
                                <span style={{ color: "var(--text-3)" }}>
                                  {km.cls}
                                </span>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "14px 16px" }}>
                          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", color: "var(--text-3)", paddingBottom: "8px" }}>
                            {"TIMELINE"}
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "2px 10px", maxHeight: "260px", overflowY: "auto" }}>
                            {(v.rPairs || []).map((pr, $index) => (
                              <React.Fragment key={pr && pr.key != null ? pr.key : $index}>
                                <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr", alignItems: "center", fontFamily: "'Geist Mono',monospace", fontSize: "13px" }}>
                                  <span style={{ color: "var(--text-3)" }}>
                                    {pr.n}
                                  </span>
                                  <span onClick={pr.w.onClick} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 6px", borderRadius: "6px", cursor: "pointer", background: pr.w.bg }}>
                                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: pr.w.dot, flex: "none" }} />
                                    {pr.w.san}
                                  </span>
                                  <span onClick={pr.b.onClick} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 6px", borderRadius: "6px", cursor: "pointer", background: pr.b.bg }}>
                                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: pr.b.dot, flex: "none" }} />
                                    {pr.b.san}
                                  </span>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
              {v.isProgress ? (
                <>
                  <div style={{ maxWidth: "1240px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px", animation: "ccIn .35s ease-out" }}>
                    <div>
                      <h1 style={{ margin: "0", fontSize: "30px", fontWeight: "600", letterSpacing: "-.025em" }}>
                        {"Progress"}
                      </h1>
                      <p style={{ margin: "6px 0 0", color: "var(--text-2)", fontSize: "15px" }}>
                        {"How your openings and understanding are developing."}
                      </p>
                    </div>
                    {v.hasData ? (
                      <>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: "12px" }}>
                          {(v.progStats || []).map((ps, $index) => (
                            <React.Fragment key={ps && ps.key != null ? ps.key : $index}>
                              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                <span style={{ fontSize: "12.5px", color: "var(--text-2)" }}>
                                  {ps.l}
                                </span>
                                <span style={{ fontSize: "24px", fontWeight: "600", letterSpacing: "-.02em" }}>
                                  {ps.v}
                                </span>
                                <span style={{ fontSize: "12px", color: "var(--text-3)" }}>
                                  {ps.d}
                                </span>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                          <div style={{ flex: "1 1 380px", minWidth: "0", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column", gap: "16px" }}>
                            <span style={{ fontSize: "16px", fontWeight: "600" }}>
                              {"Opening mastery"}
                            </span>
                            {(v.progOpen || []).map((po, $index) => (
                              <React.Fragment key={po && po.key != null ? po.key : $index}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                                    <span>
                                      {po.name}
                                    </span>
                                    <span style={{ fontFamily: "'Geist Mono',monospace", fontWeight: "600" }}>
                                      {po.pct}
                                    </span>
                                  </div>
                                  <div style={{ height: "8px", borderRadius: "4px", background: "var(--surface-3)", overflow: "hidden" }}>
                                    <div style={{ width: po.w, height: "100%", borderRadius: "4px", background: po.color, transition: "width .8s" }} />
                                  </div>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                          <div style={{ flex: "1 1 300px", minWidth: "0", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                                {"Weekly practice time"}
                              </span>
                              <span style={{ fontSize: "13px", color: "var(--text-2)" }}>
                                {"3h 05m"}
                              </span>
                            </div>
                            <div style={{ flex: "1", minHeight: "150px", display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "8px", alignItems: "end" }}>
                              {(v.weekBars || []).map((wb, $index) => (
                                <React.Fragment key={wb && wb.key != null ? wb.key : $index}>
                                  <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: "6px" }}>
                                    <span style={{ fontSize: "11px", color: "var(--text-3)" }}>
                                      {wb.m}
                                    </span>
                                    <div style={{ width: "100%", maxWidth: "32px", height: wb.h, borderRadius: "6px", background: wb.bg }} />
                                    <span style={{ fontSize: "11px", color: "var(--text-3)" }}>
                                      {wb.d}
                                    </span>
                                  </div>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                          <div style={{ flex: "1 1 300px", minWidth: "0", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                                {"Training accuracy"}
                              </span>
                              <span style={{ fontSize: "13px", color: "var(--green)" }}>
                                {"61% → 76%"}
                              </span>
                            </div>
                            <div style={{ position: "relative", flex: "1", minHeight: "150px" }}>
                              <svg viewBox={"0 0 100 100"} preserveAspectRatio={"none"} style={{ position: "absolute", inset: "0", width: "100%", height: "100%", overflow: "visible" }}>
                                <polyline points={v.accPts} fill={"none"} stroke={"var(--green)"} vectorEffect={"non-scaling-stroke"} style={{ strokeWidth: "2.5", strokeLinejoin: "round", strokeLinecap: "round" }} />
                              </svg>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-3)" }}>
                              <span>
                                {"8 weeks ago"}
                              </span>
                              <span>
                                {"This week"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                          <div style={{ flex: "1 1 300px", minWidth: "0", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ fontSize: "16px", fontWeight: "600", paddingBottom: "8px" }}>
                              {"Biggest improvements"}
                            </span>
                            {(v.improvements || []).map((im, $index) => (
                              <React.Fragment key={im && im.key != null ? im.key : $index}>
                                <div style={{ display: "flex", gap: "12px", alignItems: "center", padding: "10px 0", borderTop: "1px solid var(--border)" }}>
                                  <div style={{ flex: "1", minWidth: "0" }}>
                                    <div style={{ fontSize: "14px", fontWeight: "500" }}>
                                      {im.t}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "2px" }}>
                                      {im.d}
                                    </div>
                                  </div>
                                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "13px", color: "var(--green)", fontWeight: "600" }}>
                                    {im.v}
                                  </span>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                          <div style={{ flex: "1 1 300px", minWidth: "0", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ fontSize: "16px", fontWeight: "600", paddingBottom: "8px" }}>
                              {"Biggest weaknesses"}
                            </span>
                            {(v.weaknesses || []).map((wk, $index) => (
                              <React.Fragment key={wk && wk.key != null ? wk.key : $index}>
                                <div style={{ display: "flex", gap: "12px", alignItems: "center", padding: "10px 0", borderTop: "1px solid var(--border)" }}>
                                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--red)", flex: "none" }} />
                                  <div style={{ flex: "1", minWidth: "0" }}>
                                    <div style={{ fontSize: "14px", fontWeight: "500" }}>
                                      {wk.t}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "2px" }}>
                                      {wk.d}
                                    </div>
                                  </div>
                                  <span onClick={wk.onClick} style={{ fontSize: "13px", color: "var(--coach)", cursor: "pointer", whiteSpace: "nowrap" }}>
                                    {"Practice →"}
                                  </span>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                          <div style={{ flex: "1 1 300px", minWidth: "0", background: "var(--coach-soft)", border: "1px solid var(--coach-line)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column", gap: "10px" }}>
                            <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", letterSpacing: ".09em", color: "var(--coach)" }}>
                              {"RECOMMENDED NEXT LESSON"}
                            </span>
                            <span style={{ fontSize: "19px", fontWeight: "600", letterSpacing: "-.015em" }}>
                              {"Caro-Kann · Advance variation"}
                            </span>
                            <span style={{ fontSize: "14px", lineHeight: "1.55", color: "var(--text-2)", flex: "1" }}>
                              {"Your main-line accuracy is up to 71%. Time to learn what to do when White plays 3.e5 — and why ...c5 is your key break."}
                            </span>
                            <button onClick={v.goCaro} style={{ alignSelf: "flex-start", height: "38px", padding: "0 16px", borderRadius: "10px", border: "none", background: "var(--coach)", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                              {"Start lesson 3 →"}
                            </button>
                          </div>
                        </div>
                      </>
                    ) : null}
                    {v.isEmpty ? (
                      <>
                        <div style={{ padding: "56px 24px", border: "1px dashed var(--border-2)", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center" }}>
                          <div style={{ fontSize: "18px", fontWeight: "600" }}>
                            {"No progress yet"}
                          </div>
                          <div style={{ fontSize: "14px", color: "var(--text-2)", maxWidth: "380px" }}>
                            {"Finish your first lesson and you’ll see mastery, accuracy and practice time here."}
                          </div>
                          <button onClick={v.goLibrary} style={{ marginTop: "6px", height: "40px", padding: "0 18px", borderRadius: "10px", border: "none", background: "var(--text)", color: "var(--bg)", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                            {"Start your first lesson"}
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                </>
              ) : null}
              {v.isSettings ? (
                <>
                  <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px", animation: "ccIn .35s ease-out" }}>
                    <h1 style={{ margin: "0", fontSize: "30px", fontWeight: "600", letterSpacing: "-.025em" }}>
                      {"Settings"}
                    </h1>
                    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "16px 20px", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "500" }}>
                            {"Theme"}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "2px" }}>
                            {"Dark is easiest on the eyes for long sessions"}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "2px", padding: "3px", borderRadius: "9px", background: "var(--surface-2)" }}>
                          {(v.setTheme || []).map((o, $index) => (
                            <React.Fragment key={o && o.key != null ? o.key : $index}>
                              <button onClick={o.onClick} style={{ height: "28px", padding: "0 12px", border: "none", borderRadius: "7px", background: o.bg, color: o.color, fontSize: "13px", cursor: "pointer" }}>
                                {o.label}
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "16px 20px", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "500" }}>
                            {"Board"}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "2px" }}>
                            {"Square colors"}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "2px", padding: "3px", borderRadius: "9px", background: "var(--surface-2)" }}>
                          {(v.setBoard || []).map((o, $index) => (
                            <React.Fragment key={o && o.key != null ? o.key : $index}>
                              <button onClick={o.onClick} style={{ height: "28px", padding: "0 12px", border: "none", borderRadius: "7px", background: o.bg, color: o.color, fontSize: "13px", cursor: "pointer" }}>
                                {o.label}
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      <div onClick={v.replayOnb} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "16px 20px", borderBottom: "1px solid var(--border)", cursor: "pointer" }} className="cc-hover-25">
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "500" }}>
                            {"Replay onboarding"}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "2px" }}>
                            {"Change your level, goals or first opening"}
                          </div>
                        </div>
                        <span style={{ color: "var(--text-3)" }}>
                          {"→"}
                        </span>
                      </div>
                      <div onClick={v.toggleCoords} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "16px 20px", borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "500" }}>
                            {"Board coordinates"}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "2px" }}>
                            {"Show a–h and 1–8 on the board edge"}
                          </div>
                        </div>
                        <div style={{ width: "38px", height: "22px", borderRadius: "11px", background: v.coordsBg, position: "relative", transition: "background .2s" }}>
                          <div style={{ position: "absolute", top: "2px", left: v.coordsX, width: "18px", height: "18px", borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
                        </div>
                      </div>
                      <div onClick={v.onEngine} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "16px 20px", borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "500" }}>
                            {"Show engine evaluation in lessons"}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "2px" }}>
                            {"Off by default — your coach explains instead"}
                          </div>
                        </div>
                        <div style={{ width: "38px", height: "22px", borderRadius: "11px", background: v.engineDefaultBg, position: "relative", transition: "background .2s" }}>
                          <div style={{ position: "absolute", top: "2px", left: v.engineDefaultX, width: "18px", height: "18px", borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "16px 20px", flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "500" }}>
                            {"Coach explanations"}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "2px" }}>
                            {"How much detail your coach gives by default"}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "2px", padding: "3px", borderRadius: "9px", background: "var(--surface-2)" }}>
                          {(v.setDepth || []).map((o, $index) => (
                            <React.Fragment key={o && o.key != null ? o.key : $index}>
                              <button onClick={o.onClick} style={{ height: "28px", padding: "0 12px", border: "none", borderRadius: "7px", background: o.bg, color: o.color, fontSize: "13px", cursor: "pointer" }}>
                                {o.label}
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </main>
            {v.showBottomNav ? (
              <>
                <nav style={{ position: "sticky", bottom: "0", zIndex: "30", display: "flex", borderTop: "1px solid var(--border)", background: "var(--bg)", padding: "6px 4px 10px" }}>
                  {(v.bottomNav || []).map((n, $index) => (
                    <React.Fragment key={n && n.key != null ? n.key : $index}>
                      <div onClick={n.onClick} style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "6px 0", minHeight: "48px", cursor: "pointer", color: n.color, fontSize: "11px", fontWeight: "500" }}>
                        <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} style={{ color: n.ic, strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }}>
                          <path d={n.icon} />
                        </svg>
                        {n.label}{" "}
                      </div>
                    </React.Fragment>
                  ))}
                </nav>
              </>
            ) : null}
          </div>
          {v.hasToast ? (
            <>
              <div style={{ position: "fixed", left: "50%", bottom: "88px", transform: "translateX(-50%)", zIndex: "100", padding: "11px 16px", borderRadius: "12px", background: "var(--text)", color: "var(--bg)", fontSize: "14px", fontWeight: "500", boxShadow: "0 10px 30px rgba(0,0,0,.35)", animation: "ccIn .25s ease-out", display: "flex", gap: "8px", alignItems: "center" }}>
                <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} style={{ strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round" }}>
                  <path d={"M20 6L9 17l-5-5"} />
                </svg>
                {v.toast}{" "}
              </div>
            </>
          ) : null}
        </div>
      </div>
    );
  }
}

export default App;
