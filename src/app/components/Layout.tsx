import React from 'react';

import { Header } from './Header';
import { Footer } from './Footer';

export const Layout: React.FunctionComponent = ({ children }) => (
  <div className="App">
    <Header/>
    <div className="Main">
      { children }
    </div>
    <Footer/>
  </div>
)