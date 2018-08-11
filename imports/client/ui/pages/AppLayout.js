import PropTypes from 'prop-types';
import React from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { theme } from '../theme';


export const AppLayout = ({ content }) => (
  <MuiThemeProvider theme={theme}>
    {content}
  </MuiThemeProvider>
);

AppLayout.propTypes = { content: PropTypes.node.isRequired };
