import { GameFile } from './formats';
import { MapRenderer, GraphRenderer } from './renderers';
// import levelUrl from '../demofiles/lgctpbfile_mygame_5.bin'; // flappy bird
// import levelUrl from '../demofiles/lgctpbfile_mygame_14.bin'; // excitebike
// import levelUrl from '../demofiles/lgctpbfile_mygame_16.bin'; // superhot
// import levelUrl from '../demofiles/lgctpbfile_mygame_6.bin'; // mariokart
import levelUrl from '../demofiles/lgctpbfile_mygame_18.bin'; // mario 3d land

(async () => {
  const game = await GameFile.fromUrl(levelUrl);
  console.log(game.meta);
  (window as any).game = game;
  
  const graph = new GraphRenderer(document.getElementById('root_2d'));
  graph.loadGame(game);
  (window as any).graph = graph;

  const map = new MapRenderer(document.getElementById('root_3d'));
  map.onSelectNodon = graph.centerViewToNodon
  map.loadGame(game);
  (window as any).map = map;

})();