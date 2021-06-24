import { ToolBase } from './ToolTypes';

export class EyedropTool extends ToolBase {

  name = 'Color Picker';
  cursor = 'crosshair';
  useDrawingCoordSpace = true;

  start(x: number, y: number) {
    const color = this.editor.texture.getPixel(x, y);
    this.editor.setToolColor(color);
  }

  move() {}

  end() {}
}