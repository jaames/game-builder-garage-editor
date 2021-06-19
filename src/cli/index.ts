import { promises as fs } from 'fs';

import { GameFileHasher } from './GameFileHasher';
import { GameFile } from '../core/GameFile';
import { GameTable } from '../core/GameTable';

(async () => {

  for (let i = 0; i < 12; i++) {
    const filename = `./demofiles/LgcTpbFile_MyGame[${ i }].bin`;
    const f = await fs.readFile(filename);
    const game = GameFile.fromBuffer(f.buffer);
    const hash = new GameFileHasher();
    hash.update(game);
    console.log(hash.digest());
  }

  const tpb = await fs.readFile(`./demofiles/LgcTpb.bin`);
  const table = GameTable.fromBuffer(tpb.buffer);

  console.log(table.fileHashes);

})();