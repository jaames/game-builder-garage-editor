import React, { useCallback, useEffect } from 'react';
import { RouteComponentProps, useHistory } from 'react-router';

import { GameDetails } from '../components/GameDetails';
import { TextureGrid } from '../components/TextureGrid';
import { TextureThumb } from '../components/TextureThumb';

import { useGameFile } from '../store/gameFile';

import styles from '../styles/GameView.module.scss';

interface Props extends RouteComponentProps<{ gameIdx: string }> {};

export const GameView: React.FunctionComponent<Props> = (props) => {

  const gameIdx = parseInt(props.match.params.gameIdx);
  const isGameLoaded = useGameFile(state => state.isGameLoaded);
  const loadGameWithIdx = useGameFile((state) => state.loadGameWithIdx);
  const game = useGameFile(state => state.game);
  const meta = useGameFile(state => state.meta);
  const textures = useGameFile(state => state.textures);

  useEffect(() => {
    try {
      loadGameWithIdx(gameIdx);
    }
    catch {
      history.push('/');
    }
  }, [gameIdx]);

  const history = useHistory();

  const loadTexture = useCallback((idx: number) => {
    history.push(`/game/${ gameIdx }/texture/${ idx }`);
  }, [gameIdx]);

  return (
    <div className={ styles.root }>
      <div className={ styles.side }>
        { isGameLoaded && (
          <GameDetails game={ game }/>
        )}
      </div>
      <div className={ styles.main }>
        <div>
          <span>
            <h4>Textures</h4>
            <h4>3d</h4>
          </span>
        </div>
        <TextureGrid>
          { textures.map(texture => (
            <TextureThumb 
              texture={ texture }
              idx={ texture.id }
              key={ `${ meta.gameId }:tex${ texture.id }` }
              onClick={ idx => loadTexture(idx) }
            />
          ))}
        </TextureGrid>
      </div>
    </div>
  )
}