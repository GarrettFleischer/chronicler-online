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


export default class Component extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { item } = this.props;
    return (
      <Card>
        <CardContent>
          {content(item)}
        </CardContent>
      </Card>
    );
  }
}


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
