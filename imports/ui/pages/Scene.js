import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Scenes } from '../../api/scenes/scenes';
import { Flowchart } from '../Flowchart';


const SceneUI = ({ scene, nodes, startNode }) => {
  const dataLoaded = scene && nodes && startNode;
  return (
    <div>
      {dataLoaded
      && <Flowchart scene={scene} nodes={nodes} startNode={startNode} />
      }
      {!dataLoaded
      && 'loading scene...'
      }
    </div>
  );
};

SceneUI.propTypes = {
  scene: PropTypes.object,
  nodes: PropTypes.array,
  startNode: PropTypes.object,
};

SceneUI.defaultProps = {
  scene: null,
  nodes: null,
  startNode: null,
};

const mapTrackerToProps = () => {
  const scene = Scenes.findOne({ _id: FlowRouter.getParam('id') });
  return ({
    scene,
    nodes: scene ? scene.nodes() : undefined,
    startNode: scene ? scene.startNode() : undefined,
  });
};

export const Scene = withTracker(mapTrackerToProps)(SceneUI);
