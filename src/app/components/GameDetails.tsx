import React from 'react';
import { useAsync } from 'react-async-hook';
import dateFormat from 'date-fns/format'; 

import { GameFile } from '../../formats';
import {
  gbgIdFormat,
  mggGetUserMatchingGameFile,
  mggGetGameMatchingGameFile, // TODO: wait for api fix
  mggGetUserUrl,
  mggGetGameUrl,
} from '../../utils';

import { GameThumb } from './GameThumb';

import { ReactComponent as IconAuthor } from '../graphics/iconAuthorFull.svg';
import { ReactComponent as IconTexture } from '../graphics/iconTexture.svg';
import { ReactComponent as IconNodon } from '../graphics/iconNodon.svg';
import { ReactComponent as IconConnection } from '../graphics/iconConnection.svg';
import { ReactComponent as IconLockOn } from '../graphics/iconLockOn.svg';
import { ReactComponent as IconLockOff } from '../graphics/iconLockOff.svg';
import { ReactComponent as IconFavorite } from '../graphics/iconFavorite.svg';

import styles from '../styles/GameDetails.module.scss';

interface GameDetailsProps {
  game: GameFile;
};

export const GameDetails: React.FunctionComponent<GameDetailsProps> = ({ game }) => {
  const meta = game.meta;
  const mggUser = useAsync(mggGetUserMatchingGameFile, [game, meta.gameId]);
  // const mggGame = useAsync(mggGetGameMatchingGameFile, [game]);

  return (
    <div className={ styles.root }>
      <GameThumb thumbnail={ meta.thumbnail } imageOnly={ true }/>
      <h3 className={ styles.title }>{ meta.name }</h3>
      <div className={ styles.body }>
        { meta.isDownload && (
          <div className={ styles.programmer }>
            <div className={ styles.programmer__icon }>
              <IconAuthor/>
            </div>
            <div className={ styles.programmer__details }>
              <span className={ styles.programmer__name }>{ meta.authorName }</span>
              <span className={ styles.programmer__id }>{ gbgIdFormat(meta.authorId) }</span>
            </div>
          </div>
        )}
        <GameDetailItem name="Game ID" value={ gbgIdFormat(meta.gameId) }/>
        <GameDetailItem name="Original ID" value={ gbgIdFormat(meta.originId) } isVisible={ meta.originId !== '' }/>
        <GameDetailItem name="Favorite">
          <IconFavorite className={`${ styles.iconFavorite } ${ (!meta.isFavorite) && styles.iconFavoriteOff }`}/>
        </GameDetailItem>
        <GameDetailItem name="Lock">
          { meta.isFileLock ? <IconLockOn/> : <IconLockOff/> }
        </GameDetailItem>
        <GameDetailItem name="Created" value={ dateFormat(meta.createTime, 'P hh:mm') }/>
        <GameDetailItem name="Updated" value={ dateFormat(meta.editTime, 'P hh:mm') }/>
        <div className={ styles.statList }>
          <div className={ styles.stat }>
            <IconTexture className={ styles.stat__icon }/>
            <span className={ styles.stat__counter }>{ game.textures.length }/128</span>
          </div>
          <div className={ styles.stat }>
            <IconNodon className={ styles.stat__icon }/>
            <span className={ styles.stat__counter }>{ meta.numNodon }/512</span>
          </div>
          <div className={ styles.stat }>
            <IconConnection className={ styles.stat__icon }/>
            <span className={ styles.stat__counter }>{ meta.numConnections }/1024</span>
          </div>
        </div>
        {/* TODO: make this look nice */}
        {/* { mggUser.result && (
          <div className={ styles.mggUser } >
            <a
              className={ styles.mggUser__icon }
              href={ mggGetUserUrl(mggUser.result) }
              target="_blank"
            >
              <img src={ mggUser.result.avatarFileName }/>
            </a>
            <div className={ styles.mggUser__details }>
              <a
                className={ styles.mggUser__name }
                href={ mggGetUserUrl(mggUser.result) }
                target="_blank"
              >
                { mggUser.result.username }
              </a>
              <div>{ mggUser.result.socialDiscord }</div>
              <div>{ mggUser.result.socialTwitter }</div>
              <div>{ mggUser.result.socialYouTube }</div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}

interface GameDetailItemProps {
  name: string,
  value?: string,
  isVisible?: boolean
};

const GameDetailItem: React.FunctionComponent<GameDetailItemProps> = ({ name, value, isVisible, children }) => (
  isVisible && (
    <div className={ styles.detailItem }>
      <span className={ styles.detailItem__name }>{ name }</span>
      {value !== '' && (
        <span className={ styles.detailItem__value }>{ value }</span>
      )}
      {value === '' && (
        <div className={ styles.detailItem__value }>{ children }</div>
      )}
    </div>
  )
);

GameDetailItem.defaultProps = {
  value: '',
  isVisible: true,
};