import { ToolBase, ToolType, PenTip, PenMode } from './ToolTypes';

import { Texture } from '../../../objects';
import { assert } from '../../../utils';
import { Pattern, PatternList } from '../PatternList';
import { plotLine, plotRectangle, plotFilledRectangle, plotCircle, plotFilledCircle } from '../plotUtils';

export class PenTool extends ToolBase {

  static type = ToolType.Pen;

  name = 'Pen';
  cursor = 'crosshair';
  useDrawingCoordSpace = true;

  isDown: boolean = false;
  lastX: number = -1;
  lastY: number = -1;

  move(x: number, y: number) {
    if (this.isDown && (this.lastX !== x || this.lastY !== y)) {
      const texture = this.editor.texture;
      this.drawLine(texture, this.lastX, this.lastY, x, y);
      this.lastX = x;
      this.lastY = y;
    }
  }

  end(x: number, y: number) {
    this.isDown = false;
    this.lastX = -1;
    this.lastY = -1;
    this.editor.history.commit();
  }

  start(x: number, y: number) {
    this.isDown = true;
    this.lastX = x;
    this.lastY = y;
    this.drawPoint(this.editor.texture, x, y);
  }

  getColor() {
    return this.editor.state.toolColor;
  }

  drawPixel(tex: Texture, x: number, y: number) {
    const color = this.getColor();
    // / TODO: make customizable
    // if (this.state.pattern !== null) { /
    //   const pattern = this.state.pattern;
    //   const xMod = x % pattern.width;
    //   const yMod = y % pattern.height;
    //   const mask = pattern.mask[(yMod * pattern.width) + xMod];
    //   if (mask === 1)
    //     tex.setPixel(x, y, color);
    // }
    // else
      tex.setPixel(x, y, color);
  }

  drawPoint(tex: Texture, x: number, y: number) {
    const state = this.editor.state;
    const size = state.toolSize;
    const tip: PenTip = PenTip.Square; // TODO: make customizable
    // single pixel regardless of shape
    if (size === 1)
      this.drawPixel(tex, x, y);
    // draw 2 x 2 square regardless of tip shape
    else if (size === 2) {
      this.drawPixel(tex, x    , y    );
      this.drawPixel(tex, x - 1, y    );
      this.drawPixel(tex, x    , y - 1);
      this.drawPixel(tex, x - 1, y - 1);
    }
    // TODO: uncomment after fixing plot circle
    // else if (tip === PenTip.Round) {
    //   // draw a plus shape
    //   if (size === 3) {
    //     this.drawPixel(tex, x    , y - 1);
    //     this.drawPixel(tex, x - 1, y    );
    //     this.drawPixel(tex, x    , y    );
    //     this.drawPixel(tex, x + 1, y    );
    //     this.drawPixel(tex, x    , y + 1);
    //   }
    //   // if size is even, treat x,y as bottom-right of center
    //   else if (size % 2 === 0) {
    //     const r = size / 2;
    //     plotFilledCircle((x, y) => this.drawPixel(tex, x, y), x, y, r);
    //   }
    //   // if size is not even, treat x,y as center
    //   else {
    //     const r = Math.floor(size / 2);
    //     plotFilledCircle((x, y) => this.drawPixel(tex, x, y), x, y, r);
    //   }
    // }
    else if (tip === PenTip.Square) {
      // if size is even, treat x,y as bottom-right of center
      if (size % 2 === 0) {
        const r = size / 2;
        plotFilledRectangle((x, y) => this.drawPixel(tex, x, y), x - r, y - r, x + (r - 1), y + (r - 1));
      }
      // if size is not even, treat x,y as center
      else {
        const r = Math.floor(size / 2);
        plotFilledRectangle((x, y) => this.drawPixel(tex, x, y), x - r, y - r, x + r, y + r);
      }
    }
  }

  drawLine(tex: Texture, x0: number, y0: number, x1: number, y1: number) {
    plotLine((x, y) => this.drawPoint(tex, x, y), x0, y0, x1, y1);
  }

  drawRectangle(tex: Texture, x0: number, y0: number, x1: number, y1: number, filled=false) {
    plotRectangle((x, y) => this.drawPoint(tex, x, y), x0, y0, x1, y1);
    if (filled)
      plotFilledRectangle((x, y) => this.drawPixel(tex, x, y), x0, y0, x1, y1);
  }

  drawCircle(tex: Texture, x0: number, y0: number, radius: number, filled=false) {
    plotCircle((x, y) => this.drawPoint(tex, x, y), x0, y0, radius);
    if (filled)
      plotFilledCircle((x, y) => this.drawPixel(tex, x, y), x0, y0, radius);
  }

}