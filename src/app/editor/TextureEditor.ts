import { Texture } from '../../objects';
import { assert } from '../../utils';

import { Pattern, PatternList } from './PatternList';
import { EditorHistory } from './EditorHistory';

import { ToolBase, PenTip, PenMode } from './toolbox/ToolTypes';
import { PenTool } from './toolbox/PenTool';
import { EraseTool } from './toolbox/EraseTool';
import { PanTool } from './toolbox/PanTool';
import { EyedropTool } from './toolbox/EyedropTool';
import { FillTool } from './toolbox/FillTool';

const VIEW_WIDTH = 512;
const VIEW_HEIGHT = 512;

export interface ToolState {
  color: number,
  size: number,
  tip: PenTip,
  mode: PenMode,
  pattern: Pattern | null,
};

export class TextureEditor {

  activeTool: ToolBase;
  toolState: ToolState = {
    color: 9,
    size: 3,
    tip: PenTip.Square,
    mode: PenMode.Free,
    pattern: null,
  };
  tools: ToolBase[] = [
    new PenTool(this),
    new EraseTool(this),
    new PanTool(this),
    new EyedropTool(this),
    new FillTool(this),
  ];

  patterns = PatternList;
  history = new EditorHistory(this);

  texture: Texture = new Texture(); // dummy texture
  textureWidth = this.texture.width;
  textureHeight = this.texture.height;
  textureCanvas: HTMLCanvasElement; // temp canvas for rendering texture to
  textureCtx: CanvasRenderingContext2D;
  textureImgData: ImageData;

  viewWidth: number;
  viewHeight: number;
  viewOriginX: number;
  viewOriginY: number;
  viewZoom: number;

  isMounted: boolean = false;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor() {
    this.textureCanvas = document.createElement('canvas');
    this.textureCtx = this.textureCanvas.getContext('2d');
    this.setTexture(this.texture); // default to dummy texture
    this.setActiveTool(0);
  }

  setActiveTool(idx: number) {
    this.activeTool = this.tools[idx];
    this.activeTool.state = this.toolState;
    this.setCursor(this.activeTool.cursor);
  }

  setToolState(newState: Partial<ToolState>) {
    this.toolState = { ...this.toolState, ...newState };
    this.activeTool.state = this.toolState;
  }

  setToolColor(color: number) {
    this.setToolState({ color });
  }

  setCursor(cursor: string) {
    if (this.canvas) this.canvas.style.cursor = cursor;
  }

  setRenderDst(canvas: HTMLCanvasElement) {
    canvas.width = this.viewWidth;
    canvas.height = this.viewHeight;
    this.isMounted = true;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.setCursor(this.activeTool.cursor);
    this.render();
  }

  setTexture(texture: Texture) {
    this.texture = texture;
    this.textureCanvas.width = texture.width;
    this.textureCanvas.height = texture.height;
    this.textureWidth = texture.width;
    this.textureHeight = texture.height;
    this.textureImgData = this.textureCtx.createImageData(texture.width, texture.height);
    this.history.clear();
    this.history.commit();
    this.resetView();
  }

  render() {
    if (!this.isMounted) return;
    // draw texture to a temp canvas
    this.texture.copyToImageData(this.textureImgData);
    this.textureCtx.putImageData(this.textureImgData, 0, 0);
    // draw temp canvas to dst, scaled up with image smoothing disabled
    const { textureWidth, textureHeight, viewZoom: viewScale } = this;
    this.ctx.clearRect(0, 0, this.viewWidth, this.viewHeight);
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.drawImage(
      this.textureCanvas, 
      this.viewOriginX - (textureWidth * viewScale) / 2,
      this.viewOriginY - (textureHeight * viewScale) / 2, 
      textureWidth * viewScale, 
      textureHeight * viewScale
    );
  }

  onInputDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const [x, y] = this.convertInputCoords(e);
    this.activeTool.start(x, y);
    document.addEventListener('mouseup', this.onInputUp);
    document.addEventListener('mousemove', this.onInputMove);
    this.render();
  }

  onInputMove = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const [x, y] = this.convertInputCoords(e);
    this.activeTool.move(x, y);
    this.render();
  }

  onInputUp = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const [x, y] = this.convertInputCoords(e);
    this.activeTool.end(x, y);
    document.removeEventListener('mouseup', this.onInputUp);
    document.removeEventListener('mousemove', this.onInputMove);
    this.render();
  }

  setZoom(zoom: number) {
    this.viewZoom = zoom;
    this.render();
  }

  setOrigin(x: number, y: number) {
    this.viewOriginX = x;
    this.viewOriginY = y;
    this.render();
  }

  // x and y between 0.0 and 1.0
  setOriginNorm(x: number, y: number) {
    this.setOrigin(x * this.viewWidth, y * this.viewHeight)
  }

  resetView() {
    this.viewWidth = VIEW_WIDTH;
    this.viewHeight = VIEW_HEIGHT;
    this.viewOriginX = this.viewWidth / 2;
    this.viewOriginY = this.viewHeight / 2;
    this.viewZoom = this.viewWidth / this.textureWidth;
    this.render();
  }

  private convertInputCoords(e: MouseEvent) {
    const el = this.canvas;
    const bounds = el.getBoundingClientRect();
    const inX = (e.clientX - bounds.left);
    const inY = (e.clientY - bounds.top);
    if (this.activeTool.useDrawingCoordSpace) {
      const viewZoom = this.viewZoom;
      const viewX = this.viewOriginX - (this.textureWidth * viewZoom) / 2;
      const viewY = this.viewOriginY - (this.textureHeight * viewZoom) / 2;
      return [Math.floor((inX - viewX) / viewZoom), Math.floor((inY - viewY) / viewZoom)];
    }
    return [inX, inY];
  }
}