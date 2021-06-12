import {
  BymlParser,
  BymlNodeType,
  BymlHashNode,
} from '../Byml';

import { GameTexture } from './GameTexture'
import { GameMeta } from './GameMeta';

import { assert } from '../utils';

/**
 * node structure
 * rootNode (hash)
 *  79823569 (int) - unknown, always seen as 1, maybe format version?
 *  adaf3055 (hash) - only one child
 *    aa6902d3 (hash) - data
 *      6404e56c (string) - game title
 *      62f3087b (string) - game id
 *      da75c3df (string) - game locale (eg en-GB)
 *      1235b61b (string) - online game id
 *      e4d0371 (string) - author name (online only?)
 *      e2783c35 (string) - author id
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

const KEY_GAMENODE = 'adaf3055';
const KEY_DATANODE = 'aa6902d3';

const KEY_GAME_TITLE = '6404e56c';
const KEY_GAME_ID = '62f3087b';
const KEY_GAME_LOCALE = 'da75c3df';
const KEY_GAME_ONLINEID = '1235b61b';
const KEY_AUTHOR_NAME = 'e4d0371';
const KEY_AUTHOR_ID = 'e2783c35';
const KEY_GAME_IDLIST = '62661e51';
const KEY_THUMBNAIL = '4c0ff1a4';
const KEY_PALETTE_MAYBE  = '6efa44f5';
const KEY_TEXTURELIST = 'cd9f2f3d';
const KEY_CONNECTIONLIST = 'd2a89f4c';
const KEY_OBJECTLIST = 'eff0b992';

const KEY_TEXTURE_PIXELS = '3c774805';
const KEY_TEXTURE_IS_USED = 'd96ea34b';

const KEY_OBJECT_LABEL = 'c97982da';

export class GameDataParser extends BymlParser {

  private dataNode: BymlHashNode | null = null;

  constructor(buffer: ArrayBuffer) {
    super(buffer);
    assert(this.rootNode !== null, 'Root node is missing');
    assert(this.rootNode.type === BymlNodeType.Hash, 'Root node must be a hash node');
    const projectNode = [...this.rootNode.nodeMap.values()][0];
    const gameNode = this.findNode(projectNode, KEY_GAMENODE, BymlNodeType.Hash);
    const dataNode = this.findNode(gameNode,    KEY_DATANODE, BymlNodeType.Hash);
    this.dataNode = dataNode;
  }

  public getMetaData(): GameMeta {
    const dataNode = this.dataNode;
    const gameTitle =    this.findNode(dataNode, KEY_GAME_TITLE,    BymlNodeType.String).value;
    const gameId =       this.findNode(dataNode, KEY_GAME_ID,       BymlNodeType.String).value;
    const gameLocale =   this.findNode(dataNode, KEY_GAME_LOCALE,   BymlNodeType.String).value;
    const gameOnlineId = this.findNode(dataNode, KEY_GAME_ONLINEID, BymlNodeType.String).value;
    const authorName =   this.findNode(dataNode, KEY_AUTHOR_NAME,   BymlNodeType.String).value;
    const authorId =     this.findNode(dataNode, KEY_AUTHOR_ID,     BymlNodeType.String).value;
    // process game list to filter out empty strings
    const gameIdListNode = this.findNode(dataNode, KEY_GAME_IDLIST, BymlNodeType.Array);
    const gameIdList = gameIdListNode.childNodes
      .map(node => node.type === BymlNodeType.String ? node.value : '')
      .filter(value => value);

    return {
      gameTitle,
      gameId,
      gameLocale,
      gameOnlineId,
      gameIdList,
      authorName,
      authorId
    }
  }

  public getThumbnailJpegData() {
    const thumbnailNode = this.findNode(this.dataNode, KEY_THUMBNAIL, BymlNodeType.Binary);
    return thumbnailNode.value;
  }

  public getThumbnailJpegUrl() {
    const data = this.getThumbnailJpegData();
    const blob = new Blob([data], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  }

  // TODO: double check if this is actually the palette?
  public getTextureEditorPalette() {
    const paletteNode = this.findNode(this.dataNode, KEY_PALETTE_MAYBE, BymlNodeType.Hash);
    const paletteListNodes = [...paletteNode.nodeMap.values()];
    return paletteListNodes
      .map(node => node.type === BymlNodeType.Uint ? node.value : null)
      .filter(node => node !== null)
      .map(color => [
        (color >> 24) & 0xFF,
        (color >> 16) & 0xFF,
        (color >> 8) & 0xFF,
        color & 0xFF,
      ]);
  }

  public getTextureList() {
    const textureRoot = this.findNode(this.dataNode, KEY_TEXTURELIST, BymlNodeType.Array);
    return textureRoot.childNodes.map((textureNode, i) => {
      const pixelDataNode = this.findNode(textureNode, KEY_TEXTURE_PIXELS, BymlNodeType.Binary);
      const isUsedNode = this.findNode(textureNode, KEY_TEXTURE_IS_USED, BymlNodeType.Bool);
      return new GameTexture(pixelDataNode.value, isUsedNode.value, i);
    });
  }

  public getNodeConnectionList() {
    const connectionListNode = this.findNode(this.dataNode, KEY_CONNECTIONLIST, BymlNodeType.Array);
    return connectionListNode.childNodes
      .map(node => node.type === BymlNodeType.Hash ? node.nodeMap : null)
      .filter(nodeMap => {
        const subNode = nodeMap.get('1d833e74');
        if (subNode.type !== BymlNodeType.Uint)
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
    const objectListNode = this.findNode(this.dataNode, KEY_OBJECTLIST, BymlNodeType.Array);
    return objectListNode.childNodes
      .map(node => node.type === BymlNodeType.Hash ? node.nodeMap : null)
      .filter(nodeMap => {
        if (nodeMap === null)
          return false;
        const subNode = nodeMap.get(KEY_OBJECT_LABEL);
        if (subNode.type !== BymlNodeType.String)
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