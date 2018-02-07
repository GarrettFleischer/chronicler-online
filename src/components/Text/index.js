import Card, { CardContent } from 'material-ui/Card';
import PropTypes from 'prop-types';
import React from 'react';

export default function Text({ item, reorder }) {
  if (reorder)
    return <Reorder item={item} />;

  return (
    <Card>
      <CardContent>
        <div>{item.text}</div>
      </CardContent>
    </Card>
  );
}

Text.propTypes = {
  item: PropTypes.object.isRequired,
  reorder: PropTypes.bool.isRequired,
};


const Reorder = ({ item }) => (
  <Card>
    <CardContent>
      <div>{`text ${item.id}: ${item.text}`}</div>
    </CardContent>
  </Card>
);

Reorder.propTypes = {
  item: PropTypes.object.isRequired,
};
