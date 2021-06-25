import create from 'zustand';

import { GameFile, GameMetaExtended } from '../../formats';
import { Texture } from '../../objects';

import { useSaveData } from './saveData';

interface State {
  isGameLoaded: boolean,
  fileIdx: number,
  filename: string,
  game: GameFile,
  meta: GameMetaExtended,
  textures: Texture[],
  close: () => void
  loadGameWithIdx: (idx: number) => Promise<any>
};

const dummyGame = new GameFile();

export const useGameFile = create<State>((set, get) => ({
  isGameLoaded: false,
  fileIdx: -1,
  filename: '',
  game: dummyGame,
  meta: dummyGame.meta,
  textures: [],
  close: () => {
    set({
      isGameLoaded: false,
      fileIdx: -1,
      game: dummyGame,
      filename: '',
      meta: dummyGame.meta,
      textures: dummyGame.textures
    });
  },
  loadGameWithIdx: async (fileIdx: number) => {
    const state = get();
    if (fileIdx !== state.fileIdx) {
      state.close();
      const saveData = useSaveData.getState();
      const [filename, game] = await saveData.getGameWithIdx(fileIdx);
      const meta = game.meta;
      const textures = game.textures;
      set({
        isGameLoaded: true,
        fileIdx,
        game,
        filename,
        meta,
        textures
      });
    }
  },
}));