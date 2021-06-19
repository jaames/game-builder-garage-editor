import { GameTable, GameTableEntry } from '../../core/GameTable';
import { assert } from '../../core/utils';

import create from 'zustand';
import { GameFile } from '../../core/GameFile';

interface State {
  hasData: boolean;
  table: GameTable | undefined;
  myGames: GameTableEntry[];
  fileMap: Map<string, File>;
  setFiles: (fileList: File[]) => Promise<void>;
  getGameWithIdx: (idx: number) => Promise<[string, GameFile]>;
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
  getGameWithIdx: async (idx: number): Promise<[string, GameFile]> => {
    const filename = `LgcTpbFile_MyGame[${ idx }].bin`;
    const file = get().fileMap.get(filename);
    const game = GameFile.fromBuffer(await file.arrayBuffer());
    return [filename, game];
  }
}));