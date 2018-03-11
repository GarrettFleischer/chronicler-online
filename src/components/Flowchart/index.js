import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { PathLine } from 'react-svg-pathline';
import { getLinks, getNodeCoords } from '../../data/core';
import { getActiveProject } from '../../data/state';

// import { DiagramEngine, DiagramModel, DefaultNodeModel, DiagramWidget } from 'storm-react-diagrams';


// export default () => {
//   // 1) setup the diagram engine
//   const engine = new DiagramEngine();
//   engine.installDefaultFactories();
//
//   // 2) setup the diagram model
//   const model = new DiagramModel();
//
//   // 3-A) create a default node
//   const node1 = new DefaultNodeModel('Node 1', 'rgb(0,192,255)');
//   const port1 = node1.addOutPort('Out');
//   node1.setPosition(100, 100);
//
//   // 3-B) create another default node
//   const node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
//   const port2 = node2.addInPort('In');
//   node2.setPosition(400, 100);
//
//   // link the ports
//   const link1 = port1.link(port2);
//   link1.addLabel('Hello World!');
//
//   // 4) add the models to the root graph
//   model.addAll(node1, node2, link1);
//
//   // 5) load model into engine
//   engine.setDiagramModel(model);
//
//   // 6) render the diagram!
//   return <DiagramWidget className="srd-demo-canvas" diagramEngine={engine} />;
// };

const Flowchart = ({ project, scene, onNodeClicked }) => {
  const layout = getNodeCoords(project, 100, 100);
  return (
    <svg width="100%" height={'100%'}>
      {scene.nodes.map((node) => {
        const children = getLinks(node.link);
        return ([
          children.map((id) => (
            <PathLine
              key={`${node.id}_${id}`}
              points={getPoints(layout, node.id, id)}
              stroke="red"
              strokeWidth="1"
              fill="none"
              r={0}
            />
            )),
          <rect x={layout[node.id].x} y={layout[node.id].y} width={50} height={50} onClick={() => onNodeClicked(node.id)} />,
          <text key={node.id} x={layout[node.id].x + 25} y={layout[node.id].y + 25} stroke="white">{node.label}</text>,
        ]);
      })}
    </svg>
  );
};

Flowchart.propTypes = {
  project: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired,
  onNodeClicked: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  project: getActiveProject(state),
});

export default connect(mapStateToProps)(Flowchart);


const getPoints = (layout, from, to) => {
  const x1 = layout[from].x;
  const y1 = layout[from].y;
  const x2 = layout[to].x;
  const y2 = layout[to].y;

  const points = [{ x: x1 + 25, y: 0 }, { x: x2 + 25, y: y2 }];

  if (y1 < y2)
    points[0].y = y1 + 50;
  else
    points[0].y = y1;

  return points;
};
