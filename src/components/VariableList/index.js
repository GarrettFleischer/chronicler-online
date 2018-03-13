import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { setVariableName, setVariableValue } from '../../reducers/reducers';

const VariableList = ({ variables, onNameChange, onValueChange }) => (
  <div></div>
  );

VariableList.propTypes = {
  variables: PropTypes.array.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  onNameChange: (id) => (name) => {
    dispatch(setVariableName(id, name));
  },
  onValueChange: (id) => (value) => {
    dispatch(setVariableValue(id, value));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(VariableList);
