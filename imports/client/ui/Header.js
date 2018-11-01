import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { AccountsUIWrapper } from './AccountsUIWrapper';


const styles = {
  root: { flexGrow: 1 },
  flex: { flexGrow: 1 },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

const HeaderUI = ({ classes }) => (
  <div className={classes.root}>
    <AppBar position="static">
      <Toolbar>
        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="title" color="inherit" className={classes.flex}>
          Chronicler
        </Typography>
        <AccountsUIWrapper />
      </Toolbar>
    </AppBar>
  </div>
);


HeaderUI.propTypes = { classes: PropTypes.object.isRequired };

export const Header = withStyles(styles)(HeaderUI);
