import PropTypes from 'prop-types';
import React from 'react';
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';
import withSizes from 'react-sizes';
import { sceneLayout } from '../logic/flowchartUtils';
import { Label } from './Label';
// import { withTracker } from 'meteor/react-meteor-data';


const FlowchartUI = ({ window, scene }) => {
  const layout = sceneLayout(scene);
  return (
    <div>
      <ReactSVGPanZoom width={window.width - 18} height={window.height - 34} tool="auto" toolbarPosition="none" miniaturePosition="none">
        <svg viewBox={[0, 0, window.width, window.height]}>
          <rect width={window.width} height={window.height} fillOpacity={0.1} />
          {layout.map((item) => <Label label={item.label} x={item.x} y={item.y} onClick={() => console.log('clicked: ', item.label._id)} />)}
        </svg>
      </ReactSVGPanZoom>
    </div>
  );
};

FlowchartUI.propTypes = {
  window: PropTypes.shape({ width: PropTypes.number, height: PropTypes.number }).isRequired,
  scene: PropTypes.object.isRequired,
};

const mapSizesToProps = ({ width, height }) => ({ window: { width, height } });

export const Flowchart = (withSizes(mapSizesToProps)(FlowchartUI));
