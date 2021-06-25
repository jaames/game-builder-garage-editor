import {
  BymlReader,
  BymlType,
  BymlHash,
  BymlNode,
  getNode,
} from '../Byml';

import { assert } from '../../utils';

import { GameThumbnail, GameMetaBasic } from '../GameFile';
import { UserSettings } from './UserSettings';
import { TableKey as Key } from './GameTableBymlKeys';

export class GameTableReader extends BymlReader {

  public formatVersion: number;
  public dataNode: BymlHash | null = null;

  constructor(buffer: ArrayBuffer) {
    super(buffer);
    assert(this.rootNode !== null, 'Root node is missing');
    assert(this.rootNode.type === BymlType.Hash, 'Root node must be a hash node');
    this.dataNode = getNode(this.rootNode, Key.LgcTpb, BymlType.Hash);
  }

  public getFileHashes() {
    const listNode = getNode(this.dataNode, Key.mValueHashCache, BymlType.Array);
    return listNode.children.map((childNode) => {
      return childNode.type === BymlType.Uint ? childNode.value : -1;
    });
  }

  public getOrderIndex() {
    const listNode = getNode(this.dataNode, Key.mOrderIndex, BymlType.Array);
    return listNode.children.map((childNode) => {
      return childNode.type === BymlType.Int ? childNode.value : -1;
    });
  }

  public getUserGameEntries(): GameMetaBasic[] {
    const gameOrder = this.getOrderIndex().slice(0, 64);
    const gameList = getNode(this.dataNode, Key.mMyGameFileCache, BymlType.Array).children;
    return gameList
      .sort((a, b) => gameOrder[gameList.indexOf(b)] + gameOrder[gameList.indexOf(a)])
      .map((childNode, i) => this.parseGameEntry(childNode, i))
      .filter((gameEntry) => !gameEntry.isEmpty)
  }

  public getLessonGameEntries(): GameMetaBasic[] {
    const listNode = getNode(this.dataNode, Key.mLessonFileCache, BymlType.Array);
    return listNode.children
      .filter((childNode) => this.isGameEntryUsed(childNode))
      .map((childNode) => this.parseGameEntry(childNode));
  }

  // public getTutorialGameEntries(): GameTableEntry[] {
  //   const listNode = getNode(this.dataNode, Key.LIST_TUTORIAL_GAMES, BymlType.Array);
  //   return listNode.children
  //     .filter((childNode) => this.isGameEntryUsed(childNode))
  //     .map((childNode) => this.parseGameEntry(childNode));
  // }

  // public getUserSettings(): UserSettings {
  //   const programmerId = getNode(this.dataNode, Key.USER_PROGRAMMER_ID, BymlType.String).value;

  //   const settingsNode = getNode(this.dataNode,  Key.USER_SETTINGS, BymlType.Hash);
  //   const handledAndTabletopControl = getNode(settingsNode, Key.USER_HANDCONTROL, BymlType.String).value;
  //   const tvModeControl = getNode(settingsNode, Key.USER_TVCONTROL, BymlType.String).value;

  //   return {
  //     programmerId,
  //     handledAndTabletopControl,
  //     tvModeControl
  //   };
  // }

  public isGameEntryUsed(parent: BymlNode) {
    return !getNode(parent, Key.mEmpty, BymlType.Bool).value;
  }

  public parseGameEntry(dataNode: BymlNode, idx: number = 0): GameMetaBasic {
    const isEmpty =        getNode(dataNode, Key.mEmpty,            BymlType.Bool).value;
    const version =        getNode(dataNode, Key.mVersion,          BymlType.Uint).value;
    const name =           getNode(dataNode, Key.mName,             BymlType.String).value;
    const gameId =         getNode(dataNode, Key.mGameCode,         BymlType.String).value;
    const authorId =       getNode(dataNode, Key.mAuthorCode,       BymlType.String).value;
    const authorName =     getNode(dataNode, Key.mAuthorName,       BymlType.String).value;
    const isFavorite =     getNode(dataNode, Key.mFavorite,         BymlType.Bool).value;
    const isFileLock =     getNode(dataNode, Key.mFileLock,         BymlType.Bool).value;
    const isDownload =     getNode(dataNode, Key.mDownload,         BymlType.Bool).value;
    const lang =           getNode(dataNode, Key.mLang,             BymlType.String).value;
    const numNodon =       getNode(dataNode, Key.mNodeNum,          BymlType.Int).value;
    const numConnections = getNode(dataNode, Key.mConnectionNum,    BymlType.Int).value;
    const idHistSize =     getNode(dataNode, Key.mShareCodeHistNum, BymlType.Int).value;

    const createTime = this.parseTimestamp(dataNode, Key.mCreateTime);
    const editTime =   this.parseTimestamp(dataNode, Key.mEditTime);

    // const keyer = getNode(dataNode, Key.mChangeFileKeyThisFile, BymlType.Hash);
    // console.log(keyer);

    const thumbnailSize = getNode(dataNode, Key.mThumbnailImageByteSize, BymlType.Uint).value;
    const thumbnailNode = getNode(dataNode, Key.mThumbnailImageJPG, BymlType.Binary);
    const buffer = thumbnailNode.value;
    const thumbnail = new GameThumbnail(buffer.slice(0, thumbnailSize));

    return {
      isEmpty,
      version,
      name,
      gameId,
      authorId,
      authorName,
      isFavorite,
      isFileLock,
      isDownload,
      lang,
      numNodon,
      numConnections,
      createTime,
      editTime,
      gameIdHistorySize: idHistSize,
      thumbnail,
      gameIndex: idx
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