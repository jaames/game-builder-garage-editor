import create from 'zustand';

import { GameFile, GameMeta, GameTexture } from '../../core/GameFile';

import { useSaveData } from './saveData';

interface State {
  isGameLoaded: boolean,
  fileIdx: number,
  filename: string,
  game: GameFile,
  meta: GameMeta,
  textures: GameTexture[],
  loadGameWithIdx?: (idx: number) => Promise<any>
};

const dummyGame = new GameFile();

export const useGameFile = create<State>((set, get) => ({
  isGameLoaded: false,
  fileIdx: -1,
  filename: '',
  game: dummyGame,
  meta: dummyGame.meta,
  textures: [],
  loadGameWithIdx: async (fileIdx: number) => {
    const saveData = useSaveData.getState();
    const [filename, game] = await saveData.getGameWithIdx(fileIdx);
    const meta = game.meta;
    const textures = game.textures;
    set({
      isGameLoaded: true,
      game,
      filename,
      meta,
      textures
    });
  },
}));