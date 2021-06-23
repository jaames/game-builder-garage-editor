import { GameFile } from './formats';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';

import levelUrl from '../demofiles/lgctpbfile_mygame_10.bin';

(async () => {

  const app = new PIXI.Application({ antialias: true, resizeTo: window, backgroundColor: 0xffffff });
  document.getElementById('root').appendChild(app.view);
  const viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    // worldWidth: 96000,
    // worldHeight: 96000,
    interaction: app.renderer.plugins.InteractionEvent
  });
  app.stage.addChild(viewport);

  viewport.moveCenter(0, 0);
  viewport.drag().pinch().wheel().decelerate()

  const game = await GameFile.fromUrl(levelUrl);
  console.log(game.meta);
  (window as any).game = game;
  (window as any).app = app;

  const bg = new PIXI.Graphics();

  bg.lineStyle(1, 0x01010, .5);
  for (let i = 0; i < 10; i++)
    bg.drawCircle(0, 0, i * 400);

  viewport.addChild(bg);

  const nodonPositions = new Map<number, [number, number]>();

  game.nodons.forEach(nodon => {
    let [x, y] = nodon.canvasPos;
    let [width, height] = nodon.canvasSize;
    let [sX, sY] = nodon.canvasScale;
    x /= 100;
    y /= -100; // y is inverted
    x *= 10;
    y *= 10;
    width *= sX * 10;
    height *= sY * 10;

    const nodonUi = new PIXI.Graphics();
    nodonUi.lineStyle(2, 0xDE3249, 1, 0);

    nodonUi.beginFill(0xff00ff, .01);
    nodonUi.drawRoundedRect(- width / 2, - height / 2, width, height, 3);
    nodonUi.endFill();
    nodonUi.rotation = Math.PI - nodon.canvasRotate
    nodonUi.position.x = x;
    nodonUi.position.y = y;
    nodonUi.name = nodon.id.toString();
    viewport.addChild(nodonUi);

    const text = new PIXI.Text(`${ nodon.type }_${ nodon.id }`);
    text.resolution = 3;
    text.style.fontSize = 12;
    text.style.fill = 0x000000;
    text.position.x = x - width / 2;
    text.position.y = y + height / 2;
    viewport.addChild(text);

    nodonUi.interactive = true;
    nodonUi.on('pointerdown', (e: PIXI.InteractionEvent) => {
      console.log(e.target);
    });

    nodonPositions.set(nodon.id, [x, y]);
  });

  game.connections.forEach(connection => {
    const { idA, idB } = connection;
    const nodeA = nodonPositions.get(idA);
    const nodeB = nodonPositions.get(idB);
    const [xA, yA] = nodeA;
    const [xB, yB] = nodeB;
    const lineUi = new PIXI.Graphics();
    lineUi.lineStyle(2, 0xe40050, 1);
    // lineUi.drawCircle(xA, yA, 2);
    // lineUi.drawCircle(xB, yB, 2);
    lineUi.moveTo(xA, yA);
    lineUi.lineTo(xB, yB);
    lineUi.closePath();
    viewport.addChild(lineUi);
  });
})();