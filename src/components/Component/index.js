/**
 *
 * Component
 *
 */

import { createMuiTheme, withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Text from '../Text/index';
import { TEXT, NODE_LINK } from '../../data/datatypes';

const styleSheet = createMuiTheme((theme) => ({
  component: {
    margin: theme.spacing.unit,
  },
}));

const UnknownComponent = () => (
  <Card>
    <CardContent>
      <div><FormattedMessage {...messages.unknown} /></div>
    </CardContent>
  </Card>
);

const Component = ({ item, reorder, classes }) => {
  switch (item.type) {
    case TEXT:
      return <Card className={classes.component}><CardContent><Text item={item} reorder={reorder} /></CardContent></Card>;

    case NODE_LINK:
      return (
        <Card>
          <CardContent>
            <div className="component">{`next: ${item.text}`}</div>
          </CardContent>
        </Card>
      );

    default:
      return <UnknownComponent />;
  }
};


Component.propTypes = {
  item: PropTypes.object.isRequired,
  reorder: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
};


export default withStyles(styleSheet)(Component);
