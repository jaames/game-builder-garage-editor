import {
  BymlReader,
  BymlType,
  BymlHash,
  BymlNode,
  getNode
} from '../Byml';

import { assert } from '../utils';

import { Key } from './GameBymlKeys';
import { GameTexture } from './GameTexture';
import { GameThumbnail } from './GameThumbnail';
import { GameMeta } from './GameMeta';
import { GameConnection } from './GameConnection';
import { GameNodon, Vec2, Vec3 } from './GameNodon';

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
    const gameNode = getNode(projectNode, Key.GAME, BymlType.Hash);
    const dataNode = getNode(gameNode,    Key.DATA, BymlType.Hash);
    this.formatVersion = getNode(projectNode, Key.VERSION, BymlType.Uint).value;
    // only format ver 1 is known / supported!
    assert(this.formatVersion === 1, `Format version not recognised`);
    this.dataNode = dataNode;
  }

  public getMetaData(): GameMeta {
    const dataNode = this.dataNode;
    const gameTitle =      getNode(dataNode, Key.GAME_TITLE,      BymlType.String).value;
    const gameId =         getNode(dataNode, Key.GAME_ID,         BymlType.String).value;
    const gameLocale =     getNode(dataNode, Key.GAME_LOCALE,     BymlType.String).value;
    const gameOnlineId =   getNode(dataNode, Key.GAME_ONLINEID,   BymlType.String).value;
    const programmerName = getNode(dataNode, Key.PROGRAMMER_NAME, BymlType.String).value;
    const programmerId =   getNode(dataNode, Key.PROGRAMMER_ID,   BymlType.String).value;
    // process game list to filter out empty strings
    const gameIdListNode = getNode(dataNode, Key.GAME_IDLIST, BymlType.Array);
    const gameIdList = gameIdListNode.children
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
    const thumbnailNode = getNode(this.dataNode, Key.THUMBNAIL, BymlType.Binary);
    return new GameThumbnail(thumbnailNode.value);
  }

  // TODO: double check if this is actually the palette?
  public getTextureEditorPalette() {
    const paletteNode = getNode(this.dataNode, Key.PALETTE_MAYBE, BymlType.Hash);
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
    const listNode = getNode(this.dataNode, Key.LIST_TEXTURES, BymlType.Array);
    return listNode.children
      .map((textureNode, i) => {
        const pixelData = getNode(textureNode, Key.TEXTURE_PIXELS,  BymlType.Binary).value;
        const isUsed =    getNode(textureNode, Key.TEXTURE_IS_USED, BymlType.Bool).value;
        return isUsed ? new GameTexture(pixelData, i) : null;
      })
      .filter((texture) => texture !== null);
  }

  public getTextNodonStrings() {
    const listRoot = getNode(this.dataNode, Key.LIST_TEXT_NODON_STRINGS, BymlType.Array);
    return listRoot.children
      .map(textNode => getNode(textNode, Key.STRING_VALUE, BymlType.String).value)
      .filter(textNode => textNode);
  }

  public getCommentNodonStrings() {
    const listRoot = getNode(this.dataNode, Key.LIST_COMMENT_NODON_STRINGS, BymlType.Array);
    return listRoot.children
      .map(textNode => getNode(textNode, Key.STRING_VALUE, BymlType.String).value)
      .filter(textNode => textNode);
  }

  public getConnections() {
    const connectionListNode = getNode(this.dataNode, Key.LIST_CONNECTIONS, BymlType.Array);
    return connectionListNode.children
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
        const id =   getNode(node, Key.CONNECTION_ID,   BymlType.Uint).value;
        const to =   getNode(node, Key.CONNECTION_TO,   BymlType.Uint).value;
        const from = getNode(node, Key.CONNECTION_FROM, BymlType.Uint).value;
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
    const objectListNode = getNode(this.dataNode, Key.LIST_NODON, BymlType.Array);
    return objectListNode.children
      .filter(node => {
        if (node === null || node.type !== BymlType.Hash)
          return false;
        if (getNode(node, Key.NODON_TYPE, BymlType.String).value === 'Invalid')
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
    const id =   getNode(node, Key.NODON_ID,   BymlType.Uint).value;
    const type = getNode(node, Key.NODON_TYPE, BymlType.String).value;
    // create nodon now, since we know it exists
    const [nodeId] = this.parseNodonId(id);
    const nodon = new GameNodon(nodeId, type);
    // position on the nodon graph
    const graphPosFront = this.getNumberArray(node, Key.NODON_GRAPH_POS_FRONT);
    const graphPosTop =   this.getNumberArray(node, Key.NODON_GRAPH_POS_TOP);
    nodon.graphPosFront = graphPosFront as Vec2;
    nodon.graphPosTop =   graphPosTop as Vec2;
    const dataNode =  getNode(node,     Key.NODON_DATA,            BymlType.Hash);
    const worldNode = getNode(dataNode, Key.NODON_WORLD_TRANSFORM, BymlType.Array);
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
    const foundNode = getNode(node, key, BymlType.Array);
    return foundNode.children.map<number>(childNode => {
      return (childNode as any).value; // sorry
    });
  }

  public parseNodonId(int: number) {
    const id = Math.floor(int / 10);
    const socketId = int % 10;
    return [id, socketId];
  }
}