import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import Flowchart from '../../components/Flowchart';
import { findById } from '../../data/core';
import { getActiveProject } from '../../data/state';
import TabView, { makeTab } from '../../components/TabView';

const onNodeClicked = (history) => (node) => {
  history.push(`/node/${node}`);
};

// TODO use intl
const Scene = ({ scene, history }) => {
  if (scene === null)
    return <Redirect to="/404" />;

  return (
    <TabView
      id={scene.id}
      tabs={[
        makeTab('Scene', <Flowchart scene={scene} onNodeClicked={onNodeClicked(history)} highlightNode={'D'} />),
        makeTab('Variables', <div />),
      ]}
    />
  );
};

Scene.propTypes = {
  scene: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  scene: findById(getActiveProject(state), props.match.params.id),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Scene));
