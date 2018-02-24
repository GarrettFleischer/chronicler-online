import PropTypes from 'prop-types';
import React from 'react';


const Align = ({ container, left, right, center, children }) => {
  if (container)
    return <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>;

  if (right)
    return <div style={{ marginLeft: 'auto' }}>{children}</div>;

  if (center)
    return <div style={{ flex: 1, textAlign: 'center' }}>{children}</div>;

  if (left)
    return <div style={{ flex: 1 }}>{children}</div>;

  return { children };
};


Align.propTypes = {
  container: PropTypes.bool,
  left: PropTypes.bool,
  right: PropTypes.bool,
  center: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Align.defaultProps = {
  container: false,
  left: false,
  right: false,
  center: false,
};

export default Align;
