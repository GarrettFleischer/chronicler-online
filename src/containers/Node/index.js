import AddIcon from 'material-ui-icons/Add';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import { createStyleSheet, withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Align from '../../components/Align';
import ComponentList from '../../components/ComponentList';
import { nodeComponentAdd, nodeComponentsSorted } from './reducers';
import makeSelectNode from './selectors';


const styleSheet = createStyleSheet({
  root: {
    padding: '10px',
  },
});


class Node extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.props.onSortEnd(this.props.node.id, oldIndex, newIndex);
  };

  onAddClick = () => {
    this.props.onAddClick(this.props.node.id);
  };

  render() {
    const { classes, node } = this.props;

    if (node === null)
      return <Redirect to="/404" />;

    return (
      <Paper className={classes.root}>
        <Align container>
          <Align right><IconButton onClick={this.onAddClick}><AddIcon /></IconButton></Align>
        </Align>
        <div>
          <ComponentList components={node.components} onSortEnd={this.onSortEnd} />
        </div>
      </Paper>
    );
  }
}


Node.propTypes = {
  // @see makeMapStateToProps
  // eslint-disable-next-line react/no-unused-prop-types
  match: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};


const makeMapStateToProps = () => {
  const selectNode = makeSelectNode();
  return (state, props) => ({ node: selectNode(state, parseInt(props.match.params.id, 10)) });
};


const mapDispatchToProps = (dispatch) => ({
  onSortEnd: (id, oldIndex, newIndex) => {
    if (oldIndex !== newIndex)
      dispatch(nodeComponentsSorted(id, oldIndex, newIndex));
  },
  onAddClick: (id) => {
    dispatch(nodeComponentAdd(id));
  },
});


export default connect(makeMapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Node));
