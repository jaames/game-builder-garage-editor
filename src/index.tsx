import { GameFile } from './GameFile';
import { GameTable } from './GameTable';

import levelUrl from '../demofiles/file_to_edit.bin';
import saveUrl from '../demofiles/gametbl.bin';

(async () => {

  const game = await GameFile.fromUrl(levelUrl);
  console.log(game);

  const save = await GameTable.fromUrl(saveUrl);
  console.log(save);
  // game.saveAs('exported.bin');
  
})();