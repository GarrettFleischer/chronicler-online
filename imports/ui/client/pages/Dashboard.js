import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Button } from '@material-ui/core';
import { AddProject, Projects } from '../../../api/projects/projects';
import { ClickableCardGrid } from '../components/ClickableCardGrid';


const DashboardUI = ({ user, projects }) => {
  const items = projects.map((project) => ({ id: project._id, text: project.name, onClick: () => FlowRouter.go(`/project/${project._id}`) }));
  return (
    <div>
      <div style={{ margin: 16 }}>
        {user && (
          <Button variant="contained" color="secondary" onClick={() => AddProject('New Project', user.profile.name)}>
            Create Project
          </Button>
        )}
      </div>
      <ClickableCardGrid items={items} width={240} height={72} />
    </div>
  );
};


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
