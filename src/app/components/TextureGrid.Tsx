import React from 'react';

import styles from '../styles/TextureGrid.module.scss';

export const TextureGrid: React.FunctionComponent = ({ children }) => (
  <div className={ styles.root }>
    { children }
  </div>
);