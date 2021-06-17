import { GameTable, GameTableEntry } from '../../core/GameTable';
import { assert } from '../../core/utils';

import create from 'zustand';

interface State {
  hasData: boolean;
  table: GameTable | undefined;
  myGames: GameTableEntry[];
  fileMap: Map<string, File>;
  setFiles: (fileList: File[]) => Promise<void>;
  getGameFileWithIdx: (idx: number) => [string, File];
}

export const useSaveData = create<State>((set, get) => ({
  hasData: false,
  table: undefined,
  fileMap: new Map(),
  myGames: [],
  setFiles: async (fileList: File[]) => {
    const fileMap = new Map<string, File>(fileList.map((file) => [file.name, file]));
    assert(fileMap.has('LgcTpb.bin'), 'Missing LgcTpb.bin');
    const tableFile = fileMap.get('LgcTpb.bin');
    const tableData = await tableFile.arrayBuffer();
    const table = GameTable.fromBuffer(tableData);
    const myGames = table.userGames;
    set({ fileMap, table, myGames, hasData: true });
  },
  getGameFileWithIdx: (idx: number): [string, File] => {
    const filename = `LgcTpbFile_MyGame[${ idx }].bin`;
    const file = get().fileMap.get(filename);
    return [filename, file];
  }
}));