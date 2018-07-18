import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Scenes } from '../../api/scenes/scenes';
import { Flowchart } from '../Flowchart';

const SceneUI = ({ scene }) => (
  <div>
    <Flowchart scene={scene} />
  </div>
);

SceneUI.propTypes = {
  scene: PropTypes.object.isRequired,
};

const mapTrackerToProps = () => ({
  scene: Scenes.findOne(FlowRouter.getParam('id')),
});

export const Scene = withTracker(mapTrackerToProps)(SceneUI);
