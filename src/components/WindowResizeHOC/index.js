import React from 'react';
import lifecycle from 'react-pure-lifecycle';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setWindowDimensions } from './reducers';
import fdebounce from 'debounce';


const WindowResizeHOC = (debounce) => (WrappedComponent) => {
  const Window = ({ windowUI, ...props }) => {
    return (
      <WrappedComponent Window={{ width: windowUI.width, height: windowUI.height }} {...props} />
    );
  };

  Window.propTypes = {
    windowUI: PropTypes.object.isRequired,
    updateDimensions: PropTypes.func.isRequired,
  };


  const mapStateToProps = (state) => ({
    windowUI: state.ui.uiWindow
  });

  const mapDispatchToProps = (dispatch) => ({
    updateDimensions: fdebounce(() => {
        const w = window,
          d = document,
          documentElement = d.documentElement,
          body = d.getElementsByTagName('body')[0],
          width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
          height = w.innerHeight || documentElement.clientHeight || body.clientHeight;

        dispatch(setWindowDimensions(width, height));
      },
      debounce)
  });

  const methods = ({
    componentWillMount: ({ updateDimensions }) => updateDimensions(),
    componentDidMount: ({ updateDimensions }) => window.addEventListener('resize', updateDimensions),
    componentWillUnmount: ({ updateDimensions }) => window.removeEventListener('resize', updateDimensions)
  });

  return connect(mapStateToProps, mapDispatchToProps)(lifecycle(methods)(Window));
};

export default WindowResizeHOC;
