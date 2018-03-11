import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Flowchart from '../../components/Flowchart';
import { findById } from '../../data/core';
import { getActiveProject } from '../../data/state';


const Scene = ({ scene }) => {
  if (scene === null)
    return <Redirect to="/404" />;

  return (<div style={{ height: '75vh' }}><Flowchart scene={scene} /></div>);
};

Scene.propTypes = {
  scene: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  scene: findById(getActiveProject(state), props.match.params.id),
});

export default connect(mapStateToProps)(Scene);
