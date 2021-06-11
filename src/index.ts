import { GameDataParser } from './GameData';

import testUrl from '../demofiles/texture_drawing.bin';

(async () => {
  const resp = await fetch(testUrl);
  const data = await resp.arrayBuffer();
  const game = new GameDataParser(data);

  (window as any).game = game;

  const img = document.createElement('img');
  img.src = game.getThumbnailJpegUrl();

  document.body.appendChild(img);

  const textures = game.getTextureList();

  textures.forEach(texture => {
    if (texture.isUsed) {
      const canvas = texture.getCanvas();
      document.body.appendChild(canvas);
    }
  });
  
})();