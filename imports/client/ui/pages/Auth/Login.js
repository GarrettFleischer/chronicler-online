import React, { Component as ReactComponent } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, IconButton, TextField, InputAdornment } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import MaterialUIForm from 'material-ui-form';
import PropTypes from 'prop-types';


const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  margin: { margin: theme.spacing.unit },
});


class LoginUI extends ReactComponent {
  state = { showPassword: false };

  toggleShowPassword = () => {
    const { showPassword } = this.state;
    this.setState({ showPassword: !showPassword });
  };

  submit = (values) => {
    console.log('values: ', values);
    Meteor.loginWithPassword(values.email, values.password);
  };


  render() {
    const { showPassword } = this.state;
    const { classes } = this.props;

    return (
      <MaterialUIForm className={classes.root} onSubmit={this.submit}>
        <TextField
          className={classes.margin}
          type="text"
          autoComplete="email"
          autoFocus
          label="Email"
          name="email"
          value=""
          data-validators="isEmail"
          fullWidth
          required
        />
        <TextField
          className={classes.margin}
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          label="Password"
          name="password"
          value=""
          data-validators={[{
            isLength: {
              min: 8,
              max: 25,
            },
          }]}
          fullWidth
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={this.toggleShowPassword}>
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button className={classes.margin} type="submit" variant="outlined">
          Login
        </Button>
      </MaterialUIForm>
    );
  }
}


LoginUI.propTypes = { classes: PropTypes.object.isRequired };

export const Login = withStyles(styles)(LoginUI);
