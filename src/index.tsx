import { GameData } from './Game';

import testUrl from '../demofiles/file_to_edit.bin';

(async () => {

  const game = await GameData.fromUrl(testUrl);
  game.saveAs('exported.bin');
  
})();