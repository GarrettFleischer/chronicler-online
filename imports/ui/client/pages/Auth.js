import React from 'react';
import PropTypes from 'prop-types';
import { AccountsReactComponent } from 'meteor/meteoreact:accounts';
import { Page } from './Page';

export const Auth = ({ state }) => (
  <Page>
    <AccountsReactComponent state={state} />
  </Page>
);

Auth.propTypes = { state: PropTypes.string.isRequired };
