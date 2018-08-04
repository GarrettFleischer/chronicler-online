import React from 'react';
import PropTypes from 'prop-types';


export const Connection = ({ from, to }) => {
  const control = Math.abs(to.y - from.y) / 4;
  return (
    <path d={`M ${from.x},${from.y} C ${from.x},${from.y + control} ${to.x},${to.y - control} ${to.x},${to.y}`} fill="none" strokeWidth={3} stroke="white" />
  );
};

Connection.propTypes = {
  from: PropTypes.object.isRequired,
  to: PropTypes.object.isRequired,
};
