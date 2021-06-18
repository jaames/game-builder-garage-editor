import { TextureEditor, ToolState } from '../TextureEditor';

export enum PenTip {
  Square,
  Round,
};

export enum PenMode {
  Free,
  Line,
  Rect,
  FilledRect,
  Circle,
  FilledCircle
};

export abstract class ToolBase {

  public abstract name: string
  public abstract cursor: string;

  public useDrawingCoordSpace: boolean;
  public editor: TextureEditor;
  public state: ToolState;

  constructor(editor: TextureEditor) {
    this.editor = editor;
    this.state = editor.toolState;
    this.useDrawingCoordSpace = true;
  }

  public abstract move(x: number, y: number): void;

  public abstract end(x: number, y: number): void;

  public abstract start(x: number, y: number): void;

}