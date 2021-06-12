// Nintendo BYML file parser
// Ported from the excellent https://github.com/zeldamods/byml-v2

import {
  BymlNode,
  BymlType,
  BymlTypeMap,
  BymlString,
  BymlBinary,
  BymlArray,
  BymlHash,
  BymlBool,
  BymlInt,
  BymlFloat,
  BymlUint,
  BymlInt64,
  BymlUint64,
  BymlDouble,
} from './BymlTypes';

import {
  DataStream,
  assert,
  align
} from '../utils';

export class BymlReader extends DataStream {

  public rootNode: BymlNode;

  private hashKeyTable: string[];
  private stringTable: string[];

  constructor(buffer: ArrayBuffer) {
    super(buffer);
    const magic = this.readChars(0, 2);
    assert(magic === 'YB', 'Big-endian BYML not supported');
    const version = this.readU16(2);
    assert(version === 4, 'BYML version is not suppored');
    const hashKeyTablePtr = this.readU32(4);
    const stringTablePtr = this.readU32(8);
    const rootNodePtr = this.readU32(12);
    const rootNodeType = this.readNodeType(rootNodePtr);
    this.hashKeyTable = this.readStringTable(hashKeyTablePtr);
    this.stringTable = this.readStringTable(stringTablePtr);
    this.rootNode = this.readNode(rootNodeType, 12);
  }

  public findNode<K extends keyof BymlTypeMap>(node: BymlNode, key: string | number, type: K): BymlTypeMap[K] {
    let foundNode = null;
    // fail if search node isn't available
    assert(node !== null && node !== undefined, `Node cannot be searched, it doesn't exist`);
    // if search node is array type, find by numerical index
    if (node.type === BymlType.Array && typeof key === 'number')
      foundNode = node.childNodes[key] ?? null;
    // if search node is hash type, find by string key
    else if (node.type === BymlType.Hash && typeof key === 'string')
      foundNode = node.nodeMap.get(key) ?? null;
    // fail if node not found
    assert(foundNode !== null, `Could not find node with key ${ key }`);
    // fail if node typee doesn't match
    assert(foundNode.type === type);
    // we can be pretty sure that the found node matcchs the required type now
    return foundNode as BymlTypeMap[K];
  }

  private readNode(nodeType: BymlType, ptr: number): BymlNode {
    switch (nodeType) {
      case BymlType.String:
        return this.readStringNode(this.readU32(ptr));
      case BymlType.Binary:
        return this.readBinaryNode(this.readU32(ptr));
      case BymlType.Array:
        return this.readArrayNode(this.readU32(ptr));
      case BymlType.Hash:
        return this.readHashNode(this.readU32(ptr));
      case BymlType.Bool:
        return this.readBoolNode(ptr);
      case BymlType.Int:
        return this.readIntNode(ptr);
      case BymlType.Float:
        return this.readFloatNode(ptr);
      case BymlType.Uint:
        return this.readUintNode(ptr);
      case BymlType.Int64:
        return this.readInt64Node(ptr);
      case BymlType.Uint64:
        return this.readUint64Node(ptr);
      case BymlType.Double:
        return this.readDoubleNode(ptr);
      case BymlType.Null:
        return null;
    }
    throw `Unknown node type ${ nodeType } @${ ptr }`;
  }

  private readStringNode(i: number): BymlString {
    return {
      type: BymlType.String,
      value: this.stringTable[i]
    };
  }

  private readBinaryNode(ptr: number): BymlBinary {
    const size = this.readU32(ptr);
    return {
      type: BymlType.Binary,
      value: this.readBytes(ptr + 4, size)
    };
  }

  private readArrayNode(ptr: number): BymlArray {
    const size = this.readU24(ptr + 1);
    const childNodes = new Array<BymlNode>(size);
    const childPtr = ptr + align(size, 4) + 4;
    for (let i = 0; i < size; i++) {
      const nodeType = this.readNodeType(ptr + 4 + i);
      childNodes[i] = this.readNode(nodeType, childPtr + 4 * i);
    }
    return {
      type: BymlType.Array,
      childNodes: childNodes,
    };
  }

  private readHashNode(ptr: number): BymlHash {
    const size = this.readU24(ptr + 1);
    const result = new Map<string, BymlNode>();
    for (let i = 0; i < size; i++) {
      const entryPtr = ptr + 4 + 8 * i;
      const index = this.readU24(entryPtr);
      const name = this.hashKeyTable[index];
      const nodeType = this.readNodeType(entryPtr + 3);
      result.set(name, this.readNode(nodeType, entryPtr + 4));
    }
    return {
      type: BymlType.Hash,
      nodeMap: result,
    };
  }

  private readBoolNode(ptr: number): BymlBool {
    return {
      type: BymlType.Bool,
      value: this.readU32(ptr) !== 0
    }
  }

  private readIntNode(ptr: number): BymlInt {
    return {
      type: BymlType.Int,
      value: this.readI32(ptr),
    }
  }

  private readFloatNode(ptr: number): BymlFloat {
    return {
      type: BymlType.Float,
      value: this.readF32(ptr),
    }
  }

  private readUintNode(ptr: number): BymlUint {
    return {
      type: BymlType.Uint,
      value: this.readU32(ptr),
    }
  }

  private readInt64Node(ptr: number): BymlInt64 {
    return {
      type: BymlType.Int64,
      value: this.readI64(ptr),
    }
  }

  private readUint64Node(ptr: number): BymlUint64 {
    return {
      type: BymlType.Uint64,
      value: this.readU64(ptr)
    }
  }

  private readDoubleNode(ptr: number): BymlDouble {
    return {
      type: BymlType.Double,
      value: this.readF64(ptr)
    }
  }

  // TODO: strings are likely actually utf-8 or something
  private readStringTable(ptr: number) {
    const type = this.readU8(ptr);
    assert(type === BymlType.StringTable, `Expected string table node, got typr ${ type }`);
    const size = this.readU24(ptr + 1);
    const stringList = new Array<string>(size);
    for (let i = 0; i < size; i++) {
      const stringPtr = ptr + this.readU32(ptr + 4 + 4 * i);
      stringList[i] = this.readString(stringPtr);
    }
    return stringList;
  }

  private readString(ptr: number) {
    let result = '';
    while (true) {
      const byte = this.readU8(ptr);
      if (byte === 0) break;
      ptr += 1;
      result += String.fromCharCode(byte);
    }
    return result;
  }

  private readU24(ptr: number) {
    const bytes = this.readBytes(ptr, 3);
    return (bytes[2] << 16) | (bytes[1] << 8) | (bytes[0]);
  }

  private readNodeType(ptr: number): BymlType {
    const type = this.readU8(ptr);
    switch (type) {
      case 0xa0: return BymlType.String;
      case 0xa1: return BymlType.Binary;
      case 0xc0: return BymlType.Array;
      case 0xc1: return BymlType.Hash;
      case 0xc2: return BymlType.StringTable;
      case 0xd0: return BymlType.Bool;
      case 0xd1: return BymlType.Int;
      case 0xd2: return BymlType.Float;
      case 0xd3: return BymlType.Uint;
      case 0xd4: return BymlType.Int64;
      case 0xd5: return BymlType.Uint64;
      case 0xd6: return BymlType.Double;
      case 0xff: return BymlType.Null;
    }
    throw `Uknown type ${ type } @${ ptr }`;
  }

}