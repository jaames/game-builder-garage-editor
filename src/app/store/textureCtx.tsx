import create from 'zustand';

import { Texture } from '../../objects';
import { assert } from '../../utils';
import { TextureEditor } from '../editor';

import { useGameFile } from './gameFile';

interface State {
  idx: number,
  isTextureLoaded: boolean,
  texture: Texture,
  editor: TextureEditor,
  loadTextureWithIdx: (idx: number) => void,
};

const dummyTexture = new Texture();

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