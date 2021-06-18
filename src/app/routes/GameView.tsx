import React, { useCallback, useEffect } from 'react';
import { RouteComponentProps, useHistory } from 'react-router';

import { GameThumb } from '../components/GameThumb';
import { TextureGrid } from '../components/TextureGrid';
import { TextureThumb } from '../components/TextureThumb';

import { useGameFile } from '../store/gameFile';

import { gbgIdFormat } from '../../core/utils';
import dateFormat from 'date-fns/format'; 

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
    console.log(loadGameWithIdx(gameIdx));
  }, [gameIdx]);  

  const history = useHistory();

  const loadTexture = useCallback((idx: number) => {
    history.push(`/game/${ gameIdx }/texture/${ idx }`);
  }, [gameIdx]);

  return (
    <div className={ styles.root }>
      <div className={ styles.side }>
        { isGameLoaded && (
          <div>
            <GameThumb thumbnail={ game.thumbnail }/>
            <div>{ meta.gameTitle }</div>
            <div>Game ID: { gbgIdFormat(meta.gameId) }</div>
            <div>Favorite: TODO</div>
            <div>Locked: TODO</div>
            <div>Downloaded: TODO</div>
            <div>Game ID history: TODO</div>
            <div>Programmer Name: { meta.programmerName }</div>
            <div>Programmer ID: { gbgIdFormat(meta.programmerId) }</div>
            <div>Created: { dateFormat(meta.created, 'P hh:mm') }</div>
            <div>Modified: { dateFormat(meta.modified, 'P hh:mm') }</div>
            <div>Textures: { textures.length }/128</div>
            <div>Nodon: { meta.nodonCount }/512</div>
            <div>Connections: { meta.connectionCount }/1024</div>
          </div>
        )}
      </div>
      <div className={ styles.main }>
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