import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';
// import withSizes from 'react-sizes';
import ContainerDimensions from 'react-container-dimensions';
import { graphlib, layout as dagreLayout } from 'dagre';
import { LABEL } from '../../../../api/nodes/nodes';
import { Choice } from './Choice';
import { Label } from './Label';
import { StraightConnection } from './StraightConnection';


const SEP_HEIGHT = 100;
const SEP_WIDTH = 65;
const NODE_WIDTH = 65;
const NODE_HEIGHT = 65;


class FlowchartUI extends Component {
// eslint-disable-next-line react/destructuring-assignment
  handleNodeClick = (node) => () => this.props.nodeClicked(node);

  layoutNodes = (nodes) => {
    // add children to each node
    const newNodes = [];
    const findChildren = (parent) => nodes.filter((node) => {
      if (node.type === LABEL && node.parentId) return node.parentId.includes(parent._id);
      return node.parentId === parent._id;
    });

    nodes.forEach((node) => {
      newNodes.push({
        ...node,
        children: findChildren(node),
      });
    });

    // layout dagre graph
    const g = new graphlib.Graph();
    g.setGraph({
      nodesep: SEP_WIDTH,
      ranksep: SEP_HEIGHT,
    });
    g.setDefaultEdgeLabel(() => ({}));

    newNodes.forEach((node) => {
      g.setNode(node._id, {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      });
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
      connections.push({
        id: e.v + e.w,
        points: ge.points,
      });
    });

    return {
      nodes: newNodes,
      connections,
    };
  };


  render() {
    // eslint-disable-next-line object-curly-newline
    const { nodes } = this.props;
    const layout = this.layoutNodes(nodes);

    return (
      <div style={{ overflow: 'hidden', width: '100%', height: '100%' }}>
        <ContainerDimensions>
          {({ width, height }) => (
            <ReactSVGPanZoom width={width} height={height} tool="auto" toolbarPosition="none" miniaturePosition="none" preventPanOutside={false}>
              {/* width and height to remove required props warning */}
              <svg viewBox={[0, 0, width, height]} width={0} height={0}>
                {layout.nodes.map((node) => {
                  switch (node.type) {
                    case LABEL:
                      return <Label key={node._id} label={node} x={node.x} y={node.y} onClick={this.handleNodeClick(node)} />;
                    default:
                      return <Choice key={node._id} choice={node} x={node.x} y={node.y} onClick={this.handleNodeClick(node)} />;
                  }
                })}
                {layout.connections.map((connection) => <StraightConnection key={connection.id} points={connection.points} />)}
              </svg>
            </ReactSVGPanZoom>
          )}
        </ContainerDimensions>
      </div>
    );
  }
}


FlowchartUI.propTypes = {
  nodes: PropTypes.array.isRequired,
  nodeClicked: PropTypes.func.isRequired,
  // window: PropTypes.shape({
  //   width: PropTypes.number,
  //   height: PropTypes.number,
  // }).isRequired,
};


// const mapSizesToProps = ({ width, height }) => ({
//   window: {
//     width,
//     height,
//   },
// });

export const Flowchart = FlowchartUI;
