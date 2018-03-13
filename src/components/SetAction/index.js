import { FormControl, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import Select from 'material-ui/Select';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import 'brace/mode/python';
import 'brace/theme/github';
import { setIsVariable, setOpChanged, setValueChanged, setVariableChanged } from './reducers';
import Align from '../Align';
import { getActiveProject } from '../../data/state';
import { findById, findByType } from '../../data/core';


const styles = (/* theme */) => ({
  actionText: {
    marginTop: '10px',
  },
});

const Reorder = ({ item }) => (
  <div>{`*set ${item.variable.name} ${item.op} ${item.value.name}`}</div>
);

Reorder.propTypes = {
  item: PropTypes.object.isRequired,
};


const VariableSelect = ({ item, variableId, variables, onChange }) => (
  <FormControl>
    <Select
      native
      value={variableId}
      onChange={(event) => {
        onChange(item.id, event.target.value);
      }}
      inputProps={{ id: `variable-${item.id}` }}
    >
      <option key={''} value={''} />
      {variables.map((variable) => (<option key={variable.id} value={variable.id}>{variable.name}</option>))}
    </Select>
  </FormControl>
  );

VariableSelect.propTypes = {
  item: PropTypes.object.isRequired,
  variableId: PropTypes.string.isRequired,
  variables: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

const ValueField = ({ item, variables, onValueChange }) => {
  if (item.isVariable)
    return (<VariableSelect item={item} variableId={item.variable2.id} variables={variables} onChange={onValueChange} />);

  return (
    <TextField
      onChange={(event) => {
        onValueChange(item.id, event.target.value);
      }}
      placeholder={'value'}
      value={item.value}
    />
  );
};

ValueField.propTypes = {
  item: PropTypes.object.isRequired,
  variables: PropTypes.array.isRequired,
  onValueChange: PropTypes.func.isRequired,
};

const SetAction = ({ item, sorting, variables, onVariableChange, onOpChange, onValueChange, onIsVariableChange }) => {
  if (sorting)
    return <Reorder item={item} />;
  // TODO make labels based on intl
  return (
    <div>
      <text>*set</text>
      <Align container>
        <Align left>
          <VariableSelect item={item} variableId={item.variable ? item.variable.id : ''} variables={variables} onChange={onVariableChange} />
          <FormControl>
            <Select
              native
              value={item.op}
              onChange={(event) => onOpChange(item.id, event.target.value)}
              inputProps={{ id: `variable-${item.id}` }}
            >
              <option key={''} value={''} />
              <option key={'+'} value={'+'}>+</option>
              <option key={'-'} value={'-'}>-</option>
              <option key={'*'} value={'*'}>*</option>
              <option key={'/'} value={'/'}>/</option>
              <option key={'%+'} value={'%+'}>%+</option>
              <option key={'%-'} value={'%-'}>%-</option>
            </Select>
          </FormControl>
          <ValueField item={item} variables={variables} onValueChange={onValueChange} />
        </Align>
        <Align right>
          <FormControl>
            <FormControlLabel
              label={'variable'}
              control={
                <Checkbox
                  checked={item.isVariable}
                  onChange={(event) => onIsVariableChange(item.id, event.target.checked)}
                />
                }
            />
          </FormControl>
        </Align>
      </Align>
    </div>
  );
};


SetAction.propTypes = {
  item: PropTypes.object.isRequired,
  sorting: PropTypes.bool.isRequired,
  variables: PropTypes.array.isRequired,
  onVariableChange: PropTypes.func.isRequired,
  onOpChange: PropTypes.func.isRequired,
  // onVariable2Change: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  onIsVariableChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  variables: getActiveProject(state).variables,
  item: {
    ...props.item,
    variable: getVariable(state, props.item.variableId),
    variable2: getVariable(state, props.item.value),
  },
});

const getVariable = (state, id) => findById(getActiveProject(state), id) || { id: '' };

const mapDispatchToProps = (dispatch) => ({
  onVariableChange: (id, variableId) => {
    dispatch(setVariableChanged(id, variableId));
  },
  onOpChange: (id, op) => {
    dispatch(setOpChanged(id, op));
  },
  onValueChange: (id, value) => {
    dispatch(setValueChanged(id, value));
  },
  onIsVariableChange: (id, isVariable) => {
    dispatch(setIsVariable(id, isVariable));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SetAction));

