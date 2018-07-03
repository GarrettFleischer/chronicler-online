import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from '../components/NotFound';
import Dashboard from '../pages/Dashboard';
import HomePage from '../pages/HomePage';
import Login from '../pages/Login';
import Node from '../pages/Node';
import Project from '../pages/Project';
import Scene from '../pages/Scene';

// TODO make Project component
const MainRoute = () => (
  <main>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/login" component={Login} />
      <Route path="/project/:id" component={Project} />
      <Route path="/scene/:id" component={Scene} />
      <Route path="/node/:id" component={Node} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  </main>
);

export default MainRoute;
