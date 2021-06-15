import { GameFile, GameMeta, GameTexture } from '../../core/GameFile';
import { assert } from '../../core/utils';

import create from 'zustand';

interface State {
  fileIdx: number,
  filename: string,
  game: GameFile,
  meta: GameMeta,
  textures: GameTexture[],
  loadGameFromFile?: (file: File, fileIdx: number, filename: string) => Promise<any>,
}

const dummyGame = new GameFile();

export const useGameFile = create<State>((set, get) => ({
  fileIdx: -1,
  filename: '',
  game: dummyGame,
  meta: dummyGame.meta,
  textures: [],
  loadGameFromFile: async (file: File, fileIdx: number, filename: string) => {
    const data = await file.arrayBuffer();
    const game = GameFile.fromBuffer(data);
    const meta = game.meta;
    const textures = game.textures;
    console.log('loaded game: ', game);
    (window as any).game = game; // for debugging
    set({ game, meta, textures, fileIdx, filename });
  },
}));