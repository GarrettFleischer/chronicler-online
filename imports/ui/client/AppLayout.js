import PropTypes from 'prop-types';
import React from 'react';
import { AccountsUIWrapper } from './AccountsUIWrapper';

export const AppLayout = ({ content }) => (
  <div>
    <AccountsUIWrapper />
    {content}
  </div>
);

AppLayout.propTypes = { content: PropTypes.node.isRequired };
