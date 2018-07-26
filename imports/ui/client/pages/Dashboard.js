import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Button } from '@material-ui/core';
import { AddProject, Projects } from '../../../api/projects/projects';


const DashboardUI = ({ user, projects }) => (
  <div>
    Dashboard
    <div>
      {user && (
        <Button variant="contained" color="primary" onClick={() => AddProject('New Project', user.profile.name)}>
          Create Project
        </Button>
      )}
    </div>
    <div>
      {projects.map((project) => (
        <Button key={project._id} variant="contained" color="secondary" onClick={() => FlowRouter.go(`/project/${project._id}`)}>
          {project.name}
        </Button>
      ))}
    </div>
  </div>
);


DashboardUI.propTypes = {
  user: PropTypes.object,
  projects: PropTypes.array,
};

DashboardUI.defaultProps = {
  user: null,
  projects: [],
};

const mapTrackerToProps = () => ({
  user: Meteor.user(),
  projects: Projects.find().fetch(),
});

export const Dashboard = withTracker(mapTrackerToProps)(DashboardUI);
