import PropTypes from 'prop-types';
import React from 'react';
import { SET, TEXT } from '../../../both/api/components/components';
import { Text } from './Text';
import { ActionSet } from './ActionSet';


export const Component = ({ component }) => {
  switch (component.type) {
    case TEXT:
      return <Text component={component} />;
    case SET:
      return <ActionSet component={component} />;
    default:
      return (
        <div>
          {`Unknown Component: ${component._id}`}
        </div>
      );
  }
};

Component.propTypes = { component: PropTypes.object.isRequired };
