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


const Component = ({ item }) => (
  <Card>
    <CardContent>
      {content(item)}
    </CardContent>
  </Card>
);


Component.propTypes = {
  item: PropTypes.object.isRequired,
};


function content(item) {
  switch (item.type) {
    case DataType.TEXT:
      return <div className="component">{`text ${item.id.toString()}: ${item.text}`}</div>;
    case DataType.NEXT:
      return <div className="component">{`next ${item.id.toString()}: ${item.text}`}</div>;
    default:
      return <div><FormattedMessage {...messages.unknown} /></div>;
  }
}


export default Component;
