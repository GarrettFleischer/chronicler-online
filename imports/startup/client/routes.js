import { FlowRouter } from 'meteor/kadira:flow-router';
import React from 'react';
import { mount } from 'react-mounter';

import { AppLayout } from '../../ui/AppLayout';
import { Homepage } from '../../ui/pages/Homepage';
import { Scene } from '../../ui/pages/Scene';


FlowRouter.route('/', {
  name: 'homepage',
  action() {
    mount(AppLayout, {
      content: <Homepage />,
    });
  },
});

FlowRouter.route('/scene/:id', {
  name: 'scene',
  action() {
    mount(AppLayout, {
      content: <Scene />,
    });
  },
});
