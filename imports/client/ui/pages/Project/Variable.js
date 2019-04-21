import { Select, MenuItem, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { GLOBAL, updateVariableName, updateVariableSceneId, updateVariableValue } from '../../../../both/api/variables/variables';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  margin: { margin: theme.spacing.unit },
});

const VariableUI = ({ classes, variable, scenes }) => {
  const updateSceneId = (e) => {
    updateVariableSceneId(variable._id, e.target.value);
  };

  const updateName = (e) => {
    updateVariableName(variable._id, e.target.value);
  };

  const updateValue = (e) => {
    updateVariableValue(variable._id, e.target.value);
  };

  return (
    <div className={classes.root}>
      <div>
        <Select className={classes.margin} value={variable.sceneId || -1} label="Scene" onChange={updateSceneId}>
          <MenuItem value={GLOBAL}>
          Global
          </MenuItem>
          {scenes.map((scene) => (
            <MenuItem key={scene.id} value={scene.id}>
              {scene.text}
            </MenuItem>
          ))}
        </Select>
        <TextField
          className={classes.margin}
          label="Name"
          value={variable.name || ''}
          onChange={updateName}
        />
        <TextField
          className={classes.margin}
          label="Value"
          value={variable.value || ''}
          onChange={updateValue}
        />
      </div>
    </div>
  );
};

VariableUI.propTypes = {
  classes: PropTypes.object.isRequired,
  variable: PropTypes.object.isRequired,
  scenes: PropTypes.array.isRequired,
};

export const Variable = withStyles(styles)(VariableUI);
