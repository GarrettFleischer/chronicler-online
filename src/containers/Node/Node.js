import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import makeSelectNode from './selectors';


class Node extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { id } = this.props.match.params;
    const { node } = this.props.state;

    if (node === null)
      return <Redirect to="/404" />;

    return (
      <h1>
        {JSON.stringify(node)}
      </h1>
    );
  }

}


Node.propTypes = {
  match: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
};

const makeMapStateToProps = () => {
  const selectNode = makeSelectNode();
  return (state, props) => ({ state: selectNode(state, parseInt(props.match.params.id, 10)) });
};


export default connect(makeMapStateToProps)(Node);