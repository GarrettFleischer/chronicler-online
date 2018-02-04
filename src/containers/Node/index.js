import AddIcon from 'material-ui-icons/Add';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { createMuiTheme, withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Align from '../../components/Align';
import ComponentList from '../../components/ComponentList';
import { validateLabel } from '../../data/core';
// import { validateLabel } from '../../data/core';
import { nodeComponentAdd, nodeComponentsSorted, nodeLabelChange } from './reducers';
import makeSelectNode from './selectors';
import Component from '../../components/Component/index';
import { makeText } from '../../data/datatypes';


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

  onLabelChange = (event) => {
    this.props.onLabelChange(this.props.data.node.id, event.target.value);
  };

  render() {
    const { classes } = this.props;
    const { node, state } = this.props.data;

    if (node === null)
      return <Redirect to="/404" />;

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
          <Align right><IconButton onClick={this.onAddClick}><AddIcon /></IconButton></Align>
        </Align>
        <div>
          <ComponentList components={node.components} onSortEnd={this.onSortEnd} />
        </div>
        <div>
          <Component item={node.link} />
        </div>
      </Paper>
    );
  }
}


Node.propTypes = {
  // @see makeMapStateToProps
  // eslint-disable-next-makeLine react/no-unused-prop-types
  // match: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
  onLabelChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};


const makeMapStateToProps = () => {
  const selectNode = makeSelectNode();
  return (state, props) => ({ data: selectNode(state, props.match.params.id, 10) });
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
});


export default connect(makeMapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Node));
