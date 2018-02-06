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
import Text from '../Text/index';
import { TEXT, NODE_LINK } from '../../data/datatypes';

const UnknownComponent = () => (
  <Card>
    <CardContent>
      <div><FormattedMessage {...messages.unknown} /></div>
    </CardContent>
  </Card>
);

const Component = ({ item, reorder }) => {
  switch (item.type) {
    case TEXT:
      return <Text item={item} reorder={reorder} />;

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
};


export default Component;
