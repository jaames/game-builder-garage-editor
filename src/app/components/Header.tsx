import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import styles from '../styles/Header.module.scss';

export const Header: React.FunctionComponent = () => { 
  const [canGoBack, setCanGoBack] = useState(false);
  const history = useHistory();
  const loc = useLocation();

  useEffect(() => {
    setCanGoBack(loc.pathname !== '/');
  }, [loc]);

  return (
    <header className={ styles.root }>
      {/* <div className={ styles.wrapper }>
        <div className={ styles.groupLeft }>
          {canGoBack && (
            <span className={ styles.backButton } onClick={ () => history.goBack() }>←</span>
          )}
          <Link className={ styles.item } to="/">👀</Link>
          <Link className={ styles.item } to="/about">About</Link>
        </div>
        <div className={ styles.groupRight }>
          <span className={ styles.item }>
            "Download changes" button appears here
          </span>
        </div>
      </div> */}
    </header>
  );
}