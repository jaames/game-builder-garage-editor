// Nintendo BYML file parser
// Ported from the excellent https://github.com/zeldamods/byml-v2

import {
  ParserBase,
  assert,
  align
} from '../utils';

import {
  BymlNode,
  BymlNodeType,
  BymlNodeTypeMap,
  BymlStringNode,
  BymlBinaryNode,
  BymlArrayNode,
  BymlHashNode,
  BymlBoolNode,
  BymlIntNode,
  BymlFloatNode,
  BymlUintNode,
  BymlInt64Node,
  BymlUint64Node,
  BymlDoubleNode,
} from './BymlTypes';

export class BymlParser extends ParserBase {

  public rootNode: BymlNode = null;

  private hashKeyTable: string[] = [];
  private stringTable: string[] = [];

  constructor(buffer: ArrayBuffer) {
    super(buffer);
    this.read();
  }

  public findNode<K extends keyof BymlNodeTypeMap>(node: BymlNode, key: string | number, type: K): BymlNodeTypeMap[K] {
    let foundNode = null;
    // fail if search node isn't available
    assert(node !== null && node !== undefined, `Node cannot be searched, it doesn't exist`);
    // if search node is array type, find by numerical index
    if (node.type === BymlNodeType.Array && typeof key === 'number')
      foundNode = node.childNodes[key] ?? null;
    // if search node is hash type, find by string key
    else if (node.type === BymlNodeType.Hash && typeof key === 'string')
      foundNode = node.nodeMap.get(key) ?? null;
    // fail if node not found
    assert(foundNode !== null, `Could not find node with key ${ key }`);
    // fail if node typee doesn't match
    assert(foundNode.type === type);
    // we can be pretty sure that the found node matcchs the required type now
    return foundNode as BymlNodeTypeMap[K];
  }

  public read() {
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

  private readNode(nodeType: BymlNodeType, ptr: number): BymlNode {
    switch (nodeType) {
      case BymlNodeType.String:
        return this.readStringNode(this.readU32(ptr));
      case BymlNodeType.Binary:
        return this.readBinaryNode(this.readU32(ptr));
      case BymlNodeType.Array:
        return this.readArrayNode(this.readU32(ptr));
      case BymlNodeType.Hash:
        return this.readHashNode(this.readU32(ptr));
      case BymlNodeType.Bool:
        return this.readBoolNode(ptr);
      case BymlNodeType.Int:
        return this.readIntNode(ptr);
      case BymlNodeType.Float:
        return this.readFloatNode(ptr);
      case BymlNodeType.Uint:
        return this.readUintNode(ptr);
      case BymlNodeType.Int64:
        return this.readInt64Node(ptr);
      case BymlNodeType.Uint64:
        return this.readUint64Node(ptr);
      case BymlNodeType.Double:
        return this.readDoubleNode(ptr);
      case BymlNodeType.Null:
        return null;
    }
    throw `Unknown node type ${ nodeType } @${ ptr }`;
  }

  private readStringNode(i: number): BymlStringNode {
    return {
      type: BymlNodeType.String,
      value: this.stringTable[i]
    };
  }

  private readBinaryNode(ptr: number): BymlBinaryNode {
    const size = this.readU32(ptr);
    return {
      type: BymlNodeType.Binary,
      value: this.readBytes(ptr + 4, size)
    };
  }

  private readArrayNode(ptr: number): BymlArrayNode {
    const size = this.readU24(ptr + 1);
    const childNodes = new Array<BymlNode>(size);
    const childPtr = ptr + align(size, 4) + 4;
    for (let i = 0; i < size; i++) {
      const nodeType = this.readNodeType(ptr + 4 + i);
      childNodes[i] = this.readNode(nodeType, childPtr + 4 * i);
    }
    return {
      type: BymlNodeType.Array,
      childNodes: childNodes,
    };
  }

  private readHashNode(ptr: number): BymlHashNode {
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
      type: BymlNodeType.Hash,
      nodeMap: result,
    };
  }

  private readBoolNode(ptr: number): BymlBoolNode {
    return {
      type: BymlNodeType.Bool,
      value: this.readU32(ptr) !== 0
    }
  }

  private readIntNode(ptr: number): BymlIntNode {
    return {
      type: BymlNodeType.Int,
      value: this.readI32(ptr),
    }
  }

  private readFloatNode(ptr: number): BymlFloatNode {
    return {
      type: BymlNodeType.Float,
      value: this.readF32(ptr),
    }
  }

  private readUintNode(ptr: number): BymlUintNode {
    return {
      type: BymlNodeType.Uint,
      value: this.readU32(ptr),
    }
  }

  private readInt64Node(ptr: number): BymlInt64Node {
    return {
      type: BymlNodeType.Int64,
      value: this.readI64(ptr),
    }
  }

  private readUint64Node(ptr: number): BymlUint64Node {
    return {
      type: BymlNodeType.Uint64,
      value: this.readU64(ptr)
    }
  }

  private readDoubleNode(ptr: number): BymlDoubleNode {
    return {
      type: BymlNodeType.Double,
      value: this.readF64(ptr)
    }
  }

  // TODO: strings are likely actually utf-8 or something
  private readStringTable(ptr: number) {
    const type = this.readU8(ptr);
    assert(type === BymlNodeType.StringTable, `Expected string table node, got typr ${ type }`);
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

  private readNodeType(ptr: number): BymlNodeType {
    const type = this.readU8(ptr);
    switch (type) {
      case 0xa0: return BymlNodeType.String;
      case 0xa1: return BymlNodeType.Binary;
      case 0xc0: return BymlNodeType.Array;
      case 0xc1: return BymlNodeType.Hash;
      case 0xc2: return BymlNodeType.StringTable;
      case 0xd0: return BymlNodeType.Bool;
      case 0xd1: return BymlNodeType.Int;
      case 0xd2: return BymlNodeType.Float;
      case 0xd3: return BymlNodeType.Uint;
      case 0xd4: return BymlNodeType.Int64;
      case 0xd5: return BymlNodeType.Uint64;
      case 0xd6: return BymlNodeType.Double;
      case 0xff: return BymlNodeType.Null;
    }
    throw `Uknown type ${ type } @${ ptr }`;
  }

}