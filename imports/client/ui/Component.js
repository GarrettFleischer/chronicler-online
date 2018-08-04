import PropTypes from 'prop-types';
import React from 'react';
import { TEXT } from '../../both/api/components/components';

const textComponent = (component) => (
  <div>
    {component._id}
  </div>
);

export const Component = ({ component }) => {
  console.log('component: ', component);
  switch (component.type) {
    case TEXT:
      return textComponent(component);
    default:
      return null;
  }
};

Component.propTypes = { component: PropTypes.object.isRequired };
