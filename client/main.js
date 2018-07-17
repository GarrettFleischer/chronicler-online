import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
// eslint-disable-next-line no-unused-vars
import main from './main.html';
import App from './screens/App';
import '../imports/startup/client/accountsConfig';


Meteor.startup(() => {
  // noinspection JSUnresolvedVariable, JSUnresolvedFunction
  render(<App />, document.getElementById('app'));
});
