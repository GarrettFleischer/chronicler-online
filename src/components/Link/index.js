import PropTypes from 'prop-types';
import React from 'react';
import Card, { CardContent } from 'material-ui/Card';
import { CHOICE, NODE_LINK } from '../../data/datatypes';
import NodeLink from '../NodeLink';
import Choice from '../Choice';


// TODO handle scene links
const linkType = (item) => {
  switch (item.type) {
    case NODE_LINK:
      return <NodeLink item={item} />;

    case CHOICE:
      return <Choice item={item} />;

    default:
      return <text>link component</text>;
  }
};

const Link = ({ item }) => (
  <Card>
    <CardContent>
      {linkType(item)}
    </CardContent>
  </Card>
);

Link.propTypes = {
  item: PropTypes.object.isRequired,
};

export default Link;

