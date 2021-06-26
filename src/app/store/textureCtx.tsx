import create from 'zustand';

import { Texture } from '../../objects';
import { assert } from '../../utils';

import { ToolType } from '../editor/toolbox/ToolTypes';

import { useGameFile } from './gameFile';

const dummyTexture = new Texture();

export interface TextureCtxState {
  idx: number,
  isTextureLoaded: boolean,
  texture: Texture,
  canUndo: boolean,
  canRedo: boolean,
  activeTool: ToolType,
  toolColor: number,
  toolSize: number,
  viewZoom: number,
  loadTextureWithIdx: (idx: number) => void,
  setActiveTool: (idx: number) => void,
  setToolColor: (toolColor: number) => void,
  setToolSize: (toolSize: number) => void,
  setZoom: (viewZoom: number) => void,
  undo: () => void,
  redo: () => void,
};

export const useTextureCtx = create<TextureCtxState>((set, get) => ({
  idx: 0,
  isTextureLoaded: false,
  texture: dummyTexture,
  canUndo: false,
  canRedo: false,
  activeTool: ToolType.Pen,
  toolColor: 9,
  toolSize: 3,
  viewZoom: 4,
  loadTextureWithIdx: (idx: number) => {
    const gameCtx = useGameFile.getState();
    if (gameCtx.isGameLoaded && idx < gameCtx.textures.length) {
      const game = gameCtx.game;
      const texture = game.textures[idx];
      set({ isTextureLoaded: true, idx, texture });
    }
    // TODO: handle errors
  },
  setActiveTool: (activeTool: number) => set({ activeTool }),
  setToolColor: (toolColor: number) => set({ toolColor }),
  setToolSize: (toolSize: number) => set({ toolSize }),
  setZoom: (viewZoom: number) => set({ viewZoom }),
  undo: () => {},
  redo: () => {}
}));