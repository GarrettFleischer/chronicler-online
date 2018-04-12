import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

const UserProfile = ({ api }) => (
  <div>
    {api.user &&
      <Button component={Link} to="/dashboard"><Avatar name={api.user.name} size={40} round /></Button>}
    {!api.user &&
    <Button component={Link} to="/login" color="inherit">Login</Button>}
  </div>
  );

UserProfile.propTypes = {
  api: PropTypes.object.isRequired,
};


const mapStateToProps = (state) => ({
  api: state.api,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
