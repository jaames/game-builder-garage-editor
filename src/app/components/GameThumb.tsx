import React, { useState, useRef, useEffect,  useCallback } from 'react';
import { GameThumbnail } from '../../formats';

import styles from '../styles/GameThumb.module.scss';

interface Props {
  thumbnail: GameThumbnail;
  idx?: number;
  gameTitle?: string;
  gameId?: string;
  onClick?: (idx: number) => any;
  imageOnly?: boolean;
}

export const GameThumb: React.FunctionComponent<Props> = (props) => {
  const [url, setUrl] = useState<string | null>('');
  
  useEffect(() => {
    const url = props.thumbnail.getUrl();
    setUrl(url);

    return () => {
      URL.revokeObjectURL(url);
      setUrl(null);
    }
  }, [props.thumbnail]);

  return (
    <div className={ styles.root } onClick={ e => props.onClick(props.idx) }>
      { (!props.imageOnly) && 
        <h5 className={ styles.title }>{ props.gameTitle }</h5>
      }
      <div className={ `${ styles.image } ${ (!props.imageOnly) && styles.imageHoverable }` } style={{ backgroundImage: `url(${ url })` }} />
    </div>
  );
}

GameThumb.defaultProps = {
  onClick: () => {}
};