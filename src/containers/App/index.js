import AppBar from 'material-ui/AppBar';
import Grid from 'material-ui/Grid';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';


class App extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { children } = this.props;

    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography type="title" color="inherit">
              Chronicler
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container gutter={8}>
          <Grid item xs={2} />
          <Grid item xs={8}>
            {children}
          </Grid>
          <Grid item xs={2} />
        </Grid>
      </div>
    );
  }

}


App.propTypes = {
  children: PropTypes.node,
};


export default withRouter(App);