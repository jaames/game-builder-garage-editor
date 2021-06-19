import React, { useState, useEffect } from 'react';
import { GameThumbnail } from '../../core/GameFile';

import styles from '../styles/GameThumb.module.scss';

interface Props {
  thumbnail: GameThumbnail;
  idx?: number;
  gameTitle?: string;
  gameId?: string;
  onClick?: (idx: number) => any;
}

export const GameThumb: React.FunctionComponent<Props> = (props) => {
  const [url, setUrl] = useState<string>('');
  
  useEffect(() => {
    if (url) {
      setUrl('');
      URL.revokeObjectURL(url);
    }
    setUrl(props.thumbnail.getUrl());
    return () => {
      if (url) {
        setUrl('');
        URL.revokeObjectURL(url);
      }
    }
  }, [props.gameTitle]);

  return (
    <div className={ styles.root } onClick={ e => props.onClick(props.idx) }>
      { props.gameTitle && 
        <h5 className={ styles.title }>{ props.gameTitle }</h5>
      }
      <div className={ styles.image } style={{ backgroundImage: `url(${ url })` }} />
    </div>
  );
}

GameThumb.defaultProps = {
  onClick: () => {}
};