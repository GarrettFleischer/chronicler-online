import PropTypes from 'prop-types';
import React from 'react';
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';
import withSizes from 'react-sizes';
import { withTracker } from 'meteor/react-meteor-data';
import { AddNode, LABEL } from '../api/nodes/nodes';
import { Connection } from './Connection';
// import { filterOne } from '../logic/utils';
import { Label } from './Label';


const SEP_HEIGHT = 150;
const SEP_WIDTH = 10;
const NODE_WIDTH = 200;
const NODE_HEIGHT = 65;

const findChildren = (nodes, parent) => nodes.filter((node) => node.parentId === parent._id);

const buildChildren = (nodes) => {
  const children = {};
  nodes.forEach((node) => {
    children[node._id] = findChildren(nodes, node);
  });
  return children;
};

const buildWidths = (nodeChildren, startNode) => {
  const nodeWidth = {};

  const findWidth = (node) => {
    if (nodeWidth[node._id] === undefined) {
      const children = nodeChildren[node._id];

      if (children.length) {
        children.forEach((child) => {
          findWidth(child);
        });
        // sum the widths of the children as the width of the current node
        nodeWidth[node._id] = children.reduce((total, child) => total + nodeWidth[child._id], 0) + (SEP_WIDTH * (children.length - 1));
      } else nodeWidth[node._id] = NODE_WIDTH;

      // otherwise set leaf nodes width to NODE_WIDTH
    }
  };

  findWidth(startNode);

  return nodeWidth;
};

const getLayout = (nodes, startNode, startX, startY) => {
  const layout = [];
  const nodeChildren = buildChildren(nodes);
  const nodeWidth = buildWidths(nodeChildren, startNode);
  const processed = {};

  const makeConnection = (id, height, x1, y1, x2, y2) => ({
    id,
    height,
    from: { x: x1, y: y1 + NODE_HEIGHT },
    to: { x: x2, y: y2 },
  });

  const layoutNode = (node, x, y) => {
    if (processed[node._id]) return;
    processed[node._id] = true;

    const connections = [];
    const children = nodeChildren[node._id];
    let child;
    let nextChild;
    let offset = children.length > 1 ? -(nodeWidth[node._id] / 2) + (nodeWidth[children[0]._id] / 2) : 0;
    for (let i = 0; i < children.length; ++i) {
      child = children[i];
      nextChild = children[i + 1];
      const left = x + offset;
      const top = y + Math.max(SEP_HEIGHT, (nodeWidth[node._id] / 8));
      connections.push(makeConnection(child._id, top - y, x, y, left, top));
      layoutNode(child, left, top);
      if (nextChild) offset += SEP_WIDTH + ((nodeWidth[child._id] + nodeWidth[nextChild._id]) / 2);
    }

    layout.push({
      node, connections, x, y,
    });
  };

  layoutNode(startNode, startX, startY);

  return layout;
};


// eslint-disable-next-line object-curly-newline
const FlowchartUI = ({ window, scene, nodes, startNode }) => {
  if (!(startNode && nodes)) {
    return (
      <div>
        loading...
      </div>
    );
  }

  const nodeClicked = (node) => () => AddNode(LABEL, 'new label', scene._id, node._id);
  const layouts = getLayout(nodes, startNode, window.width / 2, SEP_HEIGHT);

  return (
    <div>
      <ReactSVGPanZoom width={window.width - 18} height={window.height - 34} tool="auto" toolbarPosition="none" miniaturePosition="none">
        <g>
          {layouts.map((layout) => (
            <g>
              <Label key={layout.node._id} label={layout.node} x={layout.x} y={layout.y} onClick={nodeClicked(layout.node)} />
              {layout.connections.map((connection) => <Connection key={connection.id} from={connection.from} to={connection.to} height={connection.height} />)}
            </g>
          ))}
        </g>
      </ReactSVGPanZoom>
    </div>
  );
};

FlowchartUI.propTypes = {
  window: PropTypes.shape({ width: PropTypes.number, height: PropTypes.number }).isRequired,
  scene: PropTypes.object.isRequired,
  nodes: PropTypes.array,
  startNode: PropTypes.object,
};

FlowchartUI.defaultProps = {
  nodes: null,
  startNode: null,
};

const mapSizesToProps = ({ width, height }) => ({ window: { width, height } });
const mapTrackerToProps = ({ scene }) => ({
  nodes: scene.nodes(),
  startNode: scene.startNode(),
});

export const Flowchart = withTracker(mapTrackerToProps)((withSizes(mapSizesToProps)(FlowchartUI)));
