import { GameThumbnail } from './GameThumbnail';

export interface GameMetaBasic {
  isEmpty: boolean,
  version: number,
  name: string,
  gameId: string,
  authorId: string,
  authorName: string,
  isFavorite: boolean,
  isFileLock: boolean,
  isDownload: boolean,
  lang: string,
  numNodon: number,
  numConnections: number,
  editTime: Date,
  createTime: Date,
  gameIdHistorySize: number,
  thumbnail: GameThumbnail
};

export interface GameMetaExtended extends GameMetaBasic {
  originId: string,
  gameIdHistory: string[],
};