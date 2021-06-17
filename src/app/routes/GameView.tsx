import React from 'react';

import { useGameFile } from '../store/gameFile';

import { GameThumb } from '../components/GameThumb';
import { TextureGrid } from '../components/TextureGrid';
import { TextureThumb } from '../components/TextureThumb';

import styles from '../styles/GameView.module.scss';

interface Props {
  gameIdx: number
};

export const GameView: React.FunctionComponent<Props> = (props) => {

  const game = useGameFile(state => state.game);
  const meta = useGameFile(state => state.meta);
  const textures = useGameFile(state => state.textures);

  return (
    <div className={ styles.root }>
      <div className={ styles.side }>
        <GameThumb thumbnail={ game.thumbnail }/>
        <div>{ meta.gameTitle }</div>
        <div>{ meta.gameId }</div>
      </div>
      <div className={ styles.main }>
        <TextureGrid>
          { textures.map(texture => (
            <TextureThumb texture={ texture } idx={ texture.id } key={ `${ meta.gameId }:tex${ texture.id }` }/>
          ))}
        </TextureGrid>
      </div>
    </div>
  )
}