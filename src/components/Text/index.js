import Card, { CardContent } from 'material-ui/Card';
import PropTypes from 'prop-types';
import React from 'react';


const Text = ({ item, reorder }) => {
  if (reorder) {
    return (
      <Card>
        <CardContent>
          <div>{`text ${item.id}: ${item.text}`}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div>{`text ${item.id}: ${item.text}`}</div>
      </CardContent>
    </Card>
  );
};

Text.propTypes = {
  item: PropTypes.object.isRequired,
  reorder: PropTypes.bool.isRequired,
};

export default Text;
