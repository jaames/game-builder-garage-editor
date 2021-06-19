import React from 'react';

import styles from '../styles/Footer.module.scss';

export const Footer: React.FunctionComponent = () => (
  <footer className={ styles.root }>
    <div className={ styles.transition }></div>
    <div className={ styles.body }>
      <div className={ styles.wrapper }>
        <div className={ styles.info }>
          <h5>Game&nbsp;Builder&nbsp;Garage Save Editor v{__VERSION__}</h5>
          Built by <a className="link" href="//github.com/jaames">Jaames</a>, source code on <a className="link" href="//github.com/jaames/">GitHub</a>
        </div>
        <p className={ styles.disclaimer }>
          Game&nbsp;Builder&nbsp;Garage is &copy; Nintendo&nbsp;Co.,&nbsp;Ltd.<br/>
          This project is not affiliated with or endorsed by Nintendo in any way.
        </p>
      </div>
    </div>
  </footer>
)