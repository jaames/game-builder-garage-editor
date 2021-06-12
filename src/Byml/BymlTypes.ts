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

export interface BymlNodeBase<T> {
  type: T;
};

export interface BymlStringNode extends BymlNodeBase<BymlNodeType.String> {
  value: string;
};

export interface BymlBinaryNode extends BymlNodeBase<BymlNodeType.Binary>  {
  value: Uint8Array;
};

export interface BymlArrayNode extends BymlNodeBase<BymlNodeType.Array>  {
  childNodes: BymlNode[];
};

export type BymlNodeHash = Map<string, BymlNode>;

export interface BymlHashNode extends BymlNodeBase<BymlNodeType.Hash> {
  nodeMap: BymlNodeHash;
};

export interface BymlBoolNode extends BymlNodeBase<BymlNodeType.Bool> {
  value: boolean;
};

export interface BymlIntNode extends BymlNodeBase<BymlNodeType.Int> {
  value: number;
};

export interface BymlFloatNode extends BymlNodeBase<BymlNodeType.Float> {
  value: number;
};

export interface BymlUintNode extends BymlNodeBase<BymlNodeType.Uint> {
  value: number;
};

export interface BymlInt64Node extends BymlNodeBase<BymlNodeType.Int64> {
  value: bigint;
};

export interface BymlUint64Node extends BymlNodeBase<BymlNodeType.Uint64> {
  value: bigint;
};

export interface BymlDoubleNode extends BymlNodeBase<BymlNodeType.Double> {
  value: number;
};

export interface BymlNodeTypeMap {
  [BymlNodeType.String]: BymlStringNode;
  [BymlNodeType.Binary]: BymlBinaryNode;
  [BymlNodeType.Array]: BymlArrayNode;
  [BymlNodeType.Hash]: BymlHashNode;
  [BymlNodeType.Bool]: BymlBoolNode;
  [BymlNodeType.Int]: BymlIntNode;
  [BymlNodeType.Float]: BymlFloatNode;
  [BymlNodeType.Int64]: BymlInt64Node;
  [BymlNodeType.Uint64]: BymlUint64Node;
  [BymlNodeType.Double]: BymlDoubleNode;
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

