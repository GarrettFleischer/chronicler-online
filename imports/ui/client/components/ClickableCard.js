import PropTypes from 'prop-types';
import React from 'react';
import { ButtonBase, Card } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    margin: 0,
    padding: 0,
  },
};

const ClickableCardUI = ({ classes, children, width, height, onClick }) => (
  <ButtonBase className={classes.root} style={{ width, height }} onClick={() => setTimeout(onClick, 300)}>
    <Card style={{ width, height }}>
      {children}
    </Card>
  </ButtonBase>
);

ClickableCardUI.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export const ClickableCard = withStyles(styles)(ClickableCardUI);
