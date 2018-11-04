import React, { Component as ReactComponent } from 'react';
import { Button, IconButton, TextField, InputAdornment } from '@material-ui/core';
import { Accounts } from 'meteor/accounts-base';
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


class RegisterUI extends ReactComponent {
  state = { showPassword: false };

  toggleShowPassword = () => {
    const { showPassword } = this.state;
    this.setState({ showPassword: !showPassword });
  };

  submit = (values) => {
    Accounts.createUser(values);
  };


  render() {
    const { showPassword } = this.state;
    const { classes } = this.props;

    return (
      <MaterialUIForm className={classes.root} onSubmit={this.submit}>
        <TextField
          className={classes.margin}
          type="text"
          autoComplete="username"
          autoFocus
          label="Username"
          name="username"
          value=""
          data-validators="isAlphanumeric"
          fullWidth
          required
        />
        <TextField
          className={classes.margin}
          type="text"
          autoComplete="email"
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
          Register
        </Button>
      </MaterialUIForm>
    );
  }
}


RegisterUI.propTypes = { classes: PropTypes.object.isRequired };

export const Register = withStyles(styles)(RegisterUI);
