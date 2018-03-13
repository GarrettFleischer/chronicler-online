import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import Card, { CardContent } from 'material-ui/Card';
import { setVariableName, setVariableValue } from './reducers';
import Align from '../Align';

const Variable = ({ variable, onNameChange, onValueChange }) => (
  <Card>
    <CardContent>
      <Align container>
        <Align left>
          <TextField
            onChange={onNameChange(variable.id)}
            placeholder={'name'}
            value={variable.name}
          />
          <TextField
            onChange={onValueChange(variable.id)}
            placeholder={'value'}
            value={variable.value}
          />
        </Align>
      </Align>
    </CardContent>
  </Card>
  );

Variable.propTypes = {
  variable: PropTypes.object.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  onNameChange: (id) => (event) => {
    dispatch(setVariableName(id, event.target.value));
  },
  onValueChange: (id) => (event) => {
    dispatch(setVariableValue(id, event.target.value));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Variable);
