import PropTypes from 'prop-types';
import React from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { Header } from './Header';
import { theme } from './styles';


export const AppLayout = ({ content }) => (
  <MuiThemeProvider theme={theme}>
    <Header />
    {content}
  </MuiThemeProvider>
);

AppLayout.propTypes = { content: PropTypes.node.isRequired };
