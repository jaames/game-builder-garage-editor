import React, { useState, useEffect } from 'react';
import {Texture } from '../../objects';

import styles from '../styles/TextureThumb.module.scss';

interface Props {
  texture: Texture;
  idx?: number;
  onClick?: (idx: number) => any;
}

export const TextureThumb: React.FunctionComponent<Props> = (props) => {
  const [url, setUrl] = useState<string>('');
  
  useEffect(() => {
    if (url) {
      setUrl('');
      URL.revokeObjectURL(url);
    }
    setUrl(props.texture.getUrl());
    return () => {
      if (url) {
        setUrl('');
        URL.revokeObjectURL(url);
      }
    }
  }, [props.texture]);

  return (
    <div className={ styles.root } onClick={ e => props.onClick(props.idx) }>
      <div className={ styles.image } style={{ backgroundImage: `url(${ url })` }} />
    </div>
  );
}

TextureThumb.defaultProps = {
  onClick: () => {}
};