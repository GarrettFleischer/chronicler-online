import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import Card, { CardContent } from 'material-ui/Card';
import ItemMenu from '../ItemMenu';
import { deleteVariable, setVariableName, setVariableValue } from './reducers';

// TODO use intl and stylesheet
const Variable = ({ variable, onNameChange, onValueChange, onDeleteVariable }) => (
  <Card>
    <CardContent>
      <ItemMenu itemId={variable.id} handleDelete={onDeleteVariable}>
        <TextField
          style={{ marginRight: 10 }}
          onChange={onNameChange(variable.id)}
          placeholder={'name'}
          value={variable.name}
          label={'Name'}
        />
        <TextField
          onChange={onValueChange(variable.id)}
          placeholder={'value'}
          value={variable.value}
          label={'Value'}
        />
      </ItemMenu>
    </CardContent>
  </Card>
  );

Variable.propTypes = {
  variable: PropTypes.object.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  onDeleteVariable: PropTypes.func.isRequired,
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
  onDeleteVariable: (id) => {
    dispatch(deleteVariable(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Variable);
