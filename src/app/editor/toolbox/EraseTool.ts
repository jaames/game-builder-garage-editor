import { PenTool } from './PenTool';
import { ToolType } from './ToolTypes';


export class EraseTool extends PenTool {

  static type = ToolType.Eraser;

  name = 'Eraser';

  getColor() {
    return 0;
  }

}