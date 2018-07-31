import PropTypes from 'prop-types';
import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import { Header } from '../components/app/Header';


export const PaperPage = ({ children }) => (
  <div style={{ height: '100%' }}>
    <Header />
    <Grid container style={{ height: '100%' }}>
      <Grid item xs />
      <Grid item xs={9} style={{ height: '100%' }}>
        <Paper
          style={{
            padding: 16,
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </Paper>
      </Grid>
      <Grid item xs />
    </Grid>
  </div>
);

PaperPage.propTypes = { children: PropTypes.node.isRequired };
