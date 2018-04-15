import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const RequireAuth = ({ api, children }) => {
  if (!(window.sessionStorage.getItem('token') && api.user))
    return <Redirect to="/login" />;

  return children;
};

RequireAuth.propTypes = {
  api: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};


const mapStateToProps = (state) => ({
  api: state.api,
});

export default connect(mapStateToProps)(RequireAuth);
