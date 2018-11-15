import PropTypes from 'prop-types';
import React, { Component as ReactComponent, Fragment } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Tabs, Tab } from '@material-ui/core';
import { Projects } from '../../../both/api/projects/projects';
import { addScene } from '../../../both/api/scenes/scenes';
import { DelayedButtonGrid } from '../DelayedButtonGrid';
import { PaperPage } from './PaperPage';


class ProjectUI extends ReactComponent {
  state = { tab: 0 };

  tabChanged = (e, tab) => {
    this.setState({ tab });
  };


  render() {
    const { project, scenes } = this.props;
    const { tab } = this.state;

    return (
      <PaperPage>
        <Tabs value={tab} onChange={this.tabChanged}>
          <Tab label="Scenes" />
          <Tab label="Variables" />
        </Tabs>
        {tab === 0
        && (
          <Fragment>
            <div style={{ margin: 16 }}>
              <Button variant="contained" color="secondary" onClick={() => addScene(`Chapter ${scenes.length + 1}`, project._id)}>
                Create Scene
              </Button>
            </div>
            <DelayedButtonGrid items={scenes} width={240} height={72} />
          </Fragment>
        )
        }
        {tab === 1
        && (
          <div style={{ margin: 16 }}>
            <Button variant="contained" color="secondary">
              Create Variable
            </Button>
          </div>
        )
        }
      </PaperPage>
    );
  }
}


ProjectUI.propTypes = {
  project: PropTypes.object,
  scenes: PropTypes.array,
  variables: PropTypes.array,
};

ProjectUI.defaultProps = {
  project: null,
  scenes: [],
  variables: [],
};

const mapScenes = (scenes) => scenes.map((scene) => ({
  id: scene._id,
  text: scene.name,
  onClick: () => FlowRouter.go(`/scene/${scene._id}`),
}));

const mapTrackerToProps = () => {
  const project = Projects.findOne({ _id: FlowRouter.getParam('id') });
  return ({
    project,
    scenes: !project ? undefined : mapScenes(project.scenes()),
    variables: !project ? undefined : project.variables(),
  });
};

export const Project = withTracker(mapTrackerToProps)(ProjectUI);
