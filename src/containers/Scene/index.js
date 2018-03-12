import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import Flowchart from '../../components/Flowchart';
import { findById } from '../../data/core';
import { getActiveProject } from '../../data/state';

const onNodeClicked = (history) => (node) => {
  history.push(`/node/${node}`);
};

const Scene = ({ scene, history }) => {
  if (scene === null)
    return <Redirect to="/404" />;

  return (<div style={{ height: '75vh' }}><Flowchart scene={scene} onNodeClicked={onNodeClicked(history)} /></div>);
};

Scene.propTypes = {
  scene: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  scene: findById(getActiveProject(state), props.match.params.id),
});

export default connect(mapStateToProps)(withRouter(Scene));
