import PropTypes from 'prop-types';
import React from 'react';
import { Paper, Button, withStyles } from '@material-ui/core';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Page } from '../Page';
import { Login } from './Login';
import { Register } from './Register';


const styles = (theme) => ({
  wrapper: {
    width: '80vw',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  flexWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  margin: { margin: theme.spacing.unit * 2 },
});

const goToLoginOrRegister = (login) => () => {
  if (login) {
    FlowRouter.go('register');
  } else {
    FlowRouter.go('login');
  }
};

const AuthUI = ({ classes, login, register }) => (
  <Page>
    <Paper className={classes.wrapper}>
      <div className={classes.margin}>
        {login && <Login />}
        {register && <Register />}
      </div>
      <div className={classes.flexWrapper}>
        {(login || register) && (
          <Button disableFocusRipple disableRipple style={{ textTransform: 'none' }} variant="text" onClick={goToLoginOrRegister(login)}>
            {login ? 'Register?' : 'Login?'}
          </Button>
        )}
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
