import React, { useCallback, useContext } from 'react';
import { useHistory } from 'react-router';
import { useDropzone } from 'react-dropzone';

import { useSaveData } from '../store/saveData';
import { useGameFile } from '../store/gameFile';

export const Index: React.FunctionComponent = () => {

  const setSaveData = useSaveData((state) => state.setFiles);
  const getGameFileWithIdx = useSaveData((state) => state.getGameFileWithIdx);
  const loadGameFromFile = useGameFile((state) => state.loadGameFromFile);

  const userGames = useSaveData((state) => state.userGames);

  const history = useHistory();

  const onDrop = useCallback(acceptedFiles => {
    setSaveData(acceptedFiles);
  }, []);

  const loadGameWithIdx = useCallback(async (idx) => {
    const [filename, file] = getGameFileWithIdx(idx);
    await loadGameFromFile(file, idx, filename);
    history.push(`/game/${idx}/`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ['.bin']
  });

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
      </div>
      <div className="GameTable">
        <div className="GameItem">
          { userGames.map((gameMeta, idx) => (
            <div key={ gameMeta.gameId } onClick={ () => loadGameWithIdx(idx) }>
              <img src={ gameMeta.thumbnail.getUrl() } />
              <h3>{ gameMeta.gameTitle }</h3>
              <div>Nodon count: { gameMeta.nodonCount }</div>
              <div>Connection count: { gameMeta.connectionCount }</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}