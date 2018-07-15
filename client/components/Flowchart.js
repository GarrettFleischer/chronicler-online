import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';
import withSizes from 'react-sizes';
import { withTracker } from 'meteor/react-meteor-data';

import { Labels } from '../../imports/api/labels';

class Flowchart extends Component {
  render() {
    const {window, labels} = this.props;
    labels.forEach((label, i) => console.log(`${i}: ${JSON.stringify(label)}`));

    return (
      <div>
        <ReactSVGPanZoom width={window.width - 18} height={window.height - 18} tool='auto' toolbarPosition='none' miniaturePosition='none'>
          <svg viewBox={[0, 0, window.width, window.height]}>
            <rect width={window.width} height={window.height} fillOpacity={0.1} />
          </svg>
        </ReactSVGPanZoom>
      </div>
    );
  }
}

Flowchart.propTypes = {
  window: PropTypes.shape({width: PropTypes.number, height: PropTypes.number}).isRequired,
  labels: PropTypes.array.isRequired,
};

const mapSizesToProps = ({width, height}) => ({window: {width, height}});
const mapTrackerToProps = () => ({
  labels: Labels.find({}).fetch(),
});

export default withTracker(mapTrackerToProps)(withSizes(mapSizesToProps)(Flowchart));
