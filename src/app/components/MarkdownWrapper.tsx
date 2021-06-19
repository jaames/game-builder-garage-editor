import React from 'react';

import styles from '../styles/Markdown.module.scss';

export const MarkdownWrapper: React.FunctionComponent = ({ children }) => (
  <div className={ styles.root }>
    { children }
  </div>
);