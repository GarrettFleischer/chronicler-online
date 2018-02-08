import Card, { CardContent } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import React from 'react';

export default function Text({ item, reorder }) {
  if (reorder)
    return <Reorder item={item} />;

  return (
    <Card>
      <CardContent>
        <TextField value={item.text} />
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
      <div>{item.text}</div>
    </CardContent>
  </Card>
);

Reorder.propTypes = {
  item: PropTypes.object.isRequired,
};
