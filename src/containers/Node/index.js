import AddIcon from 'material-ui-icons/Add';
import SwapIcon from 'material-ui-icons/SwapVert';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { createMuiTheme, withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Align from '../../components/Align';
import { validateLabel } from '../../data/core';
import { nodeComponentAdd, nodeComponentsSorted, nodeLabelChange } from './reducers';
import { makeSelectNode } from './selectors';
import Component from '../../components/Component/index';
import { makeText } from '../../data/datatypes';
import ComponentManager from '../../components/ComponentManager/index';
import { setReordering } from '../../reducers/uiReducer';
import Tooltip from 'material-ui/Tooltip';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
// import { redo, undo } from '../../lib/history';
// import { Shortcuts } from 'react-shortcuts';
// import HistoryShortcuts from '../HistoryShortcuts';


const styleSheet = createMuiTheme((theme) => ({
  root: {
    padding: '10px',
  },
  input: {
    margin: theme.spacing.unit,
  },
}));


class Node extends PureComponent { // eslint-disable-makeLine react/prefer-stateless-function

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.props.onSortEnd(this.props.data.node.id, oldIndex, newIndex);
  };

  onAddClick = () => {
    this.props.onAddClick(this.props.data.node.id, makeText('blarg'));
  };

  onReorderClick = () => {
    this.props.onReorderClick(this.props.ui.reordering);
  };

  onLabelChange = (event) => {
    this.props.onLabelChange(this.props.data.node.id, event.target.value);
  };

  render() {
    const { classes, ui } = this.props;
    const { node, state } = this.props.data;

    if (node === null)
      return <Redirect to="/404" />;

    // <ComponentList components={node.components} onSortEnd={this.onSortEnd} />

    return (
      <Paper className={classes.root}>
        <Align container>
          <Align left>
            <div>
              <TextField
                onChange={this.onLabelChange}
                placeholder={`Page ${node.id}`}
                value={node.label}
                error={!validateLabel(state, node.label)}
                label="Label"
              />
            </div>
          </Align>
          <Align right>
            <div>
              <Tooltip title={<FormattedMessage {...messages.reorder} />}>
                <IconButton onClick={this.onReorderClick}><SwapIcon style={{ fill: ui.reordering ? 'blue' : 'gray' }} /></IconButton>
              </Tooltip>
              <Tooltip title={<FormattedMessage {...messages.addComponent} />}>
                <IconButton onClick={this.onAddClick}><AddIcon /></IconButton>
              </Tooltip>
            </div>
          </Align>
        </Align>
        <div>
          <ComponentManager components={node.components} reordering={ui.reordering} onSortEnd={this.onSortEnd} />
        </div>
        <div>
          <Component item={node.link} reorder={ui.reordering} />
        </div>
      </Paper>
    );
  }
}


Node.propTypes = {
  // @see makeMapStateToProps
  data: PropTypes.object.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
  onReorderClick: PropTypes.func.isRequired,
  onLabelChange: PropTypes.func.isRequired,
  // undo: PropTypes.func.isRequired,
  // redo: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
};


const makeMapStateToProps = () => {
  const selectNode = makeSelectNode();
  return (state, props) => ({ data: selectNode(state, props.match.params.id, 10), ui: state.ui.node });
};


const mapDispatchToProps = (dispatch) => ({
  onSortEnd: (id, oldIndex, newIndex) => {
    if (oldIndex !== newIndex)
      dispatch(nodeComponentsSorted(id, oldIndex, newIndex));
  },
  onAddClick: (id, component) => {
    dispatch(nodeComponentAdd(id, component));
  },
  onLabelChange: (id, label) => {
    dispatch(nodeLabelChange(id, label));
  },
  onReorderClick: (reordering) => {
    dispatch(setReordering(!reordering));
  },
  // undo: () => {
  //   dispatch(undo());
  // },
  // redo: () => {
  //   dispatch(redo());
  // },
});


export default connect(makeMapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Node));
