import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Chess } from 'chess.js';
const catalog=JSON.parse(await readFile('public/openings/catalog.json','utf8'));
const metadata=JSON.parse(await readFile('src/data/openings-meta.json','utf8'));
assert.equal(catalog.count,catalog.openings.length);assert.equal(catalog.count,metadata.count);
assert.equal(catalog.names,new Set(catalog.openings.map(o=>o.name)).size);
assert.equal(new Set(catalog.openings.map(o=>o.id)).size,catalog.count);
assert.deepEqual([...new Set(catalog.openings.map(o=>o.eco[0]))].sort(),['A','B','C','D','E']);
for(const opening of catalog.openings){assert(/^[A-E]\d{2}$/.test(opening.eco));const game=new Chess();game.loadPgn(opening.pgn);assert.equal(game.fen(),opening.fen,opening.name);}
console.log(`PASS: ${catalog.count} complete, legal opening lines; ${catalog.names} names; all five ECO volumes; stable IDs and verified final positions.`);
