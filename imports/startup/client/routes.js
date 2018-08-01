import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import React from 'react';
import { mount } from 'react-mounter';

import { AppLayout } from '../../ui/client/components/app/AppLayout';
import { Dashboard } from '../../ui/client/pages/Dashboard';
import { Homepage } from '../../ui/client/pages/Homepage';
import { Auth } from '../../ui/client/pages/Auth';
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
    mount(AppLayout, { content: <Auth state="signIn" /> });
  },
});
exposed.route('/register', {
  name: 'register',
  action() {
    mount(AppLayout, { content: <Auth state="signUp" /> });
  },
});
exposed.route('/forgot-password', {
  name: 'forgot-password',
  action() {
    mount(AppLayout, { content: <Auth state="forgotPwd" /> });
  },
});
exposed.route('/change-password', {
  name: 'change-password',
  action() {
    mount(AppLayout, { content: <Auth state="changePwd" /> });
  },
});
exposed.route('/reset-password', {
  name: 'reset-password',
  action() {
    mount(AppLayout, { content: <Auth state="resetPwd" /> });
  },
});
exposed.route('/resend-verification', {
  name: 'resend-verification',
  action() {
    mount(AppLayout, { content: <Auth state="resendVerification" /> });
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
