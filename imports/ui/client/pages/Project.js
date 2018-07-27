import PropTypes from 'prop-types';
import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Button } from '@material-ui/core';
import { Projects } from '../../../api/projects/projects';
import { AddScene } from '../../../api/scenes/scenes';
import { ClickableCardGrid } from '../components/ClickableCardGrid';


const ProjectUI = ({ project, scenes }) => {
  const items = scenes.map((scene) => ({ id: scene._id, text: scene.name, onClick: () => FlowRouter.go(`/scene/${scene._id}`) }));
  return (
    <div>
      <div style={{ margin: 16 }}>
        <Button variant="contained" color="secondary" onClick={() => AddScene(`Chapter ${scenes.length + 1}`, project._id)}>
          Create Scene
        </Button>
      </div>
      <ClickableCardGrid items={items} width={240} height={72} />
    </div>
  );
};


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
