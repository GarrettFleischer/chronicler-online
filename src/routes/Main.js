import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from '../components/HomePage';
import NotFound from '../components/NotFound';
import Node from '../containers/Node';
import Scene from '../containers/Scene';
import Dashboard from '../containers/Dashboard';
import Project from '../containers/Project';

// TODO make Project component
const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/project/:id" component={Project} />
      <Route path="/scene/:id" component={Scene} />
      <Route path="/node/:id" component={Node} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  </main>
);

export default Main;
