import {
  BymlReader,
  BymlType,
  BymlHash,
  BymlNode,
  getNode,
} from '../Byml';

import { assert } from '../utils';

import { GameThumbnail } from '../GameFile';
import { GameTableEntry } from './GameTableEntry';
import { UserSettings } from './UserSettings';
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

  public getIdMap() {
    const listNode = getNode(this.dataNode, Key.LIST_ID_MAP, BymlType.Array);
    return listNode.children.map((childNode) => {
      return childNode.type === BymlType.Int ? childNode.value : -1;
    });
  }

  public getUserGameEntries(): GameTableEntry[] {
    const listNode = getNode(this.dataNode, Key.LIST_USER_GAMES, BymlType.Array);
    return listNode.children
      .map((childNode) => this.parseGameEntry(childNode));
  }

  public getTutorialGameEntries(): GameTableEntry[] {
    const listNode = getNode(this.dataNode, Key.LIST_TUTORIAL_GAMES, BymlType.Array);
    return listNode.children
      .map((childNode) => this.parseGameEntry(childNode));
  }

  public getUserSettings(): UserSettings {
    const programmerId = getNode(this.dataNode, Key.USER_PROGRAMMER_ID, BymlType.String).value;

    const settingsNode = getNode(this.dataNode,  Key.USER_SETTINGS, BymlType.Hash);
    const handledAndTabletopControl = getNode(settingsNode, Key.USER_HANDCONTROL, BymlType.String).value;
    const tvModeControl = getNode(settingsNode, Key.USER_TVCONTROL, BymlType.String).value;

    return {
      programmerId,
      handledAndTabletopControl,
      tvModeControl
    };
  }

  public parseGameEntry(parent: BymlNode): GameTableEntry {
    const gameId =         getNode(parent, Key.GAME_ID,         BymlType.String).value;
    const gameTitle =      getNode(parent, Key.GAME_TITLE,      BymlType.String).value;
    const gameLocale =     getNode(parent, Key.GAME_LOCALE,     BymlType.String).value;
    const programmerId =   getNode(parent, Key.PROGRAMMER_ID,   BymlType.String).value;
    const programmerName = getNode(parent, Key.PROGRAMMER_NAME, BymlType.String).value;
    const thumbnailData =  getNode(parent, Key.GAME_THUMBNAIL,  BymlType.Binary).value;
    const modified = this.parseTimestamp(parent, Key.GAME_TIME_MODIFIED);
    const created =  this.parseTimestamp(parent, Key.GAME_TIME_CREATED);
    const thumbnail = new GameThumbnail(thumbnailData);
    return {
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
    date.setMonth(month - 1); // js Date months start at 0
    date.setDate(day);
    date.setHours(hour, minute, second);
    return date;
  }

}