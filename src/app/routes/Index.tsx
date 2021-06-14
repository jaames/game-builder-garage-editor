import React, { useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';

import { GlobalContext } from '../context/GlobalContext';

export const Index: React.FunctionComponent = () => {

  const globalCtx = useContext(GlobalContext);

  const onDrop = useCallback(acceptedFiles => {
    globalCtx.setFiles(acceptedFiles);
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
          { globalCtx.userGames.map((gameMeta) => (
            <div>
              { gameMeta.gameTitle }
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}