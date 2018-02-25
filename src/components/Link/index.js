import PropTypes from 'prop-types';
import React from 'react';
import Card, { CardContent } from 'material-ui/Card';
import { CHOICE, NODE_LINK } from '../../data/datatypes';
import NodeLink from '../NodeLink';
import Choice from '../Choice';


// TODO handle scene links
export const renderLink = (item) => {
  switch (item.type) {
    case NODE_LINK:
      return <NodeLink item={item} />;

    case CHOICE:
      return <Choice item={item} />;

    default:
      return <text>{item.type}</text>;
  }
};

const Link = ({ item }) => (
  <Card>
    <CardContent>
      {renderLink(item)}
    </CardContent>
  </Card>
);

Link.propTypes = {
  item: PropTypes.object.isRequired,
};

export default Link;

