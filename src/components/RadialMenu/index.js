import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { uiRadialMenuInitialState } from './reducers';
// import { showRadialMenu } from './reducers';

const notSelectable = {
  userSelect: 'none',
  pointerEvents: 'none',
};

const toRadians = (degrees) => degrees * (Math.PI / 180);

const menuItemColor = '#7e7e85';

const RadialMenu = ({ id, items, distance, radius, angle, offset, itemClicked, ui }) => {
  const fanAngle = (items.length - 1) * angle;
  const baseAngle = ((180 + fanAngle) / 2) + offset;
  const getAngle = (i) => ((baseAngle) - (i * angle));
  const dx = (i) => distance * Math.cos(toRadians(getAngle(i)));
  const dy = (i) => -distance * Math.sin(toRadians(getAngle(i)));

  return (
    ui.show &&
    items.map((item, i) => {
      const cx = ui.x + dx(i);
      const cy = ui.y + dy(i);
      const left = cx - radius;
      const top = cy - radius;
      const diameter = radius * 2;
      const Icon = item.icon;
      return (
        <svg key={item.id} x={left} y={top} width={diameter} height={diameter}>
          <circle cx={radius} cy={radius} r={radius} fill={menuItemColor} onClick={() => itemClicked({id: item.id, cx, cy, radius})} />
          <Icon style={notSelectable} color='white' width={radius * 1.5} height={radius * 1.5} x={radius * 0.25} y={radius * 0.25} />
        </svg>
      );
    })

  );
};

RadialMenu.propTypes = {
  id: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    text: PropTypes.string.isRequired
  })).isRequired,
  distance: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  angle: PropTypes.number.isRequired,
  offset: PropTypes.number,
  itemClicked: PropTypes.func.isRequired,
  ui: PropTypes.object.isRequired,
  // toggleMenu: PropTypes.func.isRequired,
  // closeMenu: PropTypes.func.isRequired,
};

RadialMenu.defaultProps = {
  offset: 0
};

const mapStateToProps = (state, { id }) => ({
  ui: state.ui.uiRadialMenu[id] ? state.ui.uiRadialMenu[id] : uiRadialMenuInitialState
});

const mapDispatchToProps = (dispatch) => ({
  // toggleMenu: (id) => () => dispatch(showRadialMenu(id, !ui.show)),
  // closeMenu: (id) => () => dispatch(showRadialMenu(id, false)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RadialMenu);
