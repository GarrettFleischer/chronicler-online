import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import App from './screens/App';
import main from './main.html';

Meteor.startup(() => {
  render(<App/>, document.getElementById('app'));
});
