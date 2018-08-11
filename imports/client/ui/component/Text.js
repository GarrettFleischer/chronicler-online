import PropTypes from 'prop-types';
import React from 'react';
import { TextField } from '@material-ui/core';


export const Text = ({ component, onChange }) => (
  <TextField
    fullWidth
    multiline
    label="Text"
    value={component.text}
    onChange={(e) => onChange({ text: e.target.value })}
  />
);

Text.propTypes = {
  component: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
