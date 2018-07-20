import PropTypes from 'prop-types';
import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { AddScene, Scenes } from '../../api/scenes/scenes';


const ProjectUI = ({ scenes }) => (
  <div>
    Dashboard
    <div>
      <button type="submit" onClick={() => AddScene('Chapter 1', FlowRouter.getParam('id'))}>
        Create Scene
      </button>
    </div>
    <div>
      {scenes.map((scene) => (
        <button key={scene._id} type="submit" onClick={() => FlowRouter.go(`/scene/${scene._id}`)}>
          {scene.name}
        </button>
      ))}
    </div>
  </div>
);


ProjectUI.propTypes = {
  scenes: PropTypes.array,
};

ProjectUI.defaultProps = {
  scenes: [],
};

const mapTrackerToProps = () => ({
  scenes: Scenes.find().fetch(),
});

export const Project = withTracker(mapTrackerToProps)(ProjectUI);
