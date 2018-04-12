import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Card, { CardContent } from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { validateLabel } from '../../data/core';
import { nodeComponentAdd, nodeComponentsSorted, nodeLabelChange } from './reducers';
import { makeSelectNode } from './selectors';
import Link from '../../components/Link';
import ChooseComponentDialog from '../../components/ChooseComponentDialog';
import ItemList from '../../components/ItemList';
import Component from '../../components/Component';
import { setShowChooseComponentDialog } from '../../reducers/uiReducer';
import RequireAuth from '../../components/RequireAuth';


const styleSheet = (theme) => ({
  root: {
    padding: '10px',
  },
  nodeTitle: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary,
  },
});


const Node = ({ classes, data, onSortEnd, onAddClick, onLabelChange, onComponentAdded }) => {
  const { node, state } = data;

  if (node === null)
    return <Redirect to="/404" />;

  return (
    <RequireAuth>
      <div>
        <Paper className={classes.root}>
          <div>
            <ItemList
              id={node.id}
              titleBar={(
                <TextField
                  onChange={onLabelChange(node.id)}
                  placeholder={`Page ${node.id}`}
                  value={node.label}
                  error={!validateLabel(state, node.label)}
                  label="Label"
                />)}
              handleAdd={onAddClick}
              handleSortEnd={onSortEnd(node.id)}
            >
              {node.components.map((component) => (
                <Component key={component.id} item={component} />
            ))}
            </ItemList>
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
    </RequireAuth>
  );
};


Node.propTypes = {
  // @see makeMapStateToProps
  data: PropTypes.object.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
  onLabelChange: PropTypes.func.isRequired,
  onComponentAdded: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
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
  onComponentAdded: (id) => (value) => {
    dispatch(nodeComponentAdd(id, value));
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Node));
