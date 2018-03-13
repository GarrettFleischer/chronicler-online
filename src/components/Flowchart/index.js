import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { PathLine } from 'react-svg-pathline';
import { generate as getID } from 'shortid';
import { getLinks, getNodeCoords } from '../../data/core';
import { getActiveProject } from '../../data/state';
import { setFlowchartDragging, setFlowchartMouse, setFlowchartOffset } from '../../reducers/uiReducer';
import { PropTypeId } from '../../data/datatypes';

const getPoints = (layout, rect, from, to) => {
  const x1 = layout[from].x;
  const y1 = layout[from].y;
  const x2 = layout[to].x;
  const y2 = layout[to].y;

  const points = [{ x: x1 + (rect.width / 2), y: 0 }, { x: x2 + (rect.width / 2), y: y2 }];

  if (y1 < y2)
    points[0].y = y1 + rect.height;
  else
    points[0].y = y1;

  return points;
};

const handleMouseMove = (ui, setOffset) => (event) => {
  if (ui.dragging) {
    setOffset({
      x: ui.mouse.offx + ((event.clientX - ui.mouse.x)),
      y: ui.mouse.offy + ((event.clientY - ui.mouse.y)),
    });
  }
};

const stylesheet = () => ({
  chart: {
    userSelect: 'none',
    position: 'absolute',
    left: 0,
  },
});

const Flowchart = ({ classes, project, ui, setDragging, setOffset, scene, onNodeClicked, highlightNode }) => {
  const rect = { width: 75, height: 50 };
  const layout = getNodeCoords(project, rect.width * 1.5, rect.height * 2.5, ui.offset.x, ui.offset.y);
  return (
    <svg
      className={classes.chart}
      width="100%"
      height="85%"
      onMouseDown={setDragging(ui, true)}
      onMouseUp={setDragging(ui, false)}
      onMouseLeave={setDragging(ui, false)}
      onMouseMove={handleMouseMove(ui, setOffset)}
    >
      {scene.nodes.map((node) => {
        const children = getLinks(node.link);
        return ([
          children.map((id) => (
            <PathLine
              key={getID()}
              points={getPoints(layout, rect, node.id, id)}
              stroke="red"
              strokeWidth="1"
              fill="none"
              r={0}
            />
            )),
          <rect
            x={layout[node.id].x}
            y={layout[node.id].y}
            width={rect.width}
            height={rect.height}
            fill={(node.id === highlightNode ? 'red' : 'black')}
            onClick={() => onNodeClicked(node.id)}
          />,
          <text
            key={node.id}
            x={layout[node.id].x + 5}
            y={layout[node.id].y + 15}
            stroke="white"
            fill="white"
            onClick={() => onNodeClicked(node.id)}
          >{node.label}</text>,
        ]);
      })}
    </svg>
  );
};

Flowchart.propTypes = {
  classes: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  setDragging: PropTypes.func.isRequired,
  setOffset: PropTypes.func.isRequired,

  scene: PropTypes.object.isRequired,
  onNodeClicked: PropTypes.func.isRequired,
  highlightNode: PropTypeId,
};

Flowchart.defaultProps = {
  highlightNode: undefined,
};

const mapStateToProps = (state) => ({
  project: getActiveProject(state),
  ui: state.ui.flowchart,
});

const mapDispatchToProps = (dispatch) => ({
  setDragging: (ui, dragging) => (event) => {
    if (ui.dragging !== dragging) {
      dispatch(setFlowchartDragging(dragging));
      dispatch(setFlowchartMouse({ x: event.clientX, y: event.clientY, offx: ui.offset.x, offy: ui.offset.y }));
    }
  },
  setOffset: (offset) => {
    dispatch(setFlowchartOffset(offset));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(stylesheet)(Flowchart));

