import React, { useRef, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { useTextureCtx } from '../store/textureCtx';

import { TextureEditCanvas } from '../components/TextureEditCanvas';

import styles from '../styles/TextureEdit.module.scss';

interface Props extends RouteComponentProps<{ gameIdx: string, textureIdx: string }> {};

export const TextureEdit: React.FunctionComponent<Props> = (props) => {
  const gameIdx = parseInt(props.match.params.gameIdx);
  const textureIdx = parseInt(props.match.params.textureIdx);
  const loadTextureWithIdx = useTextureCtx(state => state.loadTextureWithIdx);

  useEffect(() => {
    loadTextureWithIdx(textureIdx);
  }, [gameIdx, textureIdx]);

  return (
    <div className={ styles.root }>
      <TextureEditCanvas/>
    </div>
  );
}