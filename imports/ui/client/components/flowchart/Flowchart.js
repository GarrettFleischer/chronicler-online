import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';
import withSizes from 'react-sizes';
import { graphlib, layout as dagreLayout } from 'dagre';
import { AddNode, CHOICE, LABEL, UpdateNodeParentId } from '../../../../api/nodes/nodes';
import { Choice } from './Choice';
import { Label } from './Label';
import { StraightConnection } from './StraightConnection';


const SEP_HEIGHT = 100;
const SEP_WIDTH = 65;
const NODE_WIDTH = 65;
const NODE_HEIGHT = 65;

const layoutNodes = (nodes) => {
  // add children to each node
  const newNodes = [];
  const findChildren = (parent) => nodes.filter((node) => {
    if (node.type === LABEL && node.parentId) return node.parentId.includes(parent._id);
    return node.parentId === parent._id;
  });

  nodes.forEach((node) => {
    newNodes.push({ ...node, children: findChildren(node) });
  });

  // layout dagre graph
  const g = new graphlib.Graph();
  g.setGraph({ nodesep: SEP_WIDTH, ranksep: SEP_HEIGHT });
  g.setDefaultEdgeLabel(() => ({}));

  newNodes.forEach((node) => {
    g.setNode(node._id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    node.children.forEach((child) => {
      g.setEdge(node._id, child._id);
    });
  });

  dagreLayout(g);

  g.nodes().forEach((id) => {
    const gn = g.node(id);
    const node = newNodes.find((n) => n._id === id);
    node.x = gn.x;
    node.y = gn.y;
  });

  const connections = [];
  g.edges().forEach((e) => {
    const ge = g.edge(e);
    connections.push({ id: e.v + e.w, points: ge.points });
  });

  return { nodes: newNodes, connections };
};


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
        if (selected && selected.type !== LABEL && node.type === LABEL) UpdateNodeParentId(node._id, [...node.parentId, selected]);
        else if (selected === node._id) AddNode(LABEL, 'new', scene._id, [node._id]);
      } else AddNode(CHOICE, 'new', scene._id, node._id);


      this.setState({ selected: node._id });
    };

    const layout = layoutNodes(nodes);


    return (
      <div style={{ overflow: 'hidden' }}>
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
        <ReactSVGPanZoom width={window.width} height={window.height - 85} tool="auto" toolbarPosition="none" miniaturePosition="none" preventPanOutside={false}>
          {/* width and height to remove props warning */}
          <svg viewBox={[0, 0, window.width, window.height]} width={0} height={0}>
            {layout.nodes.map((node) => {
              switch (node.type) {
                case LABEL:
                  return <Label key={node._id} label={node} x={node.x} y={node.y} onClick={nodeClicked(node)} />;
                default:
                  return <Choice key={node._id} choice={node} x={node.x} y={node.y} onClick={nodeClicked(node)} />;
              }
            })}
            {layout.connections.map((connection) => <StraightConnection key={connection.id} points={connection.points} />)}
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
};


const mapSizesToProps = ({ width, height }) => ({ window: { width, height } });

export const Flowchart = (withSizes(mapSizesToProps)(FlowchartUI));
