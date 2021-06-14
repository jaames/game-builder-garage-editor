import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { SavedataContextProvider } from './context/SavedataContext';
import { GameEditorContextProvider } from './context/GameEditorContext';

import { Index } from './routes/Index';
import { GameView } from './routes/GameView';

export default function App() {
  return (
    <BrowserRouter>
      <SavedataContextProvider>
        <GameEditorContextProvider>
          <Switch>
            <Route exact path="/" component={ Index }/>
            <Route path="/game/:gameIdx" component={ GameView }/>
            {/* <Route path="/game/:gameIdx/texture/:texIdx" component={ GameTextureEditor }/> */}
          </Switch>
        </GameEditorContextProvider>
      </SavedataContextProvider>
    </BrowserRouter>
  );
}