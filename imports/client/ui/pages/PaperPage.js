import PropTypes from 'prop-types';
import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import { Header } from '../Header';


export const PaperPage = ({ children }) => (
  <div style={{ height: '100%' }}>
    <Header />
    <Grid container>
      <Grid item xs />
      <Grid item xs={9}>
        <Paper style={{ padding: 16, paddingBottom: 36, width: '100%' }}>
          {children}
        </Paper>
      </Grid>
      <Grid item xs />
    </Grid>
  </div>
);

PaperPage.propTypes = { children: PropTypes.node.isRequired };
