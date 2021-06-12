import {
  BymlReader,
  BymlType,
  BymlHash,
  BymlNode,
  BymlArray,
} from '../Byml';

import { GameTexture } from './GameTexture';
import { GameThumbnail } from './GameThumbnail';
import { GameMeta } from './GameMeta';
import { Key } from './GameBymlKeys';

import { assert } from '../utils';
import { GameConnection } from './GameConnection';
import { GameNodon, Vec2, Vec3 } from './GameNodon';

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
 *      2eb62a0a (array) - text nodon string list
 *        [] (hash) - text object string item
 *          73abc186 (string) - text string
 *          d96ea34b (bool) is used (same as texture list)
 *      e20a4a95 (array) - comment nodon string list
 *        [] (hash) - text object string item
 *          73abc186 (string) - text string
 *          d96ea34b (bool) is used (same as texture list)
 *      d2a89f4c (array) - object connection table ?
 *        1d833e74 (uint) - from/to
 *        27c2201a (uint) - from/to
 *        60625aca (uint) - socket id
 *      eff0b992 (array) - object table
 *        1d833e74 (number) - game object id - referenced by connection table?
 *        c97982da (string) - object label ("Invalid") if not in use
 *        4349b622 (array) - object settings
 *          [] (uint) - setting item
 *        2bb4be37 (array) - graph position front
 *          [0] (float) - x
 *          [1] (float) - y
 *        b0705703 (array) - graph position top?
 *          [0] (float) - x
 *          [1] (float) - y
 *        fb532a17 (array) - transforms ?
 *          (array size [x, y, z])
 *          (array position [x, y, z])
 *          (array rotation? [x, y, z])
 *          (array unknown [?, ?, ?])
 * anything else is currently unknown
 */

export class GameDataReader extends BymlReader {

  public formatVersion: number;
  public dataNode: BymlHash | null = null;

  constructor(buffer: ArrayBuffer) {
    super(buffer);
    assert(this.rootNode !== null, 'Root node is missing');
    assert(this.rootNode.type === BymlType.Hash, 'Root node must be a hash node');
    // root node is always a hash node with one item, which has a random (?) key
    const projectNode = [...this.rootNode.hashMap.values()][0];
    //  project node contains a couple of sub-nodes, not sure why
    const gameNode = this.getNode(projectNode, Key.GAME, BymlType.Hash);
    const dataNode = this.getNode(gameNode,    Key.DATA, BymlType.Hash);
    this.formatVersion = this.getNode(projectNode, Key.VERSION, BymlType.Uint).value;
    // only format ver 1 is known / supported!
    assert(this.formatVersion === 1, `Format version not recognised`);
    this.dataNode = dataNode;
  }

  public getMetaData(): GameMeta {
    const dataNode = this.dataNode;
    const gameTitle =      this.getNode(dataNode, Key.GAME_TITLE,      BymlType.String).value;
    const gameId =         this.getNode(dataNode, Key.GAME_ID,         BymlType.String).value;
    const gameLocale =     this.getNode(dataNode, Key.GAME_LOCALE,     BymlType.String).value;
    const gameOnlineId =   this.getNode(dataNode, Key.GAME_ONLINEID,   BymlType.String).value;
    const programmerName = this.getNode(dataNode, Key.PROGRAMMER_NAME, BymlType.String).value;
    const programmerId =   this.getNode(dataNode, Key.PROGRAMMER_ID,   BymlType.String).value;
    // process game list to filter out empty strings
    const gameIdListNode = this.getNode(dataNode, Key.GAME_IDLIST, BymlType.Array);
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
    const thumbnailNode = this.getNode(this.dataNode, Key.THUMBNAIL, BymlType.Binary);
    return new GameThumbnail(thumbnailNode.value);
  }

  // TODO: double check if this is actually the palette?
  public getTextureEditorPalette() {
    const paletteNode = this.getNode(this.dataNode, Key.PALETTE_MAYBE, BymlType.Hash);
    const paletteListNodes = [...paletteNode.hashMap.values()];
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

  public getTextures() {
    const listNode = this.getNode(this.dataNode, Key.LIST_TEXTURES, BymlType.Array);
    return listNode.childNodes
      .map((textureNode, i) => {
        const pixelData = this.getNode(textureNode, Key.TEXTURE_PIXELS,  BymlType.Binary).value;
        const isUsed =    this.getNode(textureNode, Key.TEXTURE_IS_USED, BymlType.Bool).value;
        return isUsed ? new GameTexture(pixelData, i) : null;
      })
      .filter((texture) => texture !== null);
  }

  public getTextNodonStrings() {
    const listRoot = this.getNode(this.dataNode, Key.LIST_TEXT_NODON_STRINGS, BymlType.Array);
    return listRoot.childNodes
      .map(textNode => this.getNode(textNode, Key.STRING_VALUE, BymlType.String).value)
      .filter(textNode => textNode);
  }

  public getCommentNodonStrings() {
    const listRoot = this.getNode(this.dataNode, Key.LIST_COMMENT_NODON_STRINGS, BymlType.Array);
    return listRoot.childNodes
      .map(textNode => this.getNode(textNode, Key.STRING_VALUE, BymlType.String).value)
      .filter(textNode => textNode);
  }

  public getConnections() {
    const connectionListNode = this.getNode(this.dataNode, Key.LIST_CONNECTIONS, BymlType.Array);
    return connectionListNode.childNodes
      // TODO: refactor this mess
      .filter(node => {
        if (node.type !== BymlType.Hash)
          return false;
        const subNode = node.hashMap.get('1d833e74');
        if (subNode.type !== BymlType.Uint)
          return false;
        if (subNode.value === 0)
          return false;
        return true;
      })
      .map(node => {
        const id =   this.getNode(node, Key.CONNECTION_ID,   BymlType.Uint).value;
        const to =   this.getNode(node, Key.CONNECTION_TO,   BymlType.Uint).value;
        const from = this.getNode(node, Key.CONNECTION_FROM, BymlType.Uint).value;
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
    const objectListNode = this.getNode(this.dataNode, Key.LIST_NODON, BymlType.Array);
    return objectListNode.childNodes
      .filter(node => {
        if (node === null || node.type !== BymlType.Hash)
          return false;
        if (this.getNode(node, Key.NODON_TYPE, BymlType.String).value === 'Invalid')
          return false;
        return true;
      })
      .map((node: BymlHash) => this.parseNodon(node));
  }

  public getNumNodons() {
    const list = this.getNodons();
    return list.length;
  }

  public parseNodon(node: BymlHash) {
    // id (needs to be divided by 10) and type
    const id =   this.getNode(node, Key.NODON_ID,   BymlType.Uint).value;
    const type = this.getNode(node, Key.NODON_TYPE, BymlType.String).value;
    // create nodon now, since we know it exists
    const [nodeId] = this.parseNodonId(id);
    const nodon = new GameNodon(nodeId, type);
    // position on the nodon graph
    const graphPosFront = this.getNumberArray(node, Key.NODON_GRAPH_POS_FRONT);
    const graphPosTop =   this.getNumberArray(node, Key.NODON_GRAPH_POS_TOP);
    nodon.graphPosFront = graphPosFront as Vec2;
    nodon.graphPosTop =   graphPosTop as Vec2;
    const dataNode =  this.getNode(node,     Key.NODON_DATA,            BymlType.Hash);
    const worldNode = this.getNode(dataNode, Key.NODON_WORLD_TRANSFORM, BymlType.Array);
    const size =    this.getNumberArray(worldNode, 0);
    const pos =     this.getNumberArray(worldNode, 1);
    const rot =     this.getNumberArray(worldNode, 2);
    const unknown = this.getNumberArray(worldNode, 3);
    nodon.hasWorldTransform = true;
    nodon.size =     size as Vec3;
    nodon.position = pos as Vec3;
    nodon.rotation = rot as Vec3;
    nodon.unknown  = unknown as Vec3;
    return nodon;
  }

  public getNumberArray(node: BymlNode, key: string | number) {
    const foundNode = this.getNode(node, key, BymlType.Array);
    return foundNode.childNodes.map<number>(childNode => {
      return (childNode as any).value; // sorry
    });
  }

  public parseNodonId(int: number) {
    const id = Math.floor(int / 10);
    const socketId = int % 10;
    return [id, socketId];
  }
}