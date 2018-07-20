import React from 'react';
import PropTypes from 'prop-types';
import measureText from 'measure-text';
import { fontStyle } from './styles';


const measure = (text) => measureText({ text, ...fontStyle });


// eslint-disable-next-line object-curly-newline
export const Label = ({ label, x, y, onClick }) => {
  let { text } = label;
  if (text.length > 12) text = `${text.substring(0, 12)}...`;
  const measurement = measure(text);
  const width = measurement.width.value * 1.5;
  const height = Math.min(width, measurement.height.value * 3);
  const left = x - width / 2;
  const top = y - height / 2;

  const handleClick = () => onClick({
    id: label._id, left, top, width, height,
  });

  return (
    <svg x={left} y={top} width={width} height={height}>
      <ellipse cx={width / 2} cy={height / 2} ry={height / 2} rx={width / 2} fill="#8e8d9b" onClick={handleClick} />
      <text x={width / 6} y={height / 1.65} fill="white" style={fontStyle}>
        {text}
      </text>
    </svg>
  );
};

Label.propTypes = {
  label: PropTypes.object.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};
