import React, { useRef, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { useTextureCtx } from '../store/textureCtx';

import { TextureEditCanvas } from '../components/TextureEditCanvas';
import { PalettePicker } from '../components/PalettePicker';

import styles from '../styles/TextureEdit.module.scss';

interface Props extends RouteComponentProps<{ gameIdx: string, textureIdx: string }> {};

export const TextureEdit: React.FunctionComponent<Props> = (props) => {
  const gameIdx = parseInt(props.match.params.gameIdx);
  const textureIdx = parseInt(props.match.params.textureIdx);
  const loadTextureWithIdx = useTextureCtx(state => state.loadTextureWithIdx);
  const editor = useTextureCtx(state => state.editor);

  useEffect(() => {
    loadTextureWithIdx(textureIdx);
  }, [gameIdx, textureIdx]);

  return (
    <div className={ styles.root }>
      <TextureEditCanvas/>
      <PalettePicker onClick={ (idx) => { editor.setToolColor(idx) } }/>
    </div>
  );
}