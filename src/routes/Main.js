import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from '../components/home/index';
import NotFound from '../components/NotFound';
import Node from '../containers/Node';


const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/node/:id" component={Node} />
      <Route component={NotFound} />
    </Switch>
  </main>
);

export default Main;