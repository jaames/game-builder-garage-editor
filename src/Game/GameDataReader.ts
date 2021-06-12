import {
  BymlReader,
  BymlType,
  BymlHash,
} from '../Byml';

import { GameTexture } from './GameTexture'
import { GameMeta } from './GameMeta';
import { Key } from './GameBymlKeys';

import { assert } from '../utils';

/**
 * node structure
 * rootNode (hash)
 *  79823569 (int) - unknown, always seen as 1, maybe format version?
 *  adaf3055 (hash) - game node
 *    aa6902d3 (hash) - data node
 *      6404e56c (string) - game title
 *      62f3087b (string) - game id
 *      da75c3df (string) - game locale (eg en-GB)
 *      1235b61b (string) - game online id
 *      e4d0371 (string) - programmer name (online only?)
 *      e2783c35 (string) - programmer id
 *      4c0ff1a4 (binary) - thumbnail jpeg data
 *      62661e51 (array) - list of game ids? is this the edit chain?
 *      6efa44f5 (hash) - texture editor palette possibly
 *      cd9f2f3d (array) - texture list
 *        3c774805 (binary) - texture pixels
 *        d96ea34b (bool) - texture is used
 *      d2a89f4c (array) - object connection table ?
 *        1d833e74 (uint) - unknown
 *        27c2201a (uint) - unknown
 *        60625aca (uint) - unknown
 *      eff0b992 (array) - object table
 *        1d833e74 (number) - game object id - referenced by connection table?
 *        c97982da (string) - object label ("Invalid") if not in use
 *        fb532a17 (array) - transform ?
 *          (array size [x, y, z])
 *          (array position [x, y, z])
 *          (array rotation? [x, y, z])
 *          (array unknown [?, ?, ?])
 */

export class GameDataParser extends BymlReader {

  private dataNode: BymlHash | null = null;

  constructor(buffer: ArrayBuffer) {
    super(buffer);
    assert(this.rootNode !== null, 'Root node is missing');
    assert(this.rootNode.type === BymlType.Hash, 'Root node must be a hash node');
    // root node is always a hash node with one item, which has a random (?) key
    const projectNode = [...this.rootNode.nodeMap.values()][0];
    //  project node contains a couple of sub-nodes, not sure why
    const gameNode = this.findNode(projectNode, Key.GAME, BymlType.Hash);
    const dataNode = this.findNode(gameNode,    Key.DATA, BymlType.Hash);
    this.dataNode = dataNode;
  }

  public getMetaData(): GameMeta {
    const dataNode = this.dataNode;
    const gameTitle =      this.findNode(dataNode, Key.GAME_TITLE,      BymlType.String).value;
    const gameId =         this.findNode(dataNode, Key.GAME_ID,         BymlType.String).value;
    const gameLocale =     this.findNode(dataNode, Key.GAME_LOCALE,     BymlType.String).value;
    const gameOnlineId =   this.findNode(dataNode, Key.GAME_ONLINEID,   BymlType.String).value;
    const programmerName = this.findNode(dataNode, Key.PROGRAMMER_NAME, BymlType.String).value;
    const programmerId =   this.findNode(dataNode, Key.PROGRAMMER_ID,   BymlType.String).value;
    // process game list to filter out empty strings
    const gameIdListNode = this.findNode(dataNode, Key.GAME_IDLIST, BymlType.Array);
    const gameIdList = gameIdListNode.childNodes
      .map(node => node.type === BymlType.String ? node.value : '')
      .filter(value => value);

    return {
      gameTitle,
      gameId,
      gameLocale,
      gameOnlineId,
      gameIdList,
      programmerName,
      programmerId
    }
  }

  public getThumbnailJpegData() {
    const thumbnailNode = this.findNode(this.dataNode, Key.THUMBNAIL, BymlType.Binary);
    return thumbnailNode.value;
  }

  public getThumbnailJpegUrl() {
    const data = this.getThumbnailJpegData();
    const blob = new Blob([data], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  }

  // TODO: double check if this is actually the palette?
  public getTextureEditorPalette() {
    const paletteNode = this.findNode(this.dataNode, Key.PALETTE_MAYBE, BymlType.Hash);
    const paletteListNodes = [...paletteNode.nodeMap.values()];
    return paletteListNodes
      .map(node => node.type === BymlType.Uint ? node.value : null)
      .filter(node => node !== null)
      .map(color => [
        (color >> 24) & 0xFF,
        (color >> 16) & 0xFF,
        (color >> 8) & 0xFF,
        color & 0xFF,
      ]);
  }

  public getTextureList() {
    const textureRoot = this.findNode(this.dataNode, Key.TEXTURELIST, BymlType.Array);
    return textureRoot.childNodes.map((textureNode, i) => {
      const pixelDataNode = this.findNode(textureNode, Key.TEXTURE_PIXELS,  BymlType.Binary);
      const isUsedNode =    this.findNode(textureNode, Key.TEXTURE_IS_USED, BymlType.Bool);
      return new GameTexture(pixelDataNode.value, isUsedNode.value, i);
    });
  }

  public getNodeConnectionList() {
    const connectionListNode = this.findNode(this.dataNode, Key.CONNECTIONLIST, BymlType.Array);
    return connectionListNode.childNodes
      .map(node => node.type === BymlType.Hash ? node.nodeMap : null)
      .filter(nodeMap => {
        const subNode = nodeMap.get('1d833e74');
        if (subNode.type !== BymlType.Uint)
          return false;
        if (subNode.value === 0)
          return false;
        return true;
      });
  }

  public getNumNodeConnections() {
    const list = this.getNodeConnectionList();
    return list.length;
  }

  public getObjectList() {
    const objectListNode = this.findNode(this.dataNode, Key.OBJECTLIST, BymlType.Array);
    return objectListNode.childNodes
      .map(node => node.type === BymlType.Hash ? node.nodeMap : null)
      .filter(nodeMap => {
        if (nodeMap === null)
          return false;
        const subNode = nodeMap.get(Key.OBJECT_LABEL);
        if (subNode.type !== BymlType.String)
          return false;
        if (subNode.value === 'Invalid')
          return false;
        return true;
      });
  }

  public getNumObjects() {
    const list = this.getObjectList();
    return list.length;
  }
}