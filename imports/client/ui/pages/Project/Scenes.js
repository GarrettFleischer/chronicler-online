import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { addScene } from '../../../../both/api/scenes/scenes';
import { DelayedButtonGrid } from '../../DelayedButtonGrid';


export const Scenes = ({ projectId, scenes }) => (
  <Fragment>
    <div style={{ margin: 16 }}>
      <Button variant="contained" color="secondary" onClick={() => addScene(`Chapter ${scenes.length + 1}`, projectId)}>
        Create Scene
      </Button>
    </div>
    <DelayedButtonGrid items={scenes} width={240} height={72} />
  </Fragment>
);

Scenes.propTypes = {
  projectId: PropTypes.string.isRequired,
  scenes: PropTypes.array.isRequired,
};
