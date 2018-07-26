import React from 'react';
import PropTypes from 'prop-types';


export const StraightConnection = ({ points }) => {
  let d = 'M ';
  const p1 = points[0];
  const p2 = points[1];
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  const dist = Math.sqrt(((p2.x - p1.x) ** 2) + ((p2.y - p1.y) ** 2));
  const x = p1.x + Math.cos(angle) * (dist / 2);
  const y = p1.y + Math.sin(angle) * (dist / 2);
  points.forEach((p) => {
    d += `${p.x},${p.y} `;
  });
  return (
    <g>
      <path d={d} fill="none" strokeWidth={3} stroke="white" />
      <polygon points="2,7 0,0 11,7 0,14" transform={`translate(${x}, ${y}) rotate(${(angle * 180 / Math.PI)} 0 0) translate(-2 -7)`} fill="white" stroke="black" strokeWidth={1} />
    </g>
  );
};

StraightConnection.propTypes = { points: PropTypes.array.isRequired };
