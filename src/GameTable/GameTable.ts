import { GameTableReader } from './GameTableReader';
import { GameTableEntry } from './GameTableEntry';
import { UserSettings } from './UserSettings';

export class GameTable {

  public games: GameTableEntry[] = [];
  public userSettings: UserSettings = {};

  static fromBuffer(buffer: ArrayBuffer) {
    const reader = new GameTableReader(buffer);
    const table = new GameTable();
    table.games = reader.getEntries();
    // todo: set table from reader
    return table;
  }

  static async fromUrl(url: string) {
    const response = await fetch(url);
    const data = await response.arrayBuffer();
    return GameTable.fromBuffer(data);
  }

}