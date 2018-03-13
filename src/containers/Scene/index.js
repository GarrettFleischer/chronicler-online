import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import Tabs, { Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import Flowchart from '../../components/Flowchart';
import { findById } from '../../data/core';
import { getActiveProject } from '../../data/state';
import { setSceneValue } from '../../reducers/uiReducer';

const onNodeClicked = (history) => (node) => {
  history.push(`/node/${node}`);
};

function TabContainer({ children }) {
  return (
    <div style={{ paddingTop: 8 * 3 }}>
      {children}
    </div>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};


// TODO use intl
const Scene = ({ ui, scene, history, setValue }) => {
  if (scene === null)
    return <Redirect to="/404" />;

  return (
    <Paper style={{ height: '85vh' }}>
      <Tabs
        value={ui.value}
        onChange={setValue}
        indicatorColor="primary"
        centered
      >
        <Tab label="Scene">

        </Tab>
        <Tab label="Variables" />
      </Tabs>
      {ui.value === 0 && <TabContainer><Flowchart scene={scene} onNodeClicked={onNodeClicked(history)} highlightNode={'D'} /></TabContainer>}
    </Paper>
  );
};

Scene.propTypes = {
  ui: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  ui: state.ui.scene,
  scene: findById(getActiveProject(state), props.match.params.id),
});

const mapDispatchToProps = (dispatch) => ({
  setValue: (event, value) => {
    dispatch(setSceneValue(value));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Scene));
