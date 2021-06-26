import { TextureEditor } from '../TextureEditor';

export enum ToolType {
  Pen,
  Eraser,
  Grabber,
  EyeDrop,
  Fill
};

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

  static type: ToolType;

  abstract name: string
  abstract cursor: string;

  useDrawingCoordSpace: boolean;
  editor: TextureEditor;

  constructor(editor: TextureEditor) {
    this.editor = editor;
    this.useDrawingCoordSpace = true;
  }

  abstract move(x: number, y: number): void;

  abstract end(x: number, y: number): void;

  abstract start(x: number, y: number): void;

}