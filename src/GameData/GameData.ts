import {
  BymlParser,
  BymlNodeType,
  BymlNode,
  BymlArrayNode,
  BymlBoolNode,
  BymlHashNode,
  BymlBinaryNode,
} from '../Byml';

import { GameTexture } from './GameTexture'
import { assert } from '../utils';

/**
 * structure
 * rootNode (random key?)
 *  79823569 (int)
 *  adaf3055 (hash)
 *    aa6902d3 (hash) - data
 *      1235b61b (string) ?
 *      29a36d10 (boolean) ?
 *      2eb62a0a (array) ?
 *      39ce726f (boolean) ?
 *      4aaddc4f (array) ?
 *      4c0ff1a4 (binary) thumbnail jpeg data
 * 
 */

// TODO: come up with better names here
const KEY_SUBNODE = 'adaf3055';
const KEY_DATANODE = 'aa6902d3';

const KEY_THUMBNAIL = '4c0ff1a4';
const KEY_TEXTURELIST = 'cd9f2f3d';

const KEY_TEXTURE_PIXELS = '3c774805';
const KEY_TEXTURE_IS_USED = 'd96ea34b';

export class GameDataParser extends BymlParser {

  private contentNode: BymlHashNode | null = null;
  private dataNode: BymlHashNode | null = null;

  constructor(buffer: ArrayBuffer) {
    super(buffer);
    assert(this.rootNode !== null, 'Root node is missing');
    assert(this.rootNode.type === BymlNodeType.Hash, 'Root node must be a hash node');
    for (let childNode of this.rootNode.nodeMap.values()) {
      if (childNode !== null && childNode.type === BymlNodeType.Hash) {
        this.contentNode = childNode;
      }
    }
    const node2 = this.findNodeWithKey<BymlHashNode>(this.contentNode, KEY_SUBNODE);
    this.dataNode = this.findNodeWithKey<BymlHashNode>(node2, KEY_DATANODE);
  }

  public getThumbnailJpegData() {
    const thumbnailNode = this.findNodeWithKey(this.dataNode, KEY_THUMBNAIL);
    if (thumbnailNode !== null && thumbnailNode.type === BymlNodeType.Binary)
      return thumbnailNode.value;
    return null;
  }

  public getThumbnailJpegUrl() {
    const data = this.getThumbnailJpegData();
    const blob = new Blob([data], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  }

  public getTextureList() {
    const textureRoot = this.findNodeWithKey<BymlArrayNode>(this.dataNode, KEY_TEXTURELIST);
    return textureRoot.childNodes.map((textureNode, i) => {
      const pixelDataNode = this.findNodeWithKey<BymlBinaryNode>(textureNode, KEY_TEXTURE_PIXELS);
      const isUsedNode = this.findNodeWithKey<BymlBoolNode>(textureNode, KEY_TEXTURE_IS_USED);
      return new GameTexture(pixelDataNode.value, isUsedNode.value, i);
    });
  }

  private findNodeWithKey<T extends BymlNode>(node: BymlNode, key: string | number): T {
    let result = null;
    if (node === null || node === undefined)
      return result;
    else if (node.type === BymlNodeType.Array && typeof key === 'number')
      result = node.childNodes[key] ?? null;
    else if (node.type === BymlNodeType.Hash && typeof key === 'string')
      result = node.nodeMap.has(key) ? node.nodeMap.get(key) : null;
    return result as T;
  }

}