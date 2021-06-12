import {
  BymlReader,
  BymlType,
  BymlHash,
} from '../Byml';

import { GameTexture } from './GameTexture';
import { GameThumbnail } from './GameThumbnail';
import { GameMeta } from './GameMeta';
import { Key } from './GameBymlKeys';

import { assert } from '../utils';
import { GameConnection } from './GameConnection';
import { GameNodon } from './GameNodon';

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
 *        1d833e74 (uint) - from/to
 *        27c2201a (uint) - from/to
 *        60625aca (uint) - socket id
 *      eff0b992 (array) - object table
 *        1d833e74 (number) - game object id - referenced by connection table?
 *        c97982da (string) - object label ("Invalid") if not in use
 *        fb532a17 (array) - transform ?
 *          (array size [x, y, z])
 *          (array position [x, y, z])
 *          (array rotation? [x, y, z])
 *          (array unknown [?, ?, ?])
 */

export class GameDataReader extends BymlReader {

  public formatVersion: number;
  public dataNode: BymlHash | null = null;

  constructor(buffer: ArrayBuffer) {
    super(buffer);
    assert(this.rootNode !== null, 'Root node is missing');
    assert(this.rootNode.type === BymlType.Hash, 'Root node must be a hash node');
    // root node is always a hash node with one item, which has a random (?) key
    const projectNode = [...this.rootNode.nodeMap.values()][0];
    //  project node contains a couple of sub-nodes, not sure why
    const gameNode = this.findNode(projectNode, Key.GAME, BymlType.Hash);
    const dataNode = this.findNode(gameNode,    Key.DATA, BymlType.Hash);
    this.formatVersion = this.findNode(projectNode, Key.VERSION, BymlType.Uint).value;
    // only format ver 1 is known / supported!
    assert(this.formatVersion === 1, `Format version not recognised`);
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

  public getThumbnail() {
    const thumbnailNode = this.findNode(this.dataNode, Key.THUMBNAIL, BymlType.Binary);
    return new GameThumbnail(thumbnailNode.value);
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
    const textureRoot = this.findNode(this.dataNode, Key.LIST_TEXTURES, BymlType.Array);
    return textureRoot.childNodes
      .map((textureNode, i) => {
        const pixelData = this.findNode(textureNode, Key.TEXTURE_PIXELS,  BymlType.Binary).value;
        const isUsed =    this.findNode(textureNode, Key.TEXTURE_IS_USED, BymlType.Bool).value;
        return isUsed ? new GameTexture(pixelData, i) : null;
      })
      .filter((texture) => texture !== null);
  }

  public getConnections() {
    const connectionListNode = this.findNode(this.dataNode, Key.LIST_CONNECTIONS, BymlType.Array);
    return connectionListNode.childNodes
      // TODO: refactor this mess
      .filter(node => {
        if (node.type !== BymlType.Hash)
          return false;
        const subNode = node.nodeMap.get('1d833e74');
        if (subNode.type !== BymlType.Uint)
          return false;
        if (subNode.value === 0)
          return false;
        return true;
      })
      .map(node => {
        const id =   this.findNode(node, Key.CONNECTION_ID,   BymlType.Uint).value;
        const to =   this.findNode(node, Key.CONNECTION_TO,   BymlType.Uint).value;
        const from = this.findNode(node, Key.CONNECTION_FROM, BymlType.Uint).value;
        const [nodeId] =             this.parseNodonId(id);
        const [toId, toSocket] =     this.parseNodonId(to);
        const [fromId, fromSocket] = this.parseNodonId(from);
        return new GameConnection(nodeId, toId, toSocket, fromId, fromSocket);
      });
  }

  public getNumConnections() {
    const list = this.getConnections();
    return list.length;
  }

  public getNodons() {
    const objectListNode = this.findNode(this.dataNode, Key.LIST_NODON, BymlType.Array);
    return objectListNode.childNodes
      // TODO:
      .filter(node => {
        if (node === null || node.type !== BymlType.Hash)
          return false;
        if (this.findNode(node, Key.NODON_TYPE, BymlType.String).value === 'Invalid')
          return false;
        return true;
      })
      .map(node => {
        const id =   this.findNode(node, Key.NODON_ID,   BymlType.Uint).value;
        const type = this.findNode(node, Key.NODON_TYPE, BymlType.String).value;
        const [nodeId] = this.parseNodonId(id);
        return new GameNodon(nodeId, type);
      })
  }

  public getNumNodons() {
    const list = this.getNodons();
    return list.length;
  }

  public parseNodonId(int: number) {
    const id = Math.floor(int / 10);
    const socketId = int % 10;
    return [id, socketId];
  }
}