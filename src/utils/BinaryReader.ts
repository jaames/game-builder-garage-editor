export class BinaryReader {

  buffer: ArrayBuffer;
  le = true;
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

  readU8(ptr: number) {
    return this.data.getUint8(ptr);
  }

  readI8(ptr: number) {
    return this.data.getInt8(ptr);
  }

  readU16(ptr: number) {
    return this.data.getUint16(ptr, this.le);
  }

  readI16(ptr: number) {
    return this.data.getInt16(ptr, this.le);
  }

  readU32(ptr: number) {
    return this.data.getUint32(ptr, this.le);
  }

  readI32(ptr: number) {
    return this.data.getInt32(ptr, this.le);
  }

  readU64(ptr: number) {
    return this.data.getBigUint64(ptr, this.le);
  }

  readI64(ptr: number) {
    return this.data.getBigInt64(ptr, this.le);
  }

  readF32(ptr: number) {
    return this.data.getFloat32(ptr, this.le);
  }

  readF64(ptr: number) {
    return this.data.getFloat64(ptr, this.le);
  }

  readBytes(ptr: number, count: number) {
    return new Uint8Array(this.data.buffer, ptr, count);
  }

  readHex(ptr: number, count: number, reverse: boolean=false) {
    const bytes = this.readBytes(ptr, count);
    let hex = [];
    for (let i = 0; i < bytes.length; i++) {
      hex.push(bytes[i].toString(16).padStart(2, '0'));
    }
    if (reverse)
      hex.reverse();
    return hex.join('').toUpperCase();
  }

  readChars(ptr: number, count: number) {
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

  readUtf8(ptr: number): string {
    let result = '';
    while (true) {
      let char = 0;
      let byte = this.readU8(ptr);
      // Break string on null bytes
      if (byte === 0)
        break;
      // Single byte char
      else if (byte < 0x80) {
        char = byte;
        ptr += 1;
      }
      // Two byte char
      else if ((byte & 0xe0) == 0xc0) {
        char = ((byte & 0x1f) << 6) | 
               ((this.readU8(ptr + 1) & 0x3f) <<  0);
        ptr += 2;
      } 
      // Three byte char
      else if ((byte & 0xf0) == 0xe0) {
        char = ((byte & 0x0f) << 12) |
               ((this.readU8(ptr + 1) & 0x3f) <<  6) |
               ((this.readU8(ptr + 2) & 0x3f) <<  0);
        ptr += 3;
      } 
      // Four byte char
      else if ((byte & 0xf8) == 0xf0 && (byte <= 0xf4)) {
        char = ((byte & 0x07) << 18) |
               ((this.readU8(ptr + 1) & 0x3f) << 12) |
               ((this.readU8(ptr + 2) & 0x3f) <<  6) |
               ((this.readU8(ptr + 3) & 0x3f) <<  0);
        ptr += 4;
      } 
      // Byte is invalid; skip it
      else {
        ptr += 1;
        continue;
      }
      result += String.fromCharCode(char);
    }
    return result;
  }

  readWideChars(ptr: number, count: number) {
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