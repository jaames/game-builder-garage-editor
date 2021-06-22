import { BymlNode, BymlType, BymlTypeMap } from './BymlTypes';
import { assert } from '../../utils';

export function getNode<K extends keyof BymlTypeMap>(node: BymlNode, key: string | number, type: K): BymlTypeMap[K] {
  let foundNode = null;
  // fail if search node isn't available
  assert(node !== null && node !== undefined, `Node cannot be searched, it doesn't exist`);
  // if search node is array type, find by numerical index
  if (node.type === BymlType.Array && typeof key === 'number')
    foundNode = node.children[key] ?? null;
  // if search node is hash type, find by string key
  else if (node.type === BymlType.Hash && typeof key === 'string')
    foundNode = node.hashMap.get(key) ?? null;
  // fail if node not found
  assert(foundNode !== null, `Could not find node with key ${ key }`);
  // fail if node type doesn't match
  assert(foundNode.type === type, `Node type does not match ${ type }`);
  // we can be pretty sure that the found node matches the required type now
  return foundNode as BymlTypeMap[K];
}

export function hasNode(node: BymlNode, key: string | number): boolean {
  if (node.type === BymlType.Array && typeof key === 'number')
    return typeof node.children[key] !== undefined;
  else if (node.type === BymlType.Hash && typeof key === 'string')
    return node.hashMap.has(key);
  return false;
}