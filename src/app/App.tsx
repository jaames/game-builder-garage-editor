import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { IndexPage } from './routes/IndexPage';
import { FaqPage } from './routes/FaqPage';
import { GameView } from './routes/GameView';
import { TextureEditView } from './routes/TextureEditView';
import { ModelView } from './routes/ModelView';
import { GraphView } from './routes/GraphView';

import './styles/global.scss';

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/game/:gameIdx/texture/:textureIdx" component={ TextureEditView }/>
        <Route path="/game/:gameIdx" component={ GameView }/>
        <Route path="/graph/:gameIdx" component={ GraphView }/>
        <Route path="/3d/:gameIdx" component={ ModelView }/>
        <Route exact path="/about" component={ FaqPage }/>
        <Route exact path="/" component={ IndexPage }/>
      </Switch>
    </BrowserRouter>
  );
}