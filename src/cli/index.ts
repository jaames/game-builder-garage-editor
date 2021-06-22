/**
 * This is a very minimal CLI for debugging, might flesh it out later though
 */

import { promises as fs } from 'fs';
import { Command } from 'commander';
const version = require('../../package.json').version;

import { GameFile, GameFileHasher, GameKey, GameTable, TableKey } from '../formats';
import { bymlTreeToYaml } from './bymlToYaml';

const program = new Command();

program
  .version(version); 

program
  .command('game-hash <input>')
  .description('attempt to generate a value hash for a given game file (not working)')
  .action(async (input) => {
    const f = await fs.readFile(input);
    const game = GameFile.fromBuffer(f.buffer);
    const hash = new GameFileHasher();
    hash.update(game);
    console.log(`Value hash for ${input}:`, hash.digest());
  });

program
  .command('game-dump <input> <output>')
  .description('dump game content to a YAML file')
  .action(async (input, output) => {
    const f = await fs.readFile(input);
    const game = GameFile.fromBuffer(f.buffer);
    const yaml = bymlTreeToYaml(game._bymlCache, GameKey);
    await fs.writeFile(output, yaml);
    console.log(`Wrote game YAML data to ${ output }`);
  });

program
  .command('game-meta <input>')
  .description('returns metadata for a given game file')
  .action(async (input) => {
    const f = await fs.readFile(input);
    const game = GameFile.fromBuffer(f.buffer);
    console.log(game.meta);
  });

program
  .command(`table-hashes <input>`)
  .description('read value hashes from a LgcTpb.bin file')
  .action(async (input) => {
    const f = await fs.readFile(input);
    const tpb = GameTable.fromBuffer(f.buffer);
    console.log(`Value hashes from table: `, tpb.fileHashes);
  });

program
  .command('table-dump <input> <output>')
  .description('dump table content to a YAML file')
  .action(async (input, output) => {
    const f = await fs.readFile(input);
    const game = GameTable.fromBuffer(f.buffer);
    const yaml = bymlTreeToYaml(game._bymlCache, TableKey);
    await fs.writeFile(output, yaml);
    console.log(`Wrote table YAML data to ${ output }`);
  });

program.exitOverride();

try {
  program.parse(process.argv);
}
catch (err) {
  console.warn(`\nPlease enter a valid command`);
}
