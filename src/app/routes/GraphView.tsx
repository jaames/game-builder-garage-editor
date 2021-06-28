import React, { useRef, useEffect } from 'react';
import { RouteComponentProps, useHistory } from 'react-router';

import { GraphRenderer } from '../../renderers';

import { useGameFile } from '../store/gameFile';

import styles from '../styles/ModelView.module.scss';

interface Props extends RouteComponentProps<{ gameIdx: string }> {};

export const GraphView: React.FunctionComponent<Props> = (props) => {

  const gameIdx = useGameFile(state => state.fileIdx);
  const game = useGameFile(state => state.game);
  const renderer = useRef<GraphRenderer>();
  const rendererRoot = useRef<HTMLDivElement>();

  useEffect(() => {
    if (rendererRoot.current)
      renderer.current = new GraphRenderer(rendererRoot.current);
      
    return () => {
      // renderer.current.disposeAll();
    }
  }, [rendererRoot]);

  useEffect(() => {
    if (renderer.current)
      renderer.current.loadGame(game);

    return () => {
      // renderer.current.disposeAll();
    }
  }, [gameIdx, renderer, rendererRoot]);

  return (
    <div className={ styles.root } ref={ rendererRoot }></div>
  );
}