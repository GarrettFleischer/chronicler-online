import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import WindowResizeHOC from '../WindowResizeHOC';
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';
import Label from './Label';
import RadialMenu from '../RadialMenu';
import { showRadialMenu, toggleRadialMenu } from '../RadialMenu/reducers';
import { Add, Create, Delete, Help, Label as LabelIcon, List } from 'material-ui-icons';
import { setFlowchartSelection } from './reducers';
import lifecycle from 'react-pure-lifecycle';


const Flowchart = ({ ui, Window, showMenu, toggleMenu, closeMenu, setSelected }) => {
  const menu1Items = [{ id: 'add', icon: Add, text: 'add' }, { id: 'edit', icon: Create, text: 'edit' }, { id: 'delete', icon: Delete, text: 'delete' }];
  const menu2Items = [{ id: 'choice', icon: List, text: 'choice' }, { id: 'condition', icon: Help, text: 'condition' }, { id: 'label', icon: LabelIcon, text: 'label' }];

  const closeMenus = () => {
    closeMenu('menu1');
    closeMenu('menu2');
  };

  const menu1Clicked = ({ id, cx, cy }) => {
    console.log('menu1 clicked: ', id);
    if (id === 'add')
      toggleMenu('menu2', cx, cy);
  };
  const menu2Clicked = ({ id }) => {
    console.log('menu2 clicked: ', id);
  };
  const labelClicked = ({ id, left, top, width, height }) => {
    const x = left + width;
    const y = top + (height / 2);
    if (ui.selected === id) {
      console.log('toggle: ', id);
      toggleMenu('menu1', x, y);
    }
    else {
      console.log('show: ', id);
      showMenu('menu1', x, y);
      setSelected(id);
    }
    closeMenu('menu2');
  };

  // start with menus closed
  if (ui.selected === null)
    closeMenus();

  return (
    <div>
      <ReactSVGPanZoom width={Window.width - 10} height={Window.height * 0.97} tool='auto' toolbarPosition='none' miniaturePosition='none'>
        <svg viewBox={[0, 0, Window.width, Window.height]}>
          <rect width={Window.width} height={Window.height} fillOpacity={0.1} onClick={closeMenus} />

          <RadialMenu id='menu1' items={menu1Items} distance={50} radius={23} angle={65} offset={-90} itemClicked={menu1Clicked} />
          <RadialMenu id='menu2' items={menu2Items} distance={70} radius={23} angle={45} offset={-45} itemClicked={menu2Clicked} />

          <Label id='start' x={Window.width / 2} y={Window.height / 2} label='start' onClick={labelClicked} />
          <Label id='mid' x={Window.width / 2} y={Window.height / 2 + 150} label='hello world' onClick={labelClicked} />
          <Label id='end' x={Window.width / 2} y={Window.height / 2 + 300} label='hello world and all who inhabit it' onClick={labelClicked} />
        </svg>
      </ReactSVGPanZoom>
    </div>
  );
};

Flowchart.propTypes = {
  ui: PropTypes.object.isRequired,
  // scene: PropTypes.object.isRequired,
  Window: PropTypes.shape({ width: PropTypes.number, height: PropTypes.number }).isRequired,
  showMenu: PropTypes.func.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => ({
  ui: state.ui.uiFlowchart
});

const mapDispatchToProps = (dispatch) => ({
  showMenu: (id, x, y) => dispatch(showRadialMenu(id, true, x, y)),
  toggleMenu: (id, x, y) => dispatch(toggleRadialMenu(id, x, y)),
  closeMenu: (id) => dispatch(showRadialMenu(id, false)),
  setSelected: (id) => dispatch(setFlowchartSelection(id)),
});

const methods = {
  shouldComponentUpdate: (nextProps, nextState) => nextProps.ui.selected === null,
};

export default connect(mapStateToProps, mapDispatchToProps)(WindowResizeHOC(100)(lifecycle(methods)(Flowchart)));
