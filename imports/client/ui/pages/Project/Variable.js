import { Select, MenuItem, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { GLOBAL, updateVariableSceneId } from '../../../../both/api/variables/variables';


export const Variable = ({ variable, scenes }) => {
  const updateSceneId = (e) => {
    updateVariableSceneId(variable._id, e.target.value);
  };

  return (
    <div
      style={{
        display: 'flex',
        margin: 16,
      }}
    >
      <Select value={variable.sceneId || -1} label="Scene" onChange={updateSceneId}>
        <MenuItem value={GLOBAL}>
          Global
        </MenuItem>
        {scenes.map((scene) => (
          <MenuItem key={scene.id} value={scene.id}>
            {scene.text}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

Variable.propTypes = {
  variable: PropTypes.object.isRequired,
  scenes: PropTypes.array.isRequired,
};
