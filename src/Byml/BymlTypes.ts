export const enum BymlType {
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

export interface BymlString extends BymlNodeBase<BymlType.String> {
  value: string;
};

export interface BymlBinary extends BymlNodeBase<BymlType.Binary>  {
  value: Uint8Array;
};

export interface BymlArray extends BymlNodeBase<BymlType.Array>  {
  childNodes: BymlNode[];
};

export type BymlHashMap = Map<string, BymlNode>;

export interface BymlHash extends BymlNodeBase<BymlType.Hash> {
  hashMap: BymlHashMap;
};

export interface BymlBool extends BymlNodeBase<BymlType.Bool> {
  value: boolean;
};

export interface BymlInt extends BymlNodeBase<BymlType.Int> {
  value: number;
};

export interface BymlFloat extends BymlNodeBase<BymlType.Float> {
  value: number;
};

export interface BymlUint extends BymlNodeBase<BymlType.Uint> {
  value: number;
};

export interface BymlInt64 extends BymlNodeBase<BymlType.Int64> {
  value: bigint;
};

export interface BymlUint64 extends BymlNodeBase<BymlType.Uint64> {
  value: bigint;
};

export interface BymlDouble extends BymlNodeBase<BymlType.Double> {
  value: number;
};

export interface BymlTypeMap {
  [BymlType.String]: BymlString;
  [BymlType.Binary]: BymlBinary;
  [BymlType.Array]: BymlArray;
  [BymlType.Hash]: BymlHash;
  [BymlType.Bool]: BymlBool;
  [BymlType.Int]: BymlInt;
  [BymlType.Float]: BymlFloat;
  [BymlType.Uint]: BymlUint;
  [BymlType.Int64]: BymlInt64;
  [BymlType.Uint64]: BymlUint64;
  [BymlType.Double]: BymlDouble;
};

export type BymlNode = BymlString
 | BymlBinary
 | BymlArray
 | BymlHash
 | BymlBool
 | BymlInt
 | BymlFloat
 | BymlUint
 | BymlInt64
 | BymlUint64
 | BymlDouble
 | null;

