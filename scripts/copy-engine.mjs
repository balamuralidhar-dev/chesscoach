import { mkdir, copyFile, writeFile } from 'node:fs/promises';
await mkdir('public/engine', { recursive: true });
for (const name of ['stockfish-19-lite-single.js', 'stockfish-19-lite-single.wasm']) {
  await copyFile(`node_modules/stockfish/bin/${name}`, `public/engine/${name}`);
}
await copyFile('node_modules/stockfish/Copying.txt', 'public/engine/LICENSE.txt');
await writeFile('public/engine/SOURCE.txt', 'Stockfish 19 browser build: https://github.com/nmrugg/stockfish.js/tree/v19.0.0\nUpstream: https://github.com/official-stockfish/Stockfish\nDistributed under GPL-3.0; see LICENSE.txt.\n');
