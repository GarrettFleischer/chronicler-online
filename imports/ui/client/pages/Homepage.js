import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Button } from '@material-ui/core';
import { Page } from './Page';


export const Homepage = () => (
  <Page>
    Homepage
    <Button onClick={() => FlowRouter.go('dashboard')}>
      Dashboard
    </Button>
  </Page>
);
