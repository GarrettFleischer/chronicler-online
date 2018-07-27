import PropTypes from 'prop-types';
import React from 'react';
import { MuiThemeProvider, Slide } from '@material-ui/core';
import { Header } from './Header';
import { theme } from '../../styles';


export const AppLayout = ({ content }) => (
  <MuiThemeProvider theme={theme}>
    <Header />
    <Slide key={Date.now()} in direction="right" mountOnEnter unmountOnExit timeout={400}>
      {content}
    </Slide>
  </MuiThemeProvider>
);

AppLayout.propTypes = { content: PropTypes.node.isRequired };
