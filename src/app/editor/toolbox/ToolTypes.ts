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

  abstract name: string
  abstract cursor: string;

  useDrawingCoordSpace: boolean;
  editor: TextureEditor;
  state: ToolState;

  constructor(editor: TextureEditor) {
    this.editor = editor;
    this.state = editor.toolState;
    this.useDrawingCoordSpace = true;
  }

  abstract move(x: number, y: number): void;

  abstract end(x: number, y: number): void;

  abstract start(x: number, y: number): void;

}