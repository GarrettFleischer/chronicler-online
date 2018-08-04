import React from 'react';
import PropTypes from 'prop-types';
import { AccountsReactComponent } from 'meteor/meteoreact:accounts';
import { PaperPage } from './PaperPage';

export const Auth = ({ state }) => (
  <PaperPage>
    <AccountsReactComponent state={state} />
  </PaperPage>
);

Auth.propTypes = { state: PropTypes.string.isRequired };
