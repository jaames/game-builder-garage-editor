import { GameTable, GameTableEntry } from '../../core/GameTable';
import { assert } from '../../core/utils';

import create from 'zustand';

interface State {
  table: GameTable | undefined;
  userGames: GameTableEntry[];
  fileMap: Map<string, File>;
  setFiles: (fileList: File[]) => Promise<void>;
  getGameFileWithIdx: (idx: number) => [string, File];
}

export const useSaveData = create<State>((set, get) => ({
  table: undefined,
  fileMap: new Map(),
  userGames: [],
  setFiles: async (fileList: File[]) => {
    const fileMap = new Map<string, File>(fileList.map((file) => [file.name, file]));
    assert(fileMap.has('LgcTpb.bin'), 'Missing LgcTpb.bin');
    const tableFile = fileMap.get('LgcTpb.bin');
    const tableData = await tableFile.arrayBuffer();
    const table = GameTable.fromBuffer(tableData);
    const userGames = table.userGames;
    set({ fileMap, table, userGames });
  },
  getGameFileWithIdx: (idx: number): [string, File] => {
    const filename = `LgcTpbFile_MyGame[${ idx }].bin`;
    const file = get().fileMap.get(filename);
    return [filename, file];
  }
}));