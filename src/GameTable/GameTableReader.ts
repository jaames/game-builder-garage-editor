import {
  BymlReader,
  BymlType,
  BymlHash,
  BymlNode,
  getNode,
  BymlArray
} from '../Byml';

import { assert } from '../utils';

import { GameThumbnail } from '../GameFile';
import { GameTableEntry } from './GameTableEntry';
import { Key } from './GameTableBymlKeys';

export class GameTableReader extends BymlReader {

  public formatVersion: number;
  public dataNode: BymlHash | null = null;

  constructor(buffer: ArrayBuffer) {
    super(buffer);
    assert(this.rootNode !== null, 'Root node is missing');
    assert(this.rootNode.type === BymlType.Hash, 'Root node must be a hash node');
    this.dataNode = getNode(this.rootNode, Key.DATA, BymlType.Hash);
  }

  public getEntries(): GameTableEntry[] {
    const listNode = getNode(this.dataNode, Key.LIST_USER_GAMES, BymlType.Array);
    return listNode.children
      .filter(childNode => getNode(childNode, Key.GAME_ID, BymlType.String).value)
      .map((childNode, i) => {
        console.log('game', childNode)
        const gameId =         getNode(childNode, Key.GAME_ID,         BymlType.String).value;
        const gameTitle =      getNode(childNode, Key.GAME_TITLE,      BymlType.String).value;
        const gameLocale =     getNode(childNode, Key.GAME_LOCALE,     BymlType.String).value;
        const programmerId =   getNode(childNode, Key.PROGRAMMER_ID,   BymlType.String).value;
        const programmerName = getNode(childNode, Key.PROGRAMMER_NAME, BymlType.String).value;
        const thumbnailData =  getNode(childNode, Key.GAME_THUMBNAIL,  BymlType.Binary).value;
        const modified = this.parseTimestamp(childNode, Key.GAME_TIME_MODIFIED);
        const created =  this.parseTimestamp(childNode, Key.GAME_TIME_CREATED);
        const thumbnail = new GameThumbnail(thumbnailData);
        return {
          id: i,
          gameId,
          gameTitle,
          gameLocale,
          gameIdList: [], // don't think this is present
          gameOnlineId: '', // don't think this is either
          programmerId,
          programmerName,
          modified,
          created,
          thumbnail,
        };
      });
  }

  public parseTimestamp(parent: BymlNode, key: string) {
    const node = getNode(parent, key, BymlType.Array)
    const year =   getNode(node, 0, BymlType.Uint).value;
    const month =  getNode(node, 1, BymlType.Int).value;
    const day =    getNode(node, 2, BymlType.Uint).value;
    const hour =   getNode(node, 3, BymlType.Uint).value;
    const minute = getNode(node, 4, BymlType.Uint).value;
    const second = getNode(node, 5, BymlType.Uint).value;
    const date = new Date;
    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(day);
    date.setHours(hour, minute, second);
    return date;
  }

}