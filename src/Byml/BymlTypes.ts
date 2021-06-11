export const enum BymlNodeType {
  String = 0xa0,
  Binary = 0xa1,
  Array = 0xc0,
  Hash = 0xc1,
  StringTable = 0xc2, // only used internally for string + hash lists
  Bool = 0xd0,
  Int = 0xd1,
  Float = 0xd2,
  Uint = 0xd3,
  Int64 = 0xd4,
  Uint64 = 0xd5,
  Double = 0xd6,
  Null = 0xff
};

interface BymlNodeBase {
  type: BymlNodeType;
};

export interface BymlStringNode extends BymlNodeBase {
  type: BymlNodeType.String;
  value: string;
};

export interface BymlBinaryNode extends BymlNodeBase {
  type: BymlNodeType.Binary;
  value: Uint8Array;
};

export interface BymlArrayNode extends BymlNodeBase {
  type: BymlNodeType.Array;
  childNodes: BymlNode[];
};

export interface BymlHashNode extends BymlNodeBase {
  type: BymlNodeType.Hash;
  nodeMap: Map<string, BymlNode>;
};

export interface BymlBoolNode extends BymlNodeBase {
  type: BymlNodeType.Bool;
  value: boolean;
};

export interface BymlIntNode extends BymlNodeBase {
  type: BymlNodeType.Int;
  value: number;
};

export interface BymlFloatNode extends BymlNodeBase {
  type: BymlNodeType.Float;
  value: number;
};

export interface BymlUintNode extends BymlNodeBase {
  type: BymlNodeType.Uint;
  value: number;
};

export interface BymlInt64Node extends BymlNodeBase {
  type: BymlNodeType.Int64;
  value: bigint;
};

export interface BymlUint64Node extends BymlNodeBase {
  type: BymlNodeType.Uint64;
  value: bigint;
};

export interface BymlDoubleNode extends BymlNodeBase {
  type: BymlNodeType.Double;
  value: number;
};

export type BymlNode = BymlStringNode
 | BymlBinaryNode
 | BymlArrayNode
 | BymlHashNode
 | BymlBoolNode
 | BymlIntNode
 | BymlFloatNode
 | BymlUintNode
 | BymlInt64Node
 | BymlUint64Node
 | BymlDoubleNode
 | null;

