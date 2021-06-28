import React, { useRef, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { useTextureCtx } from '../store/textureCtx';

import { Layout } from '../components/Layout';
import { TextureEditCanvas } from '../components/TextureEditCanvas';
import { ToolPicker } from '../components/ToolPicker';
import { PalettePicker } from '../components/PalettePicker';

import styles from '../styles/TextureEditView.module.scss';

interface Props extends RouteComponentProps<{ gameIdx: string, textureIdx: string }> {};

export const TextureEditView: React.FunctionComponent<Props> = (props) => {
  const gameIdx = parseInt(props.match.params.gameIdx);
  const textureIdx = parseInt(props.match.params.textureIdx);
  const loadTextureWithIdx = useTextureCtx(state => state.loadTextureWithIdx);
  const setActiveTool = useTextureCtx(state => state.setActiveTool);
  const setToolSize = useTextureCtx(state => state.setToolSize);

  useEffect(() => {
    loadTextureWithIdx(textureIdx);
  }, [gameIdx, textureIdx]);

  return (
    <Layout>
      <div className={ styles.root }>
        <div className={ styles.main }>
          <TextureEditCanvas/>
        </div>
        <div className={ styles.side }>
          <ToolPicker/>
          <PalettePicker/>
        </div>
      </div>
    </Layout>
  );
}