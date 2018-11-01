import PropTypes from 'prop-types';
import React from 'react';
import { TextField } from '@material-ui/core';


export const ActionSet = ({ component, onChange }) => (
  <TextField
    fullWidth
    multiline
    label="ActionSet"
    value={component.value}
    onChange={(e) => onChange({ ActionSet: e.target.value })}
  />
);

ActionSet.propTypes = {
  component: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
