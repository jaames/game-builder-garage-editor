import React, { createContext } from 'react';
import { GameTable, GameTableEntry } from '../../core/GameTable';
import { assert } from '../../core/utils';

interface Props {}

interface State {
  fileMap: Map<string, File>;
  userGames: GameTableEntry[];
  setFiles: (fileList: File[]) => void
}

export const GlobalContext = createContext<State>({
  fileMap: new Map(),
  userGames: [],
  setFiles: () => {},
});

export class GlobalContextProvider extends React.Component<Props, State> {

  public table: GameTable = undefined;

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

  state: State = {
    fileMap: new Map(),
    userGames: [],
    setFiles: this.setFiles
  };

  render() {
    return (
      <GlobalContext.Provider value={ this.state }>
        { this.props.children }
      </GlobalContext.Provider>
    );
  }

}