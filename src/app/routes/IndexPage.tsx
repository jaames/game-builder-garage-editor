import React, { useCallback } from 'react';
import { useHistory } from 'react-router';

import { useSaveData } from '../store/saveData';
import { useGameFile } from '../store/gameFile';

import { GameThumbGrid } from '../components/GameThumbGrid';
import { GameThumb } from '../components/GameThumb';
import { DropZone } from '../components/DropZone';

import IndexContent from '../markdown/test.md';
import { MarkdownWrapper } from '../components/MarkdownWrapper';

export const IndexPage: React.FunctionComponent = () => {

  const hasData = useSaveData((state) => state.hasData);
  const setSaveData = useSaveData((state) => state.setFiles);
  const myGames = useSaveData((state) => state.myGames);

  const history = useHistory();

  const onDrop = useCallback(acceptedFiles => {
    setSaveData(acceptedFiles);
  }, []);

  const loadGameWithIdx = useCallback(async (idx) => {
    history.push(`/game/${idx}`);
  }, []);

  return (
    <div className="IndexPage">
      { (!hasData) && 
        <div className="DefaultView">
          <MarkdownWrapper>
            <IndexContent/>
          </MarkdownWrapper>
          <DropZone onDrop={ onDrop } accept={['.bin']}></DropZone>
        </div>
      }
      { hasData && 
        <div className="GameListView">
          <GameThumbGrid>
            { myGames.map((gameMeta, idx) => (
              <GameThumb
                key={ gameMeta.gameId }
                idx={ idx }
                gameId={ gameMeta.gameId }
                gameTitle={ gameMeta.name }
                thumbnail={ gameMeta.thumbnail }
                onClick={ idx => loadGameWithIdx(idx) }
              />
            ))}
          </GameThumbGrid>   
        </div>
      }
    </div>
  );

}