import PropTypes from 'prop-types';
import React from 'react';
import { ButtonBase, Card } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';


const styles = {
  buttonStyle: {
    height: 'auto',
    width: '100%',
    margin: '0px',
    padding: '0px',
  },
  cardStyle: {
    width: '100%',
    height: 'auto',
    flex: '1',
  },
};

const ClickableCardUI = ({ classes, children, style }) => (
  <ButtonBase className={classes.buttonStyle} style={style}>
    <Card className={classes.cardStyle} style={style}>
      {children}
    </Card>
  </ButtonBase>
);

ClickableCardUI.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

ClickableCardUI.defaultProps = { style: {} };


export const ClickableCard = withStyles(styles)(ClickableCardUI);
