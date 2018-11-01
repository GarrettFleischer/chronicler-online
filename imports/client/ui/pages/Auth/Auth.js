import PropTypes from 'prop-types';
import React from 'react';
import { Paper, withStyles } from '@material-ui/core';
import { Page } from '../Page';
import { Login } from './Login';
import { Register } from './Register';


const styles = (theme) => ({
  wrapper: {
    width: '80vw',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  margin: { margin: theme.spacing.unit * 2 },
});


const AuthUI = ({ classes, login, register }) => (
  <Page>
    <Paper className={classes.wrapper}>
      <div className={classes.margin}>
        {login && <Login />}
        {register && <Register />}
      </div>
    </Paper>
  </Page>
);

AuthUI.propTypes = {
  classes: PropTypes.object.isRequired,
  login: PropTypes.bool,
  register: PropTypes.bool,
};

AuthUI.defaultProps = {
  login: false,
  register: false,
};

export const Auth = withStyles(styles)(AuthUI);
