import React from 'react';
import { Link } from 'react-router-dom';

import styles from '../styles/Header.module.scss';

export const Header: React.FunctionComponent = () => (
  <header className={ styles.root }>
    <div className={ styles.wrapper }>
      <div className={ styles.groupLeft }>
        <Link to="/">👀</Link>
        (back button?)
      </div>
      <div className={ styles.groupRight }>
        "Download changes" button appears here
      </div>
    </div>
  </header>
)