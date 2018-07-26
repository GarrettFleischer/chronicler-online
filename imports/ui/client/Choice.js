import React from 'react';
import PropTypes from 'prop-types';
import measureText from 'measure-text';
import { fontStyle } from './styles';


const measure = (text) => measureText({ text, ...fontStyle });


export const Choice = ({ choice, x, y, onClick }) => {
  let { text } = choice;
  if (text.length > 12) text = `${text.substring(0, 12)}...`;
  const measurement = measure(text);
  const width = measurement.width.value * 1.5;
  const height = 65;
  const left = x - width / 2;
  const top = y - height / 2;

  const handleClick = () => onClick({ id: choice._id, left, top, width, height });

  return (
    <svg x={left} y={top} width={width} height={height}>
      <rect x={0} y={0} height={height} width={width} fill="#8e8d9b" onClick={handleClick} />
      <text x={width / 6} y={height / 1.65} fill="white" style={fontStyle}>
        {text}
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
