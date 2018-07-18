import PropTypes from 'prop-types';
import React from 'react';
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';
import withSizes from 'react-sizes';
import { withTracker } from 'meteor/react-meteor-data';
import { Label } from './Label';

const SEP_HEIGHT = 150;

const getLayout = (labels, x, y) => {
  // const y = 0;
  const layout = [];
  if (labels.length > 0) layoutItem(labels, layout, labels[0], x, y);
  // labels.forEach((label) => {
  //   layout.push({ label, x: 0, y });
  //   y += 150;
  // });
  return layout;
};

const getWidth = (labels, item) => {
  let width = 0;

  if (item.link) {
    switch (item.link.type) {
      case 'Goto': {
        const to = labels.filter((l) => l._id._str === item.link.labelId)[0];
        width += getWidth(labels, to);
      }
        break;
      default:
        break;
    }
  }

  return width;
};

const layoutItem = (labels, layout, item, x, y) => {
  if (item.link) {
    switch (item.link.type) {
      case 'Goto': {
        const to = labels.filter((l) => l._id._str === item.link.labelId)[0];
        layoutItem(labels, layout, to, x, y + SEP_HEIGHT);
      }
        break;

      default:
        break;
    }
  }

  layout.push({ item, x, y });
};


const FlowchartUI = ({ window, labels }) => {
  const labelClicked = (label) => () => console.log('clicked: ', label._id);

  const layout = getLayout(labels, window.width / 2, SEP_HEIGHT);

  return (
    <div>
      <ReactSVGPanZoom width={window.width - 18} height={window.height - 34} tool="auto" toolbarPosition="none" miniaturePosition="none">
        <svg viewBox={[0, 0, window.width, window.height]}>
          <rect width={window.width} height={window.height} fillOpacity={0.1} />
          {layout.map((item) => <Label key={item.item._id} label={item.item} x={item.x} y={item.y} onClick={labelClicked(item.label)} />)}
        </svg>
      </ReactSVGPanZoom>
    </div>
  );
};

FlowchartUI.propTypes = {
  window: PropTypes.shape({ width: PropTypes.number, height: PropTypes.number }).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  scene: PropTypes.object.isRequired,
  labels: PropTypes.array,
};

FlowchartUI.defaultProps = {
  labels: [],
};

const mapSizesToProps = ({ width, height }) => ({ window: { width, height } });
const mapTrackerToProps = ({ scene }) => ({
  labels: scene.labels(),
});

export const Flowchart = withTracker(mapTrackerToProps)((withSizes(mapSizesToProps)(FlowchartUI)));
