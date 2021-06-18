import { PenTool } from './PenTool';

export class EraseTool extends PenTool {

  name = 'Eraser';

  public getColor() {
    return 0;
  }

}