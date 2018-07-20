import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Scenes } from '../../api/scenes/scenes';
import { Flowchart } from '../Flowchart';


const SceneUI = ({ scene }) => (
  <div>
    {scene
    && <Flowchart scene={scene} />
    }
    {!scene
    && 'loading scene...'
    }
  </div>
);
SceneUI.propTypes = {
  scene: PropTypes.object,
};

SceneUI.defaultProps = {
  scene: null,
};

const mapTrackerToProps = () => ({
  scene: Scenes.findOne({ _id: FlowRouter.getParam('id') }),
});

export const Scene = withTracker(mapTrackerToProps)(SceneUI);
