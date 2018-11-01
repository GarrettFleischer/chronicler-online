import React, { Component as ReactComponent } from 'react';
import { Meteor } from 'meteor/meteor';
import { Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons';


export class Login extends ReactComponent {
  state = {
    email: '',
    password: '',
  };

  loginUser = () => {
    const { email, password } = this.state;
    console.log('login: ', JSON.stringify(Meteor.loginWithPassword(email, password)));
  };

  setEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  setPassword = (e) => {
    this.setState({ password: e.target.value });
  };


  render() {
    const { email, password } = this.state;

    return (
      <React.Fragment>
        <Grid container spacing={8} alignItems="flex-end">
          <Grid item>
            <Face style={{ color: 'white' }} />
          </Grid>
          <Grid item md sm xs>
            <TextField label="Email" type="email" value={email} fullWidth autoFocus required onChange={this.setEmail} />
          </Grid>
        </Grid>
        <Grid container spacing={8} alignItems="flex-end">
          <Grid item>
            <Fingerprint style={{ color: 'white' }} />
          </Grid>
          <Grid item md sm xs>
            <TextField label="Password" type="password" value={password} fullWidth required onChange={this.setPassword} />
          </Grid>
        </Grid>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <FormControlLabel
              control={(
                <Checkbox
                  color="primary"
                />
              )}
              label="Remember me"
            />
          </Grid>
          <Grid item>
            <Button disableFocusRipple disableRipple style={{ textTransform: 'none' }} variant="text" color="primary">
              Forgot password ?
            </Button>
          </Grid>
        </Grid>
        <Grid container justify="center" style={{ marginTop: '10px' }}>
          <Button variant="outlined" color="primary" style={{ textTransform: 'none' }} onClick={this.loginUser}>
            Login
          </Button>
        </Grid>
      </React.Fragment>
    );
  }
}
