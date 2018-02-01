import Card, { CardContent } from 'material-ui/Card';
import PropTypes from 'prop-types';
import React from 'react';


const TextComponent = ({ item }) => (
  <Card>
    <CardContent>
      <div className="component">{`text ${item.id}: ${item.text}`}</div>
    </CardContent>
  </Card>
);

TextComponent.propTypes = {
  item: PropTypes.object.isRequired,
};

export default TextComponent;
