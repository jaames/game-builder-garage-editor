import create from 'zustand';

import { GameTexture } from '../../core/GameFile';
import { TextureEditor } from '../editor';
import { assert } from '../../core/utils';

import { useGameFile } from './gameFile';

interface State {
  idx: number,
  isTextureLoaded: boolean,
  texture: GameTexture,
  editor: TextureEditor,
  loadTextureWithIdx: (idx: number) => void,
};

const dummyTexture = new GameTexture();

export const useTextureCtx = create<State>((set, get) => ({
  idx: 0,
  isTextureLoaded: false,
  texture: dummyTexture,
  editor: new TextureEditor(),
  loadTextureWithIdx: (idx: number) => {
    const gameCtx = useGameFile.getState();
    if (gameCtx.isGameLoaded && idx < gameCtx.textures.length) {
      const game = gameCtx.game;
      const texture = game.textures[idx];
      get().editor.setTexture(texture);
      set({ isTextureLoaded: true, idx, texture });
    }
    // TODO: handle errors
  }
}));

// for debug
(window as any).editor = useTextureCtx.getState().editor;