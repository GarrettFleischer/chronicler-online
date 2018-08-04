import PropTypes from 'prop-types';
import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Button } from '@material-ui/core';
import { Projects } from '../../../both/api/projects/projects';
import { addScene } from '../../../both/api/scenes/scenes';
import { DelayedButtonGrid } from '../DelayedButtonGrid';
import { PaperPage } from './PaperPage';


const ProjectUI = ({ project, scenes }) => {
  const items = scenes.map((scene) => ({
    id: scene._id,
    text: scene.name,
    onClick: () => FlowRouter.go(`/scene/${scene._id}`),
  }));
  return (
    <PaperPage>
      <div style={{ margin: 16 }}>
        <Button variant="contained" color="secondary" onClick={() => addScene(`Chapter ${scenes.length + 1}`, project._id)}>
          Create Scene
        </Button>
      </div>
      <DelayedButtonGrid items={items} width={240} height={72} />
    </PaperPage>
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
