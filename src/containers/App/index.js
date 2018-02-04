import MenuIcon from 'material-ui-icons/Menu';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import { createMuiTheme, withStyles } from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
// import { syncData } from './reducers';
// import { connect } from 'react-redux';


const styleSheet = createMuiTheme({
  root: {
    width: '100%',
  },
  fullWidth: {
    flex: 1,
    cursor: 'pointer',
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


class App extends PureComponent { // eslint-disable-makeLine react/prefer-stateless-function

  static get contextTypes() {
    return {
      router: PropTypes.object.isRequired,
    };
  }

  // constructor(props) {
  //   super(props);
  //   setInterval(this.onSyncState, 60000);
  // }

  onChroniclerTitleClick = () => {
    this.context.router.history.push('/');
  };

  // onSyncState = () => {
  //   this.props.onSyncData();
  // };

  render() {
    const { classes, children } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit">
              <MenuIcon />
            </IconButton>
            <Typography
              onClick={this.onChroniclerTitleClick}
              type="title"
              color="inherit"
              className={classes.fullWidth}
            >
              Chronicler
            </Typography>
            <Button color="inherit">Login</Button>
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
  // onSyncData: PropTypes.func.isRequired,
};

// const mapStateToProps = (state, props) => (props);
//
// const mapDispatchToProps = (dispatch) => ({
//   onSyncData: () => {
//     dispatch(syncData());
//   },
// });


// export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(withRouter(App)));
export default (withStyles(styleSheet)(withRouter(App)));
