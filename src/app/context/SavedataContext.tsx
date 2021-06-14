import React, { createContext } from 'react';
import { GameTable, GameTableEntry } from '../../core/GameTable';
import { assert } from '../../core/utils';

interface Props {}

interface State {
  fileMap: Map<string, File>,
  userGames: GameTableEntry[],
  setFiles: (fileList: File[]) => void,
  getGameFileWithIdx?: (idx: number) => [string, File],
};

export const SavedataContext = createContext<State>({
  fileMap: new Map(),
  userGames: [],
  setFiles: () => {},
});

export class SavedataContextProvider extends React.Component<Props, State> {

  public table: GameTable = undefined;

  // load save file, locate game table and parse it
  setFiles = async (fileList: File[]) => {
    const fileMap = new Map<string, File>(fileList.map((file) => [file.name, file]));
    assert(fileMap.has('LgcTpb.bin'), 'Missing LgcTpb.bin');
    const tableFile = fileMap.get('LgcTpb.bin');
    const tableData = await tableFile.arrayBuffer();
    const table = GameTable.fromBuffer(tableData);
    const userGames = table.userGames;
    this.table = table;
    this.setState({ fileMap, userGames });
  }

  getGameFileWithIdx = (idx: number): [string, File] => {
    const filename = `LgcTpbFile_MyGame[${ idx }].bin`;
    const file = this.state.fileMap.get(filename);
    assert(file !== undefined, `Could not find file ${ filename }`);
    return [filename, file];
  }

  state: State = {
    fileMap: new Map(),
    userGames: [],
    setFiles: this.setFiles,
    getGameFileWithIdx: this.getGameFileWithIdx
  };

  render() {
    return (
      <SavedataContext.Provider value={ this.state }>
        { this.props.children }
      </SavedataContext.Provider>
    );
  }

}