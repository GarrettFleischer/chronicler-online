import AddIcon from 'material-ui-icons/Add';
import SwapIcon from 'material-ui-icons/SwapVert';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Card, { CardContent } from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Tooltip from 'material-ui/Tooltip';
import { FormattedMessage } from 'react-intl';
import Align from '../../components/Align';
import { validateLabel } from '../../data/core';
import { nodeComponentAdd, nodeComponentsSorted, nodeLabelChange } from './reducers';
import { makeSelectNode } from './selectors';
import Link from '../../components/Link';
import ChooseComponentDialog from '../../components/ChooseComponentDialog';
import ComponentManager from '../../components/ComponentManager/index';
import { setReordering, setShowChooseComponentDialog } from '../../reducers/uiReducer';
import messages from './messages';


const styleSheet = (theme) => ({
  root: {
    padding: '10px',
  },
  nodeTitle: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary,
  },
});


const Node = ({ classes, ui, data, onSortEnd, onAddClick, onReorderClick, onLabelChange, onComponentAdded }) => {
  const { node, state } = data;

  if (node === null)
    return <Redirect to="/404" />;

  return (
    <div>
      <Paper className={classes.root}>
        <div style={{ marginBottom: '18px' }}>
          <Align container>
            <Align left>
              <TextField
                onChange={onLabelChange(node.id)}
                placeholder={`Page ${node.id}`}
                value={node.label}
                error={!validateLabel(state, node.label)}
                label="Label"
              />
            </Align>
            <Align right>
              <Tooltip title={<FormattedMessage {...messages.reorder} />}>
                <IconButton onClick={() => onReorderClick(ui.reordering)}><SwapIcon style={{ fill: ui.reordering ? 'blue' : 'gray' }} /></IconButton>
              </Tooltip>
              <Tooltip title={<FormattedMessage {...messages.addComponent} />}>
                <IconButton onClick={onAddClick}><AddIcon /></IconButton>
              </Tooltip>
            </Align>
          </Align>
        </div>
        <div>
          <ComponentManager
            parentId={node.id}
            components={node.components}
            reordering={ui.reordering}
            onSortEnd={onSortEnd(node.id)}
          />
        </div>
        <div style={{ marginTop: '18px' }}>
          <Card>
            <CardContent>
              <Link item={node.link} />
            </CardContent>
          </Card>
        </div>
      </Paper>
      <ChooseComponentDialog handleClose={onComponentAdded(node.id)} />
    </div>
  );
};


Node.propTypes = {
  // @see makeMapStateToProps
  data: PropTypes.object.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
  onReorderClick: PropTypes.func.isRequired,
  onLabelChange: PropTypes.func.isRequired,
  onComponentAdded: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
};


const makeMapStateToProps = () => {
  const selectNode = makeSelectNode();
  return (state, props) => ({ data: selectNode(state, props.match.params.id, 10), ui: state.ui.node });
};


const mapDispatchToProps = (dispatch) => ({
  onSortEnd: (id) => ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex)
      dispatch(nodeComponentsSorted(id, oldIndex, newIndex));
  },
  onAddClick: () => {
    dispatch(setShowChooseComponentDialog(true));
  },
  onLabelChange: (id) => (event) => {
    dispatch(nodeLabelChange(id, event.target.value));
  },
  onReorderClick: (reordering) => {
    dispatch(setReordering(!reordering));
  },
  onComponentAdded: (id) => (value) => {
    dispatch(nodeComponentAdd(id, value));
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Node));
