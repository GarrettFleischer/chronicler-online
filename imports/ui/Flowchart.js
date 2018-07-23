import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';
import withSizes from 'react-sizes';
import { AddNode, CHOICE, LABEL, UpdateNodeParentId } from '../api/nodes/nodes';
import { Choice } from './Choice';
import { Connection } from './Connection';
import { Label } from './Label';


const SEP_HEIGHT = 150;
const SEP_WIDTH = 10;
const NODE_WIDTH = 200;
const NODE_HEIGHT = 65;

const findChildren = (nodes, parent) => nodes.filter((node) => {
  if (node.type === LABEL && node.parentId) return node.parentId.includes(parent._id);
  return node.parentId === parent._id;
});

const findParents = (nodes, child) => nodes.filter((node) => {
  if (child.type === LABEL && child.parentId) return child.parentId.includes(node._id);
  return child.parentId === node._id;
});

const findSiblings = (nodes, child) => nodes.filter((node) => {
  if (child.type === LABEL) return false;
  return child.parentId === node.parentId;
});

const buildChildren = (nodes) => {
  const children = {};
  nodes.forEach((node) => {
    children[node._id] = findChildren(nodes, node);
  });
  return children;
};

const buildDimensions = (nodeChildren, startNode) => {
  const nodeDimensions = {};

  const findWidth = (node, height) => {
    if (nodeDimensions[node._id] === undefined) {
      const children = nodeChildren[node._id];

      if (children.length) {
        children.forEach((child) => {
          findWidth(child, height + 1);
        });
        // sum the widths of the children as the width of the current node
        nodeDimensions[node._id] = { height, width: (children.reduce((total, child) => total + nodeDimensions[child._id].width, 0) + (SEP_WIDTH * (children.length - 1))) };
      } else nodeDimensions[node._id] = { height, width: NODE_WIDTH };


      // otherwise set leaf nodes width to NODE_WIDTH
    }
  };

  findWidth(startNode, 0);

  return nodeDimensions;
};

const getLayout = (nodes, startNode, startX, startY) => {
  const layout = [];
  const nodeChildren = buildChildren(nodes);
  const nodeDimensions = buildDimensions(nodeChildren, startNode);
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
    const nodeWidth = nodeDimensions[node._id].width;
    let child;
    let nextChild;
    let offset = children.length > 1 ? -(nodeWidth / 2) + ((nodeDimensions[children[0]._id]).width / 2) : 0;
    for (let i = 0; i < children.length; ++i) {
      child = children[i];
      const left = x + offset;
      const top = y + Math.max(SEP_HEIGHT, (nodeWidth / 8));
      // if (child.type === LABEL) {
      //   const parents = findParents(nodes, child);
      //   console.log('parents: ', parents);
      //   const parentLayouts = layout.filter((l) => parents.includes(l.node));
      //   console.log('parentLayouts: ', parentLayouts);
      //   left = parentLayouts.reduce((total, l) => total + l.x, 0) / parentLayouts.length;
      //   console.log('left: ', left);
      // }
      nextChild = children[i + 1];
      connections.push(makeConnection(child._id, top - y, x, y, left, top));
      layoutNode(child, left, top);
      if (nextChild) offset += SEP_WIDTH + ((nodeDimensions[child._id].width + nodeDimensions[nextChild._id].width) / 2);
    }

    layout.push({ node, connections, x, y });
  };

  layoutNode(startNode, startX, startY);

  return layout;
};


class FlowchartUI extends Component {
  constructor() {
    super();
    this.state = { mode: CHOICE, selected: null };
  }

  render() {
    // eslint-disable-next-line object-curly-newline
    const { window, scene, nodes, startNode } = this.props;
    const { mode, selected } = this.state;

    const nodeClicked = (node) => () => {
      if (mode === LABEL) {
        if (selected && selected.type !== LABEL && node.type === LABEL) UpdateNodeParentId(node._id, [...node.parentId, selected._id]);
        else AddNode(LABEL, 'new', scene._id, [node._id]);
      } else AddNode(CHOICE, 'new', scene._id, node._id);
      this.setState({ selected: node });
    };
    const layouts = getLayout(nodes, startNode, window.width / 2, SEP_HEIGHT);

    return (
      <div>
        <button
          type="submit"
          style={{ backgroundColor: mode === LABEL ? 'grey' : 'white' }}
          onClick={() => this.setState({ mode: LABEL })}
        >
          Label
        </button>
        <button
          type="submit"
          style={{ backgroundColor: mode === CHOICE ? 'grey' : 'white' }}
          onClick={() => this.setState({ mode: CHOICE })}
        >
          Choice
        </button>
        <ReactSVGPanZoom width={window.width - 18} height={window.height - 34} tool="auto" toolbarPosition="none" miniaturePosition="none" preventPanOutside={false}>
          {/* width and height to remove props warning */}
          <svg viewBox={[0, 0, window.width, window.height]} width={0} height={0}>
            {layouts.map((layout) => (
              <g key={layout.node._id}>
                {layout.node.type === CHOICE
                && <Choice choice={layout.node} x={layout.x} y={layout.y} onClick={nodeClicked(layout.node)} />}
                {layout.node.type === LABEL
                && <Label label={layout.node} x={layout.x} y={layout.y} onClick={nodeClicked(layout.node)} />}
                {layout.connections.map((connection) => <Connection key={connection.id} from={connection.from} to={connection.to} height={connection.height} />)}
              </g>
            ))}
          </svg>
        </ReactSVGPanZoom>
      </div>
    );
  }
}


FlowchartUI.propTypes = {
  window: PropTypes.shape({ width: PropTypes.number, height: PropTypes.number }).isRequired,
  scene: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
  startNode: PropTypes.object.isRequired,
};


const mapSizesToProps = ({ width, height }) => ({ window: { width, height } });

export const Flowchart = (withSizes(mapSizesToProps)(FlowchartUI));
