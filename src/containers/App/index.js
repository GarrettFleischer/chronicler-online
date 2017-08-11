import MenuIcon from 'material-ui-icons/Menu';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import { createStyleSheet, withStyles } from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';


const styleSheet = createStyleSheet({
  root: {
    width: '100%',
  },
  fullWidth: {
    flex: 1,
  },
  sidebar: {
    flex: 1,
    width: '10%',
  },
  body: {
    flexGrow: 1,
    marginTop: 30,
  },
});


class App extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { classes, children } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit">
              <MenuIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.fullWidth}>
              Chronicler
            </Typography>
            <Button color="contrast">Login</Button>
          </Toolbar>
        </AppBar>
        <div className={classes.body}>
          <Grid container>
            <Grid item xs />
            <Grid item xs={8}>
              {children}
            </Grid>
            <Grid item xs />
          </Grid>
        </div>
      </div>
    );
  }

}


App.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
};


export default withStyles(styleSheet)(withRouter(App));
