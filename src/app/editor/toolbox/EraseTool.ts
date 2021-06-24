import { PenTool } from './PenTool';

export class EraseTool extends PenTool {

  name = 'Eraser';

  getColor() {
    return 0;
  }

}