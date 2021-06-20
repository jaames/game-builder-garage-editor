import { ToolBase } from './ToolTypes';
import { GameTexture } from '../../../core/GameFile';

export class FillTool extends ToolBase {

  public name = 'Fill Bucket';
  public cursor = 'crosshair';
  public useDrawingCoordSpace = true;

  start(x: number, y: number) {
    const texture = this.editor.texture;
    const newColor = this.state.color;
    const oldColor = texture.getPixel(x, y);
    if (newColor === oldColor) return;
    this.floodFill4(texture, x, y, newColor, oldColor);
    this.editor.history.commit();
  }

  move() {}

  end() {}

  private floodFill4(tex: GameTexture, x: number, y: number, newColor: number, oldColor: number) {
    const w = tex.width;
    const h = tex.height;
    if ((x >= 0) && (x < w) && (y >= 0) && (y < h) && (tex.getPixel(x, y) === oldColor)) {
      tex.setPixel(x, y, newColor);
      this.floodFill4(tex, x + 1, y    , newColor, oldColor);
      this.floodFill4(tex, x - 1, y    , newColor, oldColor);
      this.floodFill4(tex, x    , y + 1, newColor, oldColor);
      this.floodFill4(tex, x    , y - 1, newColor, oldColor);
    }
  }
}