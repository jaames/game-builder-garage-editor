import { TextureEditor } from './TextureEditor';

export class EditorHistory {

  private editor: TextureEditor;

  private stackSize = 64;
  private stack: Uint8Array[] = [];
  private presentIndex = -1;

  constructor(editor: TextureEditor) {
    this.editor = editor;
    this.clear();
  }

  get canUndo() {
    return this.presentIndex > 0;
  }

  get canRedo() {
    return this.presentIndex < this.stack.length - 1;
  }

  public commit() {
    let stack = this.stack;
    const buffer = this.allocBuffer();
    buffer.set(this.editor.texture.pixels);
    // remove forward items
    if (this.presentIndex !== -1 && this.presentIndex < stack.length)
      stack = stack.slice(0, this.presentIndex + 1);
    // add to stack
    stack.push(buffer);
    // remove first item from stack if size is exceeded
    if (stack.length > this.stackSize)
      stack.shift();
    // update current index
    this.presentIndex = stack.length - 1;
    this.stack = stack;
  }

  public undo() {
    if (this.canUndo)
      this.setCurr(this.presentIndex - 1);
  }

  public redo() {
    if (this.canRedo)
      this.setCurr(this.presentIndex + 1);
  }

  public clear() {
    this.stack = [];
    this.presentIndex = -1;
  }

  private setCurr(idx: number) {
    const buffer = this.stack[idx];
    this.editor.texture.setPixels(buffer);
    this.editor.render();
    this.presentIndex = idx;
  }

  private allocBuffer() {
    const size = this.editor.textureWidth * this.editor.textureHeight;
    return new Uint8Array(size);
  }

}