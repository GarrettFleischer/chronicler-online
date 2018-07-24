import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';
import withSizes from 'react-sizes';
import { graphlib, layout } from 'dagre';
import { AddNode, CHOICE, LABEL, UpdateNodeParentId } from '../api/nodes/nodes';
import { Choice } from './Choice';
import { Connection } from './Connection';
import { Label } from './Label';
import { StraightConnection } from './StraightConnection';


const SEP_HEIGHT = 100;
const SEP_WIDTH = 65;
const NODE_WIDTH = 65;
const NODE_HEIGHT = 65;


// const findParents = (nodes, child) => nodes.filter((node) => {
//   if (child.type === LABEL && child.parentId) return child.parentId.includes(node._id);
//   return child.parentId === node._id;
// });
//
// const findSiblings = (nodes, child) => nodes.filter((node) => {
//   if (child.type === LABEL) return false;
//   return child.parentId === node.parentId;
// });
//
// // const buildChildren = (nodes) => {
// //   const children = {};
// //   nodes.forEach((node) => {
// //     children[node._id] = findChildren(nodes, node);
// //   });
// //   return children;
// // };

const buildChildren = (nodes) => {
  const findChildren = (parent) => nodes.filter((node) => {
    if (node.type === LABEL && node.parentId) return node.parentId.includes(parent._id);
    return node.parentId === parent._id;
  });

  nodes.forEach((node) => {
    node.children = findChildren(node);
  });
};

// const buildDimensions = (nodeChildren, startNode) => {
//   const nodeDimensions = {};
//
//   const findWidth = (node, height) => {
//     if (nodeDimensions[node._id] === undefined) {
//       const children = nodeChildren[node._id];
//
//       if (children.length) {
//         children.forEach((child) => {
//           findWidth(child, height + 1);
//         });
//         // sum the widths of the children as the width of the current node
//         nodeDimensions[node._id] = { height, width: (children.reduce((total, child) => total + nodeDimensions[child._id].width, 0) + (SEP_WIDTH * (children.length - 1))) };
//       } else nodeDimensions[node._id] = { height, width: NODE_WIDTH };
//
//
//       // otherwise set leaf nodes width to NODE_WIDTH
//     }
//   };
//
//   findWidth(startNode, 0);
//
//   return nodeDimensions;
// };


// const buildLayers = (nodes, startNode) => {
//   buildChildren(nodes);
//
//   const findLayer = (node, depth = 0) => {
//     if (!node.depth || node.depth < depth) {
//       node.depth = depth;
//       node.children.forEach((child) => {
//         findLayer(child, depth + 1);
//       });
//     }
//   };
//
//   findLayer(nodes.filter((node) => node._id === startNode._id)[0]);
//
//
//   const layers = [];
//   nodes.forEach((node) => {
//     while (layers.length <= node.depth) layers.push([]);
//     layers[node.depth].push(node);
//   });
//
//   return layers;
// };
//
// const buildLayout = (nodes, startNode, startX, startY) => {
//   const makeConnection = (id, x1, y1, x2, y2) => ({ id, from: { x: x1, y: y1 + NODE_HEIGHT }, to: { x: x2, y: y2 } });
//
//   const layers = buildLayers(nodes, startNode);
//   layers.forEach((layer, i) => {
//     const width = (layer.length * (NODE_WIDTH + SEP_WIDTH));
//     const height = i * (NODE_HEIGHT + SEP_HEIGHT);
//     let offset = -width / 2;
//     layer.forEach((node) => {
//       node.x = startX + offset;
//       node.y = startY + height;
//       offset += NODE_WIDTH + SEP_WIDTH;
//     });
//   });
//
//
//   nodes.forEach((node) => {
//     node.connections = [];
//     node.children.forEach((child) => {
//       node.connections.push(makeConnection(child._id, node.x, node.y, child.x, child.y));
//     });
//   });
// };

// const getLayout = (nodes, startNode, startX, startY) => {
//   const layout = [];
//   buildChildren(nodes);
//   buildLayers(startNode);
//   // const nodeDimensions = buildDimensions(nodeChildren, startNode);
//   const processed = {};
//
//   const makeConnection = (id, height, x1, y1, x2, y2) => ({ id, height, from: { x: x1, y: y1 + NODE_HEIGHT }, to: { x: x2, y: y2 } });
//
//   const layoutNode = (node, x, y) => {
//     if (processed[node._id]) return;
//     processed[node._id] = true;
//
//     const connections = [];
//     const children = nodeChildren[node._id];
//     const nodeWidth = nodeDimensions[node._id].width;
//     let child;
//     let nextChild;
//     let offset = children.length > 1 ? -(nodeWidth / 2) + ((nodeDimensions[children[0]._id]).width / 2) : 0;
//     for (let i = 0; i < children.length; ++i) {
//       child = children[i];
//       const left = x + offset;
//       const top = y + Math.max(SEP_HEIGHT, (nodeWidth / 8));
//       // if (child.type === LABEL) {
//       //   const parents = findParents(nodes, child);
//       //   console.log('parents: ', parents);
//       //   const parentLayouts = layout.filter((l) => parents.includes(l.node));
//       //   console.log('parentLayouts: ', parentLayouts);
//       //   left = parentLayouts.reduce((total, l) => total + l.x, 0) / parentLayouts.length;
//       //   console.log('left: ', left);
//       // }
//       nextChild = children[i + 1];
//       connections.push(makeConnection(child._id, top - y, x, y, left, top));
//       layoutNode(child, left, top);
//       if (nextChild) offset += SEP_WIDTH + ((nodeDimensions[child._id].width + nodeDimensions[nextChild._id].width) / 2);
//     }
//
//     layout.push({ node, connections, x, y });
//   };
//
//   layoutNode(startNode, startX, startY);
//
//   return layout;
// };

const makeConnection = (id, x1, y1, x2, y2) => ({ id, from: { x: x1, y: y1 + NODE_HEIGHT }, to: { x: x2, y: y2 } });

class FlowchartUI extends Component {
  constructor() {
    super();
    this.state = { mode: CHOICE, selected: null };
  }


  render() {
    // eslint-disable-next-line object-curly-newline
    const { window, scene, nodes } = this.props;
    const { mode, selected } = this.state;

    const nodeClicked = (node) => () => {
      if (mode === LABEL) {
        if (selected && selected.type !== LABEL && node.type === LABEL) UpdateNodeParentId(node._id, [...node.parentId, selected._id]);
        else if (selected === node) AddNode(LABEL, 'new', scene._id, [node._id]);
      } else AddNode(CHOICE, 'new', scene._id, node._id);


      this.setState({ selected: node });
    };
    // const layouts = getLayout(nodes, startNode, window.width / 2, SEP_HEIGHT);

    // buildLayout(nodes, startNode, window.width / 2, SEP_HEIGHT);

    buildChildren(nodes);

    const g = new graphlib.Graph();
    g.setGraph({ nodesep: SEP_WIDTH, ranksep: SEP_HEIGHT });
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((node) => {
      g.setNode(node._id, { width: NODE_WIDTH, height: NODE_HEIGHT });
      node.children.forEach((child) => {
        g.setEdge(node._id, child._id);
      });
    });

    layout(g);

    g.nodes().forEach((id) => {
      const gn = g.node(id);
      const node = nodes.find((n) => n._id === id);
      node.x = gn.x;
      node.y = gn.y;
    });

    const connections = [];
    // nodes.forEach((node) => {
    //   node.children.forEach((child) => {
    //     connections.push(makeConnection(node._id + child._id, node.x, node.y, child.x, child.y));
    //   });
    // });
    g.edges().forEach((e) => {
      const ge = g.edge(e);
      connections.push({ id: e.v + e.w, points: ge.points });
    });

    // console.log('nodes: ', nodes);


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
            {nodes.map((node) => {
              switch (node.type) {
                case LABEL:
                  return <Label key={node._id} label={node} x={node.x} y={node.y} onClick={nodeClicked(node)} />;
                default:
                  return <Choice key={node._id} choice={node} x={node.x} y={node.y} onClick={nodeClicked(node)} />;
              }
            })}
            {connections.map((connection) => <StraightConnection key={connection.id} points={connection.points} />)}
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
  // startNode: PropTypes.object.isRequired,
};


const mapSizesToProps = ({ width, height }) => ({ window: { width, height } });

export const Flowchart = (withSizes(mapSizesToProps)(FlowchartUI));
