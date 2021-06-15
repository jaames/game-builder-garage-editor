import React from 'react';

import { useGameFile } from '../store/gameFile';

interface Props {
  gameIdx: number
};

export const GameView: React.FunctionComponent<Props> = (props) => {

  const game = useGameFile(state => state.game);
  const meta = useGameFile(state => state.meta);
  const textures = useGameFile(state => state.textures);

  return (
    <div>
      <img src={ game.thumbnail.getUrl() } alt="" />
      <div>{ meta.gameTitle }</div>
      <div>{ meta.gameId }</div>
      <div>
        {textures.map(texture => (
          <div className="textureItem" key={ texture.id }>
            <img src={ texture.getUrl() } alt="" />
          </div>
        ))}
      </div>
    </div>
  )
}