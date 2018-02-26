import PropTypes from 'prop-types';
import React from 'react';
import { CHOICE, NODE_LINK } from '../../data/datatypes';
import NodeLink from '../NodeLink';
import Choice from '../Choice';


// TODO handle scene links
const Link = ({ item }) => {
  switch (item.type) {
    case NODE_LINK:
      return <NodeLink item={item} />;

    case CHOICE:
      return <Choice item={item} />;

    default:
      return <text>{item.type}</text>;
  }
};

Link.propTypes = {
  item: PropTypes.object.isRequired,
};

export default Link;

