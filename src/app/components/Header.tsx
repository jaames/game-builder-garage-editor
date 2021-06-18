import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import styles from '../styles/Header.module.scss';

export const Header: React.FunctionComponent = () => { 

  const history = useHistory();

  return (
    <header className={ styles.root }>
      <div className={ styles.wrapper }>
        <div className={ styles.groupLeft }>
          <Link to="/">👀</Link>
          <span onClick={ () => history.goBack() }>(back)</span>
        </div>
        <div className={ styles.groupRight }>
          "Download changes" button appears here
        </div>
      </div>
    </header>
  );
}