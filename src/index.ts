import { GameFile } from './formats';
import Two from 'twojs-ts';

import levelUrl from '../demofiles/excitebike.bin';

(async () => {
  const elem = document.getElementById('root');

  if (elem) {
    const game = await GameFile.fromUrl(levelUrl);
    (window as any).game = game;
    console.log(game.meta);
    const two = new Two({fullscreen: true, autostart: true}).appendTo(elem);

    const originX = two.width / 2;
    const originY = two.height / 2;

    const nodonMap = new Map<number, [number, number]>();

    game.nodons.forEach(nodon => {
      let [x, y] = nodon.canvasPos;
      let [w, h] = nodon.canvasScale;
      y = -y; // y is inverted
      x /= 100;
      y /= 100;
      x += originX;
      y += originY;
      // initial nodon size is 2x2 units
      h *= 2;
      w *= 2;

      const rect = new Two.RoundedRectangle(x, y, w, h, 2);
      rect.rotation = nodon.canvasRotate;
      rect.stroke = 'orangered'; // Accepts all valid css color
      rect.linewidth = 2;
      rect.noFill();

      const label = new Two.Text(`${ nodon.type }_${ nodon.id }`, x, y - h / 2, { size: 8 });

      const group = two.makeGroup([rect, label]);

      nodonMap.set(nodon.id, [x, y]);
    });

    game.connections.forEach(connection => {
      const { idA, idB } = connection;
      const nodeA = nodonMap.get(idA);
      const nodeB = nodonMap.get(idB);
      const [xA, yA] = nodeA;
      const [xB, yB] = nodeB;
      const line = two.makeLine(xA, yA, xB, yB);
      line.stroke = 'purple';
    });

    game.textures.forEach(texture => {
      const url = texture.getUrl();
      const img = new Image();
      img.src = url;
      elem.appendChild(img);
    });

    two.update();
  }
})();