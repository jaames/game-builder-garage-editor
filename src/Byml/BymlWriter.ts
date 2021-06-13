/**
 * Game Builder Garage seems to use an unoptimised byml format where the file size is always consistent given the same structure
 * This exporter doesn't match the GBG exporter perfectly, in a couple of areas:
 * - GBG writes special node types (Binary, Uint64, Int64, Double) before all the other nodes
 * - I'm guessing GBG also sorts nodes by the original node key, which isn't possible since we only have a hask of the key here
 * But since it's a tree structure, this shouldn't matter too much?
 */

import {
  BymlNode,
  BymlType,
} from './BymlTypes';

import {
  BinaryWriter,
  align,
  stringCompareChr
} from '../utils';


import { 
  BymlReader
 }  from './BymlReader';

class PtrPlaceholder {

  public ptr = 0;
  public writer: BinaryWriter;

  constructor(writer: BinaryWriter) {
    this.writer = writer;
    this.ptr = writer.realPtr;
  }

  writePlaceholder() {
    this.writer.writeU32(0xffffffff);
  }

  writePtr(ptr: number, base: number = 0) {
    const currPtr = this.writer.realPtr;
    this.writer.setPointer(this.ptr);
    this.writer.writeU32(ptr - base);
    this.writer.setPointer(currPtr);
  }

  writeCurrentPtr(base: number = 0) {
    this.writePtr(this.writer.realPtr, base);
  }

}

export class BymlWriter extends BinaryWriter {

  public rootNode: BymlNode;

  private hashKeyTable: string[] = [];
  private stringTable: string[] = [];

  constructor(rootNode: BymlNode) {
    super();
    this.rootNode = rootNode;
    const hashKeys = new Set<string>();
    const strings = new Set<string>();
    this.getStringsForNode(this.rootNode, hashKeys, strings);
    this.hashKeyTable = [...hashKeys].sort(stringCompareChr);
    this.stringTable = [...strings].sort(stringCompareChr);
    this.write();
  }

  write() {
    this.writeChars('YB') // little endian
    this.writeU16(4); // version
    // placeholders for hash key ptr, string table ptr, root node ptr
    const hashKeyTablePtr = this.writePtrPlaceholder();
    const stringTablePtr = this.writePtrPlaceholder();
    const rootNodePtr = this.writePtrPlaceholder();
    // write hash key table
    hashKeyTablePtr.writeCurrentPtr();
    this.writeStringTable(this.hashKeyTable);
    this.writeAlignBytesTo(4);

    stringTablePtr.writeCurrentPtr();
    this.writeStringTable(this.stringTable);
    this.writeAlignBytesTo(4);

    rootNodePtr.writeCurrentPtr();
    this.writeNode(this.rootNode);
    this.writeAlignBytesTo(4);

    this.saveAs('finaltest.bin');

    const game = new BymlReader(this.getArrayBuffer());
  }

  getStringsForNode(node: BymlNode, hashKeys: Set<string>, strings: Set<string>) {
    if (node.type === BymlType.Hash) {
      node.hashMap.forEach((subNode, key) => {
        if (!hashKeys.has(key))
          hashKeys.add(key);
        this.getStringsForNode(subNode, hashKeys, strings);
      });
    }
    else if (node.type === BymlType.Array) {
      node.children.forEach((subNode) => {
        this.getStringsForNode(subNode, hashKeys, strings);
      });
    }
    else if (node.type === BymlType.String) {
      if (!strings.has(node.value))
        strings.add(node.value);
    }
  }

  writeStringTable(table: string[]) {
    const base = this.realPtr;
    const size = table.length;
    const ptrs: PtrPlaceholder[] = [];
    this.writeU8(BymlType.StringTable);
    this.writeU24(table.length);
    for (let i = 0; i < size; i++) {
      ptrs.push(this.writePtrPlaceholder()) // placeholder offset for string
    }
    const lastOffsetPtr = this.writePtrPlaceholder();
    for (let i = 0; i < size; i++) {
      const ptr = ptrs[i];
      ptr.writeCurrentPtr(base);
      // TODO: should be utf8
      this.writeChars(table[i]);
      this.writeByte(0);
    }
    lastOffsetPtr.writeCurrentPtr(base);
  }

  writeNode(node: BymlNode) {
    const nonValueNodeMap = new Map<BymlNode, PtrPlaceholder>();
    if (node.type === BymlType.Array) {
      const children = node.children;
      // write node header (u8 type + u24 number of subnodes)
      this.writeU8(BymlType.Array);
      this.writeU24(node.children.length);
      // write type for each child node
      children.forEach(subNode => {
        this.writeU8(subNode.type);
      });
      // pad bytes
      this.writeAlignBytesTo(4);
      children.forEach(subNode => {
        // For regular value nodes, this is the 4 byte node value
        if (this.isValueNode(subNode))
          this.writeValueNode(subNode);
        // For other nodes, this is a 4 byte offset to the node relative to the start of the file
        else
          nonValueNodeMap.set(subNode, this.writePtrPlaceholder());
      });
    }
    else if (node.type === BymlType.Hash) {
      const hashKeys = [...node.hashMap.keys()].sort(stringCompareChr);
      // write node header (u8 type + u24 number of subnodes)
      this.writeU8(BymlType.Hash);
      this.writeU24(node.hashMap.size);
      // write hash entries
      hashKeys.forEach((key) => {
        const subNode = node.hashMap.get(key);
        this.writeU24(this.hashKeyTable.indexOf(key));
        this.writeU8(subNode.type);
        // For regular value nodes, this is the 4 byte node value
        if (this.isValueNode(subNode))
          this.writeValueNode(subNode);
        // For other nodes, this is a 4 byte offset to the node relative to the start of the file
        else
          nonValueNodeMap.set(subNode, this.writePtrPlaceholder());
      });
    }
    else if (node.type === BymlType.Binary) {
      const bytes = node.value;
      this.writeU32(bytes.length);
      for (let i = 0; i < bytes.length; i++) {
        this.writeByte(bytes[i]);
      }
    }
    else if (node.type === BymlType.Int64) {
      this.writeI64(node.value);
    }
    else if (node.type === BymlType.Uint64) {
      this.writeU64(node.value);
    }
    else if (node.type === BymlType.Double) {
      this.writeF64(node.value);
    }
    
    nonValueNodeMap.forEach((ptr, subNode) => {
      ptr.writeCurrentPtr();
      this.writeNode(subNode);
    });
    nonValueNodeMap.clear();
  }

  isValueNode(node: BymlNode) {
    return (
      node.type === BymlType.String ||
      node.type === BymlType.Bool ||
      node.type === BymlType.Int ||
      node.type === BymlType.Float ||
      node.type === BymlType.Uint ||
      node === null
    );
  }

  writeValueNode(node: BymlNode) {
    if (node.type === BymlType.String)
      this.writeU32(this.stringTable.indexOf(node.value));
    else if (node.type === BymlType.Bool)
      this.writeU32(node.value ? 1 : 0);
    else if (node.type === BymlType.Int)
      this.writeI32(node.value);
    else if (node.type === BymlType.Uint)
      this.writeU32(node.value);
    else if (node.type === BymlType.Float)
      this.writeF32(node.value);
    else if (node === null)
      this.writeU32(0);
  }

  isContainerNode(node: BymlNode) {
    return (
      node.type === BymlType.Hash ||
      node.type === BymlType.Array
    );
  }

  writePtrPlaceholder() {
    const p = new PtrPlaceholder(this);
    p.writePlaceholder();
    return p;
  }

  writeU24(value: number) {
    this.writeByte(value & 0xFF);
    this.writeByte((value >> 8) & 0xFF);
    this.writeByte((value >> 16) & 0xFF);
  }

  writeAlignBytesTo(padSize = 4) {
    const ptr = this.realPtr;
    const padded = align(ptr, padSize);
    const padding = padded - ptr;
    if (padding > 0) {
      for (let i = 0; i < padding; i++) {
        this.writeByte(0);
      }
    }
  }

}