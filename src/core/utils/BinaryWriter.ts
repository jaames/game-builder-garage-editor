import { downloadFile } from './downloadFile';

export class BinaryWriter {
  // sizes
  public pageSize = 2048;
  public allocSize = 0; // allocated size counting all pages
  public realSize = 0; // number of bytes actually used
  // pages
  public pages: Uint8Array[] = [];
  public numPages = 0;
  // pointers
  public pageIdx = 0; // page to write to
  public pagePtr = 0; // position in page to write to
  public realPtr = 0; // position in file
  // temp buffers - for writing to file with the help of dataview
  private _tmp32 = new Uint8Array(4);
  private _tmp32View = new DataView(this._tmp32.buffer);
  private _tmp64 = new Uint8Array(8);
  private _tmp64View = new DataView(this._tmp64.buffer);

  constructor() {
    this.newPage();
  }

  set pointer(ptr: number) {
    this.setPointer(ptr);
  }

  get pointer() {
    return this.realPtr;
  }

  public newPage() {
    this.pages[this.numPages] = new Uint8Array(this.pageSize);
    this.numPages = this.pages.length;
    this.allocSize = this.numPages * this.pageSize;
  }

  public setPointer(ptr: number) {
    // allocate enough pages to include pointer
    while (ptr >= this.allocSize) {
      this.newPage();
    }
    // increase real file size if the end is reached
    if (ptr > this.realSize)
      this.realSize = ptr;
    // update ptrs
    // TODO: this is going to ge thit a lot, maybe optimise?
    this.pageIdx = Math.floor(ptr / this.pageSize);
    this.pagePtr = ptr % this.pageSize;
    this.realPtr = ptr;
  }

  public writeByte(value: number) {
    this.pages[this.pageIdx][this.pagePtr] = value;
    this.setPointer(this.realPtr + 1);
  }

  public writeChars(str: string) {
    for (let i = 0; i < str.length; i++) {
      this.writeByte(str.charCodeAt(i));
    }
  }

  public writeU8(value: number) {
    this.writeByte(value & 0xFF);
  }

  public writeU16(value: number) {
    this.writeByte((value >>> 0) & 0xFF);
    this.writeByte((value >>> 8) & 0xFF);
  }

  public writeU32(value: number) {
    this.writeByte((value >>> 0) & 0xFF);
    this.writeByte((value >>> 8) & 0xFF);
    this.writeByte((value >>> 16) & 0xFF);
    this.writeByte((value >>> 24) & 0xFF);
  }

  public writeI8(value: number) {
    this.writeByte((value >>> 0) & 0xFF);
  }

  public writeI16(value: number) {
    this.writeByte((value >>> 0) & 0xFF);
    this.writeByte((value >>> 8) & 0xFF);
  }

  public writeI32(value: number) {
    this.writeByte((value >>> 0) & 0xFF);
    this.writeByte((value >>> 8) & 0xFF);
    this.writeByte((value >>> 16) & 0xFF);
    this.writeByte((value >>> 24) & 0xFF);
  }
  
  public writeF32(value: number) {
    this._tmp32View.setFloat32(0, value, true);
    for (let i = 0; i < 4; i++) {
      this.writeByte(this._tmp32[i]);
    }
  }

  public writeU64(value: bigint) {
    this._tmp64View.setBigUint64(0, value, true);
    for (let i = 0; i < 8; i++) {
      this.writeByte(this._tmp64[i]);
    }
  }

  public writeI64(value: bigint) {
    this._tmp64View.setBigInt64(0, value, true);
    for (let i = 0; i < 8; i++) {
      this.writeByte(this._tmp64[i]);
    }
  }

  public writeF64(value: number) {
    this._tmp64View.setFloat64(0, value, true);
    for (let i = 0; i < 8; i++) {
      this.writeByte(this._tmp64[i]);
    }
  }

  public getBytes() {
    const bytes = new Uint8Array(this.realSize);
    const numPages = this.numPages;
    for (let i = 0; i < numPages; i++) {
      const page = this.pages[i];
      if (i === numPages - 1) // last page
        bytes.set(page.slice(0, this.realSize % this.pageSize), i * this.pageSize);
      else
        bytes.set(page, i * this.pageSize);
    }
    return bytes;
  }

  public getArrayBuffer() {
    const bytes = this.getBytes();
    return bytes.buffer;
  }

  // TODO: this is just for debugging
  public saveAs(filename: string, type: string = 'application/octet-stream') {
    downloadFile(this.getArrayBuffer(), filename, type);
  }

}