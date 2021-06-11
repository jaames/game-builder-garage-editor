export class ParserBase {

  public buffer: ArrayBuffer;
  public le = true;
  private data: DataView;

  constructor(arrayBuffer: ArrayBuffer) {
    this.buffer = arrayBuffer;
    this.data = new DataView(arrayBuffer);
  }

  get bytes() {
    return new Uint8Array(this.buffer);
  }

  get byteLength() {
    return this.data.byteLength;
  }

  public readU8(ptr: number) {
    return this.data.getUint8(ptr);
  }

  public writeU8(ptr: number, value: number) {
    this.data.setUint8(ptr, value);
  }

  public readI8(ptr: number) {
    return this.data.getInt8(ptr);
  }

  public writeI8(ptr: number, value: number) {
    this.data.setInt8(ptr, value);
  }

  public readU16(ptr: number) {
    return this.data.getUint16(ptr, this.le);
  }

  public writeU16(ptr: number, value: number) {
    this.data.setUint16(ptr, value, this.le);
  }

  public readI16(ptr: number) {
    return this.data.getInt16(ptr, this.le);
  }

  public writeI16(ptr: number, value: number) {
    this.data.setInt16(ptr, value, this.le);
  }

  public readU32(ptr: number) {
    return this.data.getUint32(ptr, this.le);
  }
  
  public writeU32(ptr: number, value: number) {
    return this.data.setUint32(ptr, value, this.le);
  }

  public readI32(ptr: number) {
    return this.data.getInt32(ptr, this.le);
  }

  public writeI32(ptr: number, value: number) {
    this.data.setInt32(ptr, value, this.le);
  }

  public readU64(ptr: number) {
    return this.data.getBigUint64(ptr, this.le);
  }
  
  public writeU64(ptr: number, value: bigint) {
    return this.data.setBigUint64(ptr, value, this.le);
  }

  public readI64(ptr: number) {
    return this.data.getBigInt64(ptr, this.le);
  }
  
  public writeI64(ptr: number, value: bigint) {
    return this.data.setBigInt64(ptr, value, this.le);
  }

  public readF32(ptr: number) {
    return this.data.getFloat32(ptr);
  }

  public writeF32(ptr: number, value: number) {
    this.data.setFloat32(ptr, value);
  }

  public readF64(ptr: number) {
    return this.data.getFloat64(ptr);
  }

  public writeF64(ptr: number, value: number) {
    this.data.setFloat64(ptr, value);
  }

  public readBytes(ptr: number, count: number) {
    return new Uint8Array(this.data.buffer, ptr, count);
  }

  public writeBytes(ptr: number, bytes: number[] | Uint8Array) {
    bytes.forEach((byte: number, i: number) => this.writeU8(ptr + i, byte));
  }

  public readHex(ptr: number, count: number, reverse: boolean=false) {
    const bytes = this.readBytes(ptr, count);
    let hex = [];
    for (let i = 0; i < bytes.length; i++) {
      hex.push(bytes[i].toString(16).padStart(2, '0'));
    }
    if (reverse)
      hex.reverse();
    return hex.join('').toUpperCase();
  }

  public readChars(ptr: number, count: number) {
    const chars = this.readBytes(ptr, count);
    let str = '';
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      if (char === 0)
        break;
      str += String.fromCharCode(char);
    }
    return str;
  }

  public writeChars(ptr: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i);
      this.writeU8(ptr, char);
    }
  }

  public readWideChars(ptr: number, count: number) {
    const chars = new Uint16Array(this.data.buffer, ptr, count);
    let str = '';
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      if (char == 0)
        break;
      str += String.fromCharCode(char);
    }
    ptr += chars.byteLength;
    return str;
  }
}