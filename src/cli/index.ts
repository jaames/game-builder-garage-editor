/**
 * This is a very minimal CLI for debugging, might flesh it out later though
 */

import { promises as fs } from 'fs';
import { Command } from 'commander';
const version = require('../../package.json').version;

import { GameFile, GameFileHasher } from '../core/GameFile';
import { GameTable } from '../core/GameTable';

const program = new Command();

program
  .version(version); 

program
  .command('game-hash <source>')
  .description('attempt to generate a value hash for a given game file')
  .action(async (source) => {
    const f = await fs.readFile(source);
    const game = GameFile.fromBuffer(f.buffer);
    const hash = new GameFileHasher();
    hash.update(game);
    console.log(`Value hash for ${source}:`, hash.digest());
  });

program
  .command('game-meta <source>')
  .description('returns the metadata for a given game file')
  .action(async (source) => {
    const f = await fs.readFile(source);
    const game = GameFile.fromBuffer(f.buffer);
    console.log(game.meta);
  });

program
  .command(`table-hashes <source>`)
  .description('read the value hashes from a LgcTpb.bin file')
  .action(async (source) => {
    const f = await fs.readFile(source);
    const tpb = GameTable.fromBuffer(f.buffer);
    console.log(`Value hashes from table: `, tpb.fileHashes);
  });

program.exitOverride();

try {
  program.parse(process.argv);
}
catch (err) {
  console.warn(`\nPlease enter a valid command`);
}
