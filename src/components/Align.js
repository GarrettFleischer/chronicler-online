import PropTypes from 'prop-types';
import React from 'react';


const Align = ({ container, right, center, children }) => {
  if (container)
    return <div style={{ display: 'flex' }}>{children}</div>;

  if (right)
    return <div style={{ marginLeft: 'auto' }}>{children}</div>;

  if (center)
    return <div style={{ flex: 1, textAlign: 'center' }}>{children}</div>;

  return children;
};


Align.propTypes = {
  container: PropTypes.bool,
// eslint-disable-next-line react/no-unused-prop-types
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
