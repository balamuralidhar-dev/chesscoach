# Chess Coach (React)

```
npm install
npm run dev
```

- `src/App.jsx` — all screens + state (screen router lives in `state.screen`)
- `src/Chessboard.jsx` — drag/tap board with arrows, square marks, coordinates
- `src/index.css` — theme tokens (dark/light), board themes, animations

Coach chat calls `window.claude.complete` when available and falls back to scripted answers otherwise — swap in your own API there (`sendChat`).

## Play Chess

The app opens on the public **Dashboard**. Browsing does not require an account.
Click **Play Chess** to sign in or register; successful login continues to
game setup. Cancel sign-in to return to browsing. Click or drag a piece to a highlighted legal
square. Play White against Stockfish, or choose two players on the
same device. Choose your opponent and difficulty, then press **Start
game**. Settings are applied when the game starts. **New game** returns to
setup; after a result, **Play again** opens setup for the next match. Undo takes back a full turn against the engine; Flip
Board changes the view. Promotion offers queen, rook, bishop, or knight.
Export PGN downloads the current game.

`chess.js` manages full FEN state, legal moves, castling, en passant,
promotion, checkmate and draws. Stockfish 19 runs in a dedicated browser
worker using the single-threaded lite WASM build from
https://github.com/nmrugg/stockfish.js (the browser port of
https://github.com/official-stockfish/Stockfish).

`npm run dev` and `npm run build` copy the engine assets from the installed
package into `public/engine`, including its GPL-3.0 license and source link.
The built site serves its engine locally and does not need an engine API.

## User flow

1. **Set up:** choose Stockfish or a friend, choose difficulty, then Start game.
2. **Play:** follow the active player indicator, select a piece, and choose a legal destination. Capture targets have a ring. Undo, flip, and download moves are available alongside the board.
3. **Finish:** checkmate or a draw shows the result and Play again. Export the game for review.

The How to play panel explains the controls. The board uses the official `@lichess-org/chessground` package with its Cburnett vector pieces, touch and drag controls, animations, arrows, move and capture highlights, and reduced-motion support. chess.js remains the authority for all moves. On smaller screens setup appears before the board.

## Accounts and sign-in

`npm run dev` starts both Vite (port 5173) and the authentication server (port
3001). New visitors can browse the dashboard and learning screens without login.
**Play Chess** and **Play With Coach** require authentication. Successful
authentication resumes the requested screen, rather than restarting navigation. The header avatar opens Profile; Sign out is available inside the profile dialog. Signing out returns
to public browsing and ends any active game.
An HTTP-only, SameSite=Strict cookie restores the session in the background
when reloading. Unavailable authentication does not block public browsing.
Sessions expire after seven days and are cleared when the backend restarts.

The local backend stores accounts in `.data/users.json` (excluded from git).
Passwords use salted scrypt hashes; passwords and session tokens are never
stored in browser localStorage. Authentication requests have origin checks,
input limits, and rate limiting. Run `npm run test:auth` for integration checks.

For a hosted deployment, run the authentication backend behind the same
origin at `/api`, set `AUTH_ORIGINS` to the exact frontend origin, set
`AUTH_SECURE_COOKIE=true` with HTTPS, and provide persistent account storage.
The included backend is intended for local use with one server process;
production deployment should use a managed database and session store.
Email verification and password recovery are not implemented.

## UI verification

`npm run test:ui` checks legal destinations, Chessground pointer moves, public browsing before login, Play-triggered authentication, cancel,
resuming Play after login, and returning to the public dashboard on logout.
Chessground source and GPL-3.0-or-later license: https://github.com/lichess-org/chessground.

## Demo login and profile

A local test account is available:

- Email: `demo@chesscoach.local`
- Password: `ChessDemo!2026`

To recreate it on a fresh checkout, start `npm run dev`, then run
`npm run demo:account`. This creates the account through the local API and
verifies an existing account without overwriting it.

After login, click your avatar in the header to open **Profile**. The profile
dialog shows your sign-in email and lets you edit your display name. **Save
changes** persists the name; **Back to chess** closes the dialog while keeping
the current game. **Sign out** returns to public browsing. Display-name changes
are tested through both the UI and authenticated API, including rejection of
unauthenticated updates.

## Full opening catalog

Learn Openings uses the public-domain (CC0) Lichess chess-openings dataset,
with 3,864 lines and 3,176 distinct names across ECO A–E. Search by name, ECO
code, or moves, use the ECO filters, and page through results. Selecting a
line opens a board with move-by-move replay and clickable moves. These are
reference lines; the dataset does not supply coaching lessons.

The catalog loads on demand from `public/openings/catalog.json`. Provenance
is recorded in `src/data/openings-meta.json`, and the dataset license is in
`public/openings/LICENSE.txt`. Run `npm run openings:update` to refresh from
Lichess (requires network access), or `npm run test:openings` to validate all
move sequences and positions.

On the Play screen, player details, status, and promotion
are in the side panel. The board is the final element in its column. On small
screens the controls appear before the board.

A standard game starts you as White against Stockfish; scenarios can use either side. The keyboard move
form, color-selection section, technology credits, and external opening links
are omitted from the UI; dataset provenance and license files remain in the project.

## Create a scenario and play Stockfish

Open Play Chess and choose **Create scenario**. Name the scenario, choose a
preset or clear the board, select a piece from the palette, and click a square
to place it. Use Erase piece to remove pieces. Choose the side to move and the
side you want to play. Import FEN accepts full castling and en-passant state;
manual piece placement clears those rights. Invalid or terminal positions are
rejected before playing.

**Save scenario** stores the position on this device and returns to setup.
Choose it under Starting position later, or use **Play Stockfish** directly
from the editor. Stockfish receives the exact starting FEN and the subsequent
move history. PGN downloads preserve the scenario starting position.

Light is the default theme. The desktop Play screen fits the viewport with
three columns: board, Make it your game, and Moves. Long settings or move lists
scroll within their own panels. Narrow mobile screens retain natural page
scrolling. Run `npm run test:scenarios` to check position validation and a real
Stockfish reply from a custom Black-to-move scenario.
