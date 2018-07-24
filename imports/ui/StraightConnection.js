import React from 'react';
import PropTypes from 'prop-types';


export const StraightConnection = ({ points }) => {
  let d = 'M ';
  const p1 = points[0];
  const p2 = points[1];
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
  points.forEach((p) => {
    d += `${p.x},${p.y} `;
  });
  return (
    <g>
      <path d={d} fill="none" strokeWidth={3} stroke="white" />
      <polygon points="2,7 0,0 11,7 0,14" transform={`translate(${(p2.x - Math.cos(angle * Math.PI / 180) * 15)}, ${p2.y - Math.sin(angle * Math.PI / 180) * 15}) rotate(${angle} 0 0) translate(-2 -7)`} fill="white" stroke="black" strokeWidth={1} />
    </g>
  );
};

StraightConnection.propTypes = { points: PropTypes.array.isRequired };
