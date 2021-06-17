import React from 'react';

import styles from '../styles/GameThumbGrid.module.scss';

export const GameThumbGrid: React.FunctionComponent = ({ children }) => (
  <div className={ styles.root }>
    { children }
  </div>
);