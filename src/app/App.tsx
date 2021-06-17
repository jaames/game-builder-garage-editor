import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { IndexPage } from './routes/IndexPage';
import { GameView } from './routes/GameView';

import './styles/global.scss';

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header/>
        <div className="Main">
          <Switch>
            <Route exact path="/" component={ IndexPage }/>
            <Route path="/game/:gameIdx" component={ GameView }/>
            {/* <Route path="/game/:gameIdx/texture/:texIdx" component={ GameTextureEditor }/> */}
          </Switch>
        </div>
        <Footer/>
      </div>
    </BrowserRouter>
  );
}