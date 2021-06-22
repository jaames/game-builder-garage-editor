import { Document, Scalar, YAMLMap, YAMLSeq } from 'yaml';
import { BymlNode, BymlType } from '../formats/Byml';

export function bymlTreeToYaml(node: BymlNode, keyEnum: object) {
  const keyMap = Object.fromEntries(Object.entries(keyEnum).map(([key, value]) => [value, key]));
  const doc = new Document(bymlNodeToYaml(node, keyMap));
  return doc.toString({
    lineWidth: 100
  });
}

function bymlNodeToYaml(node: BymlNode, keyMap: Record<string, string>): any {
  if (node.type === BymlType.Hash) {
    const map = new YAMLMap();
    [...node.hashMap.entries()].forEach(([key, subNode]) => {
      map.set(keyMap[key] || key, bymlNodeToYaml(subNode, keyMap));
    });
    return map;
  }
  else if (node.type === BymlType.Array) {
    const seq = new YAMLSeq();
    let flow = true;
    node.children.forEach(subNode => {
      const child = bymlNodeToYaml(subNode, keyMap);
      if (child instanceof YAMLMap || child instanceof YAMLSeq)
        flow = false;
      seq.add(child);
    });
    seq.flow = flow;
    return seq;
  }
  else if (node.type == BymlType.Binary) {
    const buff = Buffer.from(node.value);
    const scalar = new Scalar(buff.toString('base64'));
    scalar.tag = '!!binary';
    return scalar;
  }
  else if (node.type === BymlType.Uint) {
    const scalar = new Scalar(node.value);
    scalar.tag = '!u';
    return scalar;
  }
  else if (node.type === BymlType.Uint64) {
    const scalar = new Scalar(node.value);
    scalar.tag = '!ul';
    return scalar;
  }
  else if (node.type === BymlType.Int64) {
    const scalar = new Scalar(node.value);
    scalar.tag = '!l';
    return scalar;
  }
  else if (node.type === BymlType.Double) {
    const scalar = new Scalar(node.value);
    scalar.tag = '!f';
    return scalar;
  }
  else {
    return node.value;
  }
}