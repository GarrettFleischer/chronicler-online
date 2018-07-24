import React from 'react';
import PropTypes from 'prop-types';


export const StraightConnection = ({ points }) => {
  let d = 'M ';
  points.forEach((p) => {
    d += `${p.x},${p.y} `;
  });
  return (
    <path d={d} fill="none" strokeWidth={3} stroke="white" />
  );
};

StraightConnection.propTypes = { points: PropTypes.array.isRequired };
