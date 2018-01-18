/**
 *
 * Component
 *
 */

import Card, { CardContent } from 'material-ui/Card';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { DataType } from '../../data/nodes';
import messages from './messages';
import TextComponent from './TextComponent';


const Component = ({ item }) => {
  switch (item.type) {
    case DataType.TEXT:
      return TextComponent(item);
    case DataType.NEXT:
      return (
        <Card>
          <CardContent>
            <div className="component">{`next ${item.id.toString()}: ${item.text}`}</div>
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
