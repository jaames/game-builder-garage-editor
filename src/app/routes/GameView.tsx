import React, { useCallback, useEffect } from 'react';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';

import { Layout } from '../components/Layout';
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
    <Layout>
      <div className={ styles.root }>
        <div className={ styles.side }>
          { isGameLoaded && (
            <GameDetails game={ game }/>
          )}
        </div>
        <div className={ styles.main }>
          <div style={{ display: 'flex', marginBottom: '1em' }}>
            <span>
              <h3>Textures</h3>
            </span>
            <span style={{ marginLeft: '12px', color: '#888' }}>
              <h3><Link to={ `/3d/${ gameIdx }` }>3d View</Link></h3>
            </span>
            <span style={{ marginLeft: '12px', color: '#888' }}>
              <h3><Link to={ `/graph/${ gameIdx }` }>Nodon Graph</Link></h3>
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
    </Layout>
  )
}