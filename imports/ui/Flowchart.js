import PropTypes from 'prop-types';
import React from 'react';
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';
import withSizes from 'react-sizes';
import { withTracker } from 'meteor/react-meteor-data';
import { GOTO } from '../logic/links';
import { filterOne } from '../logic/utils';
import { Label } from './Label';

const SEP_HEIGHT = 150;

const getLayout = (nodes, startNode, x, y) => {
  const layout = [];
  layoutNode(nodes, layout, startNode, x, y);

  return layout;
};

const getWidth = (nodes, item) => {
  let width = 0;

  if (item.link) {
    switch (item.link.type) {
      case GOTO: {
        const to = filterOne(nodes, item.link.to);
        width += getWidth(nodes, to);
      }
        break;
      default:
        break;
    }
  }

  return width;
};

const layoutNode = (nodes, layout, item, x, y) => {
  if (!item) return;
  if (item.link) {
    switch (item.link.type) {
      case GOTO: {
        const to = filterOne(nodes, item.link.to);
        layoutNode(nodes, layout, to, x, y + SEP_HEIGHT);
      }
        break;

      default:
        break;
    }
  }

  layout.push({ item, x, y });
};


const FlowchartUI = ({ window, nodes, startNode }) => {
  const labelClicked = (label) => () => console.log('clicked: ', label._id);

  const layouts = getLayout(nodes, startNode, window.width / 2, SEP_HEIGHT);

  return (
    <div>
      <ReactSVGPanZoom width={window.width - 18} height={window.height - 34} tool="auto" toolbarPosition="none" miniaturePosition="none">
        <svg viewBox={[0, 0, window.width, window.height]}>
          <rect width={window.width} height={window.height} fillOpacity={0.1} />
          {layouts.map((layout) => <Label key={layout.item._id} label={layout.item} x={layout.x} y={layout.y} onClick={labelClicked(layout.item)} />)}
        </svg>
      </ReactSVGPanZoom>
    </div>
  );
};

FlowchartUI.propTypes = {
  window: PropTypes.shape({ width: PropTypes.number, height: PropTypes.number }).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  scene: PropTypes.object.isRequired,
  nodes: PropTypes.array,
  startNode: PropTypes.object,
};

FlowchartUI.defaultProps = {
  nodes: [],
  startNode: null,
};

const mapSizesToProps = ({ width, height }) => ({ window: { width, height } });
const mapTrackerToProps = ({ scene }) => ({
  nodes: scene.nodes(),
  startNode: scene.startNode(),
});

export const Flowchart = withTracker(mapTrackerToProps)((withSizes(mapSizesToProps)(FlowchartUI)));
