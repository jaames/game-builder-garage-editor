import React, { useEffect, useRef, useCallback } from 'react';
import { useTextureCtx } from '../store/textureCtx';
import { TextureEditor } from '../editor';

import { ReactComponent as IconUndo } from '../graphics/iconUndo.svg';
import { ReactComponent as IconRedo } from '../graphics/iconRedo.svg';
import { ReactComponent as IconZoomIn } from '../graphics/iconZoomIn.svg';
import { ReactComponent as IconZoomOut } from '../graphics/iconZoomOut.svg';

import styles from '../styles/TextureEditCanvas.module.scss';

const editor = new TextureEditor();

const ZOOM_MIN = 1;
const ZOOM_MAX = 40;

// for debug
(window as any).textureEditor = editor;

export const TextureEditCanvas: React.FunctionComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const idx = useTextureCtx(state => state.idx);
  const viewZoom = useTextureCtx(state => state.viewZoom);
  // TODO: zoom is super slow?
  const setZoom = useCallback((zoom: number) => {
    if (zoom < ZOOM_MIN)
      zoom = ZOOM_MIN;
    if (zoom > ZOOM_MAX)
      zoom = ZOOM_MAX;
    useTextureCtx.setState({ viewZoom: zoom });
  }, []);
  const [undo, redo] = useTextureCtx(state => [state.undo, state.redo]);
  const [canUndo, canRedo] = useTextureCtx(state => [state.canUndo, state.canRedo]);
  
  useEffect(() => {
    editor.setRenderDst(canvasRef.current);
  }, [idx]);

  return (
    <div>
      <div className={ styles.controls }>
        <div className={ styles.history }>
          <div className={ `${ styles.icon } ${ (!canUndo) && styles.iconDisabled }` } onClick={ () => undo() }>
            <IconUndo/>
          </div>
          <div className={ `${ styles.icon } ${ (!canRedo) && styles.iconDisabled }` } onClick={ () => redo() }>
            <IconRedo/>
          </div>
        </div>
        <div className={ styles.zoomControl }>
          <IconZoomOut onClick={ () => setZoom(viewZoom - 1) }/>
          <span className={ styles.zoomIndicator }>
            { viewZoom }x
          </span>
          <IconZoomIn onClick={ () => setZoom(viewZoom + 1) }/>
        </div>
      </div>
      <canvas
        className={ styles.canvas }
        ref={ canvasRef }
        onMouseMove={ (e) => editor.onInputMove(e as any as MouseEvent) }
        onMouseDown={ (e) => editor.onInputDown(e as any as MouseEvent) }
      />
    </div>
  );
}