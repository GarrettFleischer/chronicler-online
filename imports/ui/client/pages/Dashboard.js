import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Typography, Slide } from '@material-ui/core';
import { AddProject, Projects } from '../../../api/projects/projects';
import { ClickableCard } from '../components/ClickableCard';


const DashboardUI = ({ user, projects }) => (
  <div>
    Dashboard
    <div>
      {user && (
        <Button variant="contained" color="secondary" onClick={() => AddProject('New Project', user.profile.name)}>
          Create Project
        </Button>
      )}
    </div>
    <div>
      {projects.map((project, i) => (
        <Slide in direction="up" mountOnEnter unmountOnExit timeout={400} style={{ transitionDelay: (i) * 150 }}>
          <ClickableCard key={project._id} style={{ height: 150, width: 300, margin: 5 }} onClick={() => FlowRouter.go(`/project/${project._id}`)}>
            <Typography variant="title">
              {project.name}
            </Typography>
          </ClickableCard>
        </Slide>
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
