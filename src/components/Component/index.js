/**
 *
 * Component
 *
 */

import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Text from '../Text';
import SetAction from '../SetAction';
import { TEXT, SET } from '../../data/datatypes';
// import Link from '../Link';
// import Choice from '../Choice';

const styleSheet = (theme) => ({
  component: {
    margin: theme.spacing.unit,
  },
});

const UnknownComponent = () => (
  <Card>
    <CardContent>
      <div><FormattedMessage {...messages.unknown} /></div>
    </CardContent>
  </Card>
);

const renderItem = (item, reorder) => {
  switch (item.type) {
    case TEXT:
      return <Text item={item} reorder={reorder} />;

    case SET:
      return <SetAction item={item} reorder={reorder} />;

    default:
      return <UnknownComponent />;
  }
};

const Component = ({ item, reorder, classes }) => (
  <Card className={classes.component}>
    <CardContent>
      {renderItem(item, reorder)}
    </CardContent>
  </Card>
);

Component.propTypes = {
  item: PropTypes.object.isRequired,
  reorder: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
};


export default withStyles(styleSheet)(Component);
