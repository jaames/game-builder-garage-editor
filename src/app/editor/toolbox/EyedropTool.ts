import { ToolBase, ToolType } from './ToolTypes';

import { useTextureCtx } from '../../store/textureCtx';

export class EyedropTool extends ToolBase {

  static type = ToolType.EyeDrop;

  name = 'Color Picker';
  cursor = 'crosshair';
  useDrawingCoordSpace = true;

  start(x: number, y: number) {
    const color = this.editor.texture.getPixel(x, y);
    useTextureCtx.setState({ toolColor: color });
  }

  move() {}

  end() {}
}