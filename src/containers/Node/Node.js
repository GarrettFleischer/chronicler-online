import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';


class Node extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { id } = this.props.match.params;

    if (id > 23)
      return <Redirect to="/404" />;

    return (
      <h1>
        Node {id}
      </h1>
    );
  }

}


Node.propTypes = {
  match: PropTypes.object,
};


export default Node;