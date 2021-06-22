import { GameTableReader } from './GameTableReader';
import { GameMetaBasic } from '../GameFile';
import { UserSettings } from './UserSettings';
import { BymlNode } from '../Byml';

export class GameTable {

  public userGames: GameMetaBasic[] = [];
  public lessonGames: GameMetaBasic[] = [];
  public order: number[];
  public fileHashes: number[];
  public userSettings: UserSettings;

  public _bymlCache: BymlNode = null;

  static fromBuffer(buffer: ArrayBuffer) {
    const reader = new GameTableReader(buffer);
    const table = new GameTable();
    table.userGames = reader.getUserGameEntries();
    table.lessonGames = reader.getLessonGameEntries();
    // table.userSettings = reader.getUserSettings();
    table.fileHashes = reader.getFileHashes();
    table.order = reader.getOrderIndex();
    table._bymlCache = reader.rootNode;
    return table;
  }

  static async fromUrl(url: string) {
    const response = await fetch(url);
    const data = await response.arrayBuffer();
    return GameTable.fromBuffer(data);
  }

  getFileNameOrder() {
    
  }

}