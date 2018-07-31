import PropTypes from 'prop-types';
import React from 'react';
import { ButtonBase, Button, Card } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    margin: 0,
    padding: 0,
  },
};

const DelayedButtonUI = ({ classes, children, width, height, onClick }) => (
  <Button variant="outlined" color="primary" className={classes.root} style={{ width, height }} onClick={() => setTimeout(onClick, 300)}>
    {/* <Card style={{ width, height }}> */}
    {children}
    {/* </Card> */}
  </Button>
);

DelayedButtonUI.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export const DelayedButton = withStyles(styles)(DelayedButtonUI);
