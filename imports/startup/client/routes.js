import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import React from 'react';
import { mount } from 'react-mounter';

import { AppLayout } from '../../ui/client/components/app/AppLayout';
import { Dashboard } from '../../ui/client/pages/Dashboard';
import { Homepage } from '../../ui/client/pages/Homepage';
import { Login } from '../../ui/client/pages/Login';
import { Project } from '../../ui/client/pages/Project';
import { Scene } from '../../ui/client/pages/Scene';
import { Node } from '../../ui/client/pages/Node';

const keyRedirectAfterLogin = 'redirectAfterLogin';

Accounts.onLogin(() => {
  const path = Session.get(keyRedirectAfterLogin);
  const { route } = FlowRouter.current();
  Session.set(keyRedirectAfterLogin, undefined);

  if (path) FlowRouter.go(path);
  else if (route.name === 'login') FlowRouter.go('dashboard');
});

Accounts.onLogout(() => {
  FlowRouter.go('homepage');
});

const exposed = FlowRouter.group({});

const auth = FlowRouter.group({
  triggersEnter: [() => {
    if (!(Meteor.loggingIn() || Meteor.userId())) {
      const route = FlowRouter.current();
      if (route.route.name !== 'login') Session.set(keyRedirectAfterLogin, route.path);
      FlowRouter.go('login');
    }
  }],
});

exposed.route('/', {
  name: 'homepage',
  action() {
    mount(AppLayout, { content: <Homepage /> });
  },
});

exposed.route('/login', {
  name: 'login',
  action() {
    mount(AppLayout, { content: <Login /> });
  },
});

auth.route('/dashboard', {
  name: 'dashboard',
  action() {
    mount(AppLayout, { content: <Dashboard /> });
  },
});

auth.route('/project/:id', {
  name: 'project',
  action() {
    mount(AppLayout, { content: <Project /> });
  },
});

auth.route('/scene/:id', {
  name: 'scene',
  action() {
    mount(AppLayout, { content: <Scene /> });
  },
});

auth.route('/node/:id', {
  name: 'node',
  action() {
    mount(AppLayout, { content: <Node /> });
  },
});
