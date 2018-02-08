import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Shortcuts } from 'react-shortcuts';
import { undo, redo } from '../../lib/history';


class HistoryShortcuts extends Component {

  handleShortcuts = (action) => {
    switch (action) {
      case 'Undo':
        this.props.undo();
        break;

      case 'Redo':
        this.props.redo();
        break;

      default:
        break;
    }
  };

  render() {
    return (
      <Shortcuts name="History" handler={this.handleShortcuts}>
        {this.props.children}
      </Shortcuts>
    );
  }

}


HistoryShortcuts.propTypes = {
  children: PropTypes.node.isRequired,
  undo: PropTypes.func.isRequired,
  redo: PropTypes.func.isRequired,
};


const mapDispatchToProps = (dispatch) => ({
  undo: () => {
    dispatch(undo());
  },
  redo: () => {
    dispatch(redo());
  },
});


export default connect((state, props) => ({ ...props }), mapDispatchToProps)(HistoryShortcuts);
