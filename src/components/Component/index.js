/**
 *
 * Component
 *
 */

import Card, { CardContent } from 'material-ui/Card';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import TextComponent from './TextComponent';
import { TEXT, NODE_LINK } from '../../data/datatypes';


const Component = ({ item }) => {
  switch (item.type) {
    case TEXT:
      return TextComponent(item);
    case NODE_LINK:
      return (
        <Card>
          <CardContent>
            <div className="component">{`next: ${item.text}`}</div>
          </CardContent>
        </Card>
      );
    default:
      return (
        <Card>
          <CardContent>
            <div><FormattedMessage {...messages.unknown} /></div>
          </CardContent>
        </Card>
      );
  }
};


Component.propTypes = {
  item: PropTypes.object.isRequired,
};


export default Component;
