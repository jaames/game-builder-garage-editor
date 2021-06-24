import { ToolBase } from './ToolTypes';

export class PanTool extends ToolBase {

  name = 'Pan Tool';
  cursor = 'grab';
  useDrawingCoordSpace = false;

  private isDown = false;
  private initialInputX = -1;
  private initialInputY = -1;
  private initialOriginX = -1;
  private initialOriginY = -1;

  start(x: number, y: number) {
    this.initialInputX = x;
    this.initialInputY = y;
    this.initialOriginX = this.editor.viewOriginX;
    this.initialOriginY = this.editor.viewOriginY;
    this.isDown = true;
    this.editor.setCursor('grabbing');
  }

  move(x: number, y: number) {
    if (this.isDown) {
      const dx = x - this.initialInputX;
      const dy = y - this.initialInputY;
      this.editor.setOrigin(this.initialOriginX + dx, this.initialOriginY + dy);
    }
  }

  end() {
    this.isDown = false;
    this.editor.setCursor('grab');
  }
}