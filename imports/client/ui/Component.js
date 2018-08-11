import PropTypes from 'prop-types';
import React from 'react';
import { TEXT } from '../../both/api/components/components';
import { Text } from './component/Text';

const textComponent = (component) => (
  <div>
    {component._id}
  </div>
);

export const Component = ({ component, onChange }) => {
  switch (component.type) {
    case TEXT:
      return <Text component={component} onChange={onChange} />;
    default:
      return null;
  }
};

Component.propTypes = { component: PropTypes.object.isRequired };
