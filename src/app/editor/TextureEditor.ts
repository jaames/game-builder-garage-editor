import { Texture } from '../../objects';
import { assert } from '../../utils';

import { useTextureCtx, TextureCtxState } from '../store/textureCtx';

import { Pattern, PatternList } from './PatternList';
import { EditorHistory } from './EditorHistory';

import { ToolBase, PenTip, PenMode, ToolType } from './toolbox/ToolTypes';
import { PenTool } from './toolbox/PenTool';
import { EraseTool } from './toolbox/EraseTool';
import { PanTool } from './toolbox/PanTool';
import { EyedropTool } from './toolbox/EyedropTool';
import { FillTool } from './toolbox/FillTool';

const VIEW_WIDTH = 64 * 10;
const VIEW_HEIGHT = 64 * 10;
const TOOLS = [
  PenTool,
  EraseTool,
  PanTool,
  EyedropTool,
  FillTool
];

export class TextureEditor {

  state: TextureCtxState;
  activeTool: ToolBase;
  tools = new Map<ToolType, ToolBase>(TOOLS.map(Tool => [Tool.type, new Tool(this)]));

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
    this.setActiveTool(ToolType.Pen);
    useTextureCtx.subscribe(this.onStateUpdate);
    this.state = useTextureCtx.getState();
  }

  onStateUpdate = (newState: TextureCtxState, prevState: TextureCtxState) => {
    if ((newState.isTextureLoaded !== prevState.isTextureLoaded) || (newState.texture !== prevState.texture))
      this.setTexture(newState.texture);
    if (newState.viewZoom !== prevState.viewZoom)
      this.setZoom(newState.viewZoom);
    this.setActiveTool(newState.activeTool);
    this.state = newState;
    this.render();
  }

  setActiveTool(toolType: ToolType) {
    this.activeTool = this.tools.get(toolType);
    this.setCursor(this.activeTool.cursor);
  }

  setCursor(cursor: string) {
    if (this.canvas) this.canvas.style.cursor = cursor;
  }

  setRenderDst(canvas: HTMLCanvasElement) {
    const dpi = window.devicePixelRatio || 1;
    const w = this.viewWidth;
    const h = this.viewHeight;
    canvas.width = w * dpi;
    canvas.height = h * dpi;
    canvas.style.width = `${ w }px`;
    canvas.style.height = `${ h }px`;
    this.isMounted = true;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.scale(dpi, dpi);
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
    const { viewOriginX, viewOriginY, viewWidth, viewHeight, textureWidth, textureHeight, viewZoom } = this;
    const left = viewOriginX - (textureWidth * viewZoom) / 2;
    const top = viewOriginY - (textureHeight * viewZoom) / 2;
    // clear current
    this.ctx.fillStyle = '#cce';
    this.ctx.fillRect(0, 0, viewWidth, viewHeight);
    // bg grid
    if (this.viewZoom > 4)
      this.drawBg(); 
    // draw texture to a temp canvas
    this.texture.copyToImageData(this.textureImgData);
    this.textureCtx.putImageData(this.textureImgData, 0, 0);
    // draw temp canvas to dst, scaled up with image smoothing disabled
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.drawImage(
      this.textureCanvas, 
      left,
      top,
      textureWidth * viewZoom, 
      textureHeight * viewZoom
    );
    if (this.viewZoom > 10)
      this.drawGrid();
  }

  drawBg() {
    const { viewOriginX, viewOriginY, textureWidth, textureHeight, viewZoom } = this;
    const left = viewOriginX - (textureWidth * viewZoom) / 2;
    const top = viewOriginY - (textureHeight * viewZoom) / 2;
    const pixelSize = viewZoom;
    // draw bg
    this.ctx.fillStyle = '#efefff';
    for (let y = 0; y < textureHeight; y += 1) {
      for (let x = 0; x < textureWidth; x += 1) {
        if ((x + y) % 2 === 0) {
          this.ctx.fillRect(
            left + (x * pixelSize),
            top + (y * pixelSize),
            pixelSize,
            pixelSize
          );
        }
      }
    }
  }

  drawGrid() {
    const { viewOriginX, viewOriginY, textureWidth, textureHeight, viewZoom } = this;
    const left = viewOriginX - (textureWidth * viewZoom) / 2;
    const top = viewOriginY - (textureHeight * viewZoom) / 2;
    const pixelSize = viewZoom;
    this.ctx.strokeStyle = '#889';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    for (let y = 1; y < textureHeight; y += 1) {
      this.ctx.moveTo(left,                            top + y * pixelSize);
      this.ctx.lineTo(left + textureWidth * pixelSize, top + y * pixelSize);
    }
    for (let x = 1; x < textureWidth; x += 1) {
      this.ctx.moveTo(left + x * pixelSize, top);
      this.ctx.lineTo(left + x * pixelSize, top + textureHeight * pixelSize);
    }
    this.ctx.closePath();
    this.ctx.stroke();
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

  setZoom(viewZoom: number) {
    useTextureCtx.setState({ viewZoom });
    this.viewZoom = viewZoom;
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
    this.setZoom(this.viewWidth / this.textureWidth);
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