import PropTypes from 'prop-types';
import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Projects } from '../../api/projects/projects';
import { AddScene } from '../../api/scenes/scenes';


const ProjectUI = ({ project, scenes }) => (
  <div>
    Dashboard
    <div>
      <button type="submit" onClick={() => AddScene('Chapter 1', project._id)}>
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
  project: PropTypes.object,
  scenes: PropTypes.array,
};

ProjectUI.defaultProps = {
  project: null,
  scenes: [],
};

const mapTrackerToProps = () => {
  const project = Projects.findOne({ _id: FlowRouter.getParam('id') });
  return ({
    project,
    scenes: project ? project.scenes() : undefined,
  });
};

export const Project = withTracker(mapTrackerToProps)(ProjectUI);
