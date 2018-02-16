import Card, { CardContent } from 'material-ui/Card';
import { FormControl } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Select from 'material-ui/Select';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import 'brace/mode/python';
import 'brace/theme/github';
import { setOpChanged, setValueChanged, setVariable2Changed, setVariableChanged } from './reducers';
import Align from '../Align';
import { getActiveProject } from '../../data/state';
import { findById } from '../../data/core';
import { SET } from '../../data/datatypes';


const styles = (/* theme */) => ({
  actionText: {
    marginTop: '10px',
  },
});

const Reorder = ({ item }) => (
  <Card>
    <CardContent>
      <div>{`*set ${item.variable.name}`}</div>
    </CardContent>
  </Card>
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

const ValueField = ({ item, variables, onVariableChange, onValueChange }) => {
  if (item.type === SET) {
    return (
      <TextField
        onChange={(event) => {
          onValueChange(item.id, event.target.value);
        }}
        placeholder={'value'}
        value={item.value}
      />
    );
  }
  return (<VariableSelect item={item} variableId={item.variable2.id} variables={variables} onChange={onVariableChange} />);
};

ValueField.propTypes = {
  item: PropTypes.object.isRequired,
  variables: PropTypes.array.isRequired,
  onVariableChange: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
};

const SetAction = ({ item, reorder, variables, onVariableChange, onOpChange, onVariable2Change, onValueChange }) => {
  if (reorder)
    return <Reorder item={item} />;

  return (
    <Card>
      <CardContent>
        <text>*set</text>
        <Align container>
          <Align left>
            <VariableSelect item={item} variableId={item.variable.id} variables={variables} onChange={onVariableChange} />
          </Align>
          <Align left>
            <FormControl>
              <Select
                native
                value={item.op}
                onChange={(event) => {
                  onOpChange(item.id, event.target.value);
                }}
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
          </Align>
          <Align left>
            <ValueField item={item} variables={variables} onVariableChange={onVariable2Change} onValueChange={onValueChange} />
          </Align>
        </Align>
      </CardContent>
    </Card>
  );
};


SetAction.propTypes = {
  item: PropTypes.object.isRequired,
  reorder: PropTypes.bool.isRequired,
  variables: PropTypes.array.isRequired,
  onVariableChange: PropTypes.func.isRequired,
  onOpChange: PropTypes.func.isRequired,
  onVariable2Change: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  variables: getActiveProject(state).variables,
  item: {
    ...props.item,
    variable: findById(getActiveProject(state), props.item.variableId),
    variable2: findById(getActiveProject(state), props.item.variableId2),
  },
});

const mapDispatchToProps = (dispatch) => ({
  onVariableChange: (id, variableId) => {
    dispatch(setVariableChanged(id, variableId));
  },
  onOpChange: (id, op) => {
    dispatch(setOpChanged(id, op));
  },
  onVariable2Change: (id, variableId) => {
    dispatch(setVariable2Changed(id, variableId));
  },
  onValueChange: (id, value) => {
    dispatch(setValueChanged(id, value));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SetAction));

