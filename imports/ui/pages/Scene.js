import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Labels } from '../../api/labels/labels';
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
  scene: Scenes.find().fetch().filter((s) => s._id._str === FlowRouter.getParam('id'))[0],
});

export const Scene = withTracker(mapTrackerToProps)(SceneUI);
