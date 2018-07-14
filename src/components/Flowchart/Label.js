import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import measureText from 'measure-text';


const textStyle = {
  fontFamily: 'Georgia',
  fontSize: '18px',
  lineHeight: 1.3,
  fontWeight: 500,
  fontStyle: 'normal',
  userSelect: 'none',
  pointerEvents: 'none',
};

const measure = (text) => measureText({ text, ...textStyle });


const Label = ({ id, x, y, label, onClick }) => {
  const measurement = measure(label);
  const width = measurement.width.value * 1.5;
  const height = Math.min(width, measurement.height.value * 3);
  const left = x - width / 2;
  const top = y - height / 2;

  const handleClick = () => onClick({ id, left, top, width, height });

  return (
    <svg x={left} y={top} width={width} height={height}>
      <ellipse cx={width / 2} cy={height / 2} ry={height / 2} rx={width / 2} fill='#8e8d9b' onClick={handleClick} />
      <text x={width / 6} y={height / 1.65} fill='white' style={textStyle}>{label}</text>
    </svg>
  );
};

Label.propTypes = {
  id: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Label);
