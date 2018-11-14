import PropTypes from 'prop-types';
import React from 'react';
import { TextField } from '@material-ui/core';
import { updateComponentData } from '../../../both/api/components/components';


export const Text = ({ component }) => {
  const updateText = (e) => {
    updateComponentData(component._id, { text: e.target.value });
  };

  return (
    <TextField
      fullWidth
      multiline
      label="Text"
      value={component.data.text}
      onChange={updateText}
    />
  );
};

Text.propTypes = { component: PropTypes.object.isRequired };
