import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { Index } from './routes/Index';
import { GameView } from './routes/GameView';

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={ Index }/>
        <Route path="/game/:gameIdx" component={ GameView }/>
        {/* <Route path="/game/:gameIdx/texture/:texIdx" component={ GameTextureEditor }/> */}
      </Switch>
    </BrowserRouter>
  );
}