import React, { useCallback, useContext } from 'react';

import { GameEditorContext } from '../context/GameEditorContext';

interface Props {
  gameIdx: number
}

export const GameView: React.FunctionComponent<Props> = () => {

  const editorCtx = useContext(GameEditorContext);
  
  const game = editorCtx.game;

  return (
    <div>
      <img src={ game.thumbnail.getUrl() } alt="" />
      <div>
        {game.textures.map(texture => (
          <div className="textureItem" key={ texture.id }>
            <img src={ texture.getUrl() } alt="" />
          </div>
        ))}
      </div>
    </div>
  )
}