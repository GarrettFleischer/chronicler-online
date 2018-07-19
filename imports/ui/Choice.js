import React from 'react';
import PropTypes from 'prop-types';
import measureText from 'measure-text';


const textStyle = {
  fontFamily: 'Georgia',
  fontSize: '20px',
  lineHeight: 1.3,
  fontWeight: 'normal',
  fontStyle: 'normal',
  userSelect: 'none',
  pointerEvents: 'none',
};

const measure = (text) => measureText({ text, ...textStyle });


// eslint-disable-next-line object-curly-newline
export const Choice = ({ choice, x, y, onClick }) => {
  let { name } = choice;
  if (name.length > 12) name = `${name.substring(0, 12)}...`;
  const measurement = measure(name);
  const width = measurement.width.value * 1.5;
  const height = Math.min(width, measurement.height.value * 3);
  const left = x - width / 2;
  const top = y - height / 2;

  const handleClick = () => onClick({
    id: choice._id, left, top, width, height,
  });

  return (
    <svg x={left} y={top} width={width} height={height}>
      <ellipse cx={width / 2} cy={height / 2} ry={height / 2} rx={width / 2} fill="#8e8d9b" onClick={handleClick} />
      <text x={width / 6} y={height / 1.65} fill="white" style={textStyle}>
        {name}
      </text>
    </svg>
  );
};

Choice.propTypes = {
  choice: PropTypes.object.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};
