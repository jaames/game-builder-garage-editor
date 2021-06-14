import React, { createContext } from 'react';
import { GameFile } from '../../core/GameFile';
import { assert } from '../../core/utils';

interface Props {}

interface State {
  fileIdx: number,
  filename: string,
  game: GameFile | undefined,
  loadGameFromFile?: (file: File, fileIdx: number, filename: string) => Promise<any>,
};

export const GameEditorContext = createContext<State>({
  fileIdx: -1,
  filename: '',
  game: undefined,
});

export class GameEditorContextProvider extends React.Component<Props, State> {

  loadGameFromFile = async (file: File, fileIdx: number, filename: string) => {
    const data = await file.arrayBuffer();
    const game = GameFile.fromBuffer(data);
    (window as any).game = game; // for debugging
    this.setState({ game, fileIdx, filename });
  }

  state: State = {
    fileIdx: 0,
    filename: '',
    game: undefined,
    loadGameFromFile: this.loadGameFromFile
  };

  render() {
    return (
      <GameEditorContext.Provider value={ this.state }>
        { this.props.children }
      </GameEditorContext.Provider>
    );
  }

}