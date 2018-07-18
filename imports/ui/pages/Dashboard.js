import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';


class DashboardUI extends Component {
  render() {
    return (
      <div>
        Dashboard
      </div>
    );
  }
}

DashboardUI.propTypes = {

};

const mapTrackerToProps = () => ({

});

export const Dashboard = withTracker(mapTrackerToProps)(DashboardUI);
