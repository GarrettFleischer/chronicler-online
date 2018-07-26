import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { AddProject, Projects } from '../../../api/projects/projects';


const DashboardUI = ({ user, projects }) => (
  <div>
    Dashboard
    <div>
      {user && (
        <button type="submit" onClick={() => AddProject('New Project', user.profile.name)}>
          Create Project
        </button>
      )}
    </div>
    <div>
      {projects.map((project) => (
        <button key={project._id} type="submit" onClick={() => FlowRouter.go(`/project/${project._id}`)}>
          {project.name}
        </button>
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
