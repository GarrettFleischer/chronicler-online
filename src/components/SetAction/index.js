import Card, { CardContent } from 'material-ui/Card';
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import 'brace/mode/python';
import 'brace/theme/github';
import { setVariableChanged } from './reducers';
import Align from '../Align';
import { getActiveProject } from '../../data/state';
import { findById } from '../../data/core';


const Reorder = ({ item }) => (
  <Card>
    <CardContent>
      <div>{'*set'}</div>
    </CardContent>
  </Card>
);

Reorder.propTypes = {
  item: PropTypes.object.isRequired,
};

const styles = (theme) => {

};

const SetAction = ({ item, reorder, variables, onChange }) => {
  if (reorder)
    return <Reorder item={item} />;

  return (
    <Card>
      <CardContent>
        <text>*set</text>
        <Align container>
          <Align left>
            <FormControl>
              <Select
                native
                value={item.variable.id}
                onChange={(event) => {
                  onChange(item.id, event.target.value);
                }}
                inputProps={{ id: `variable-${item.id}` }}
              >
                {variables.map((variable) => (<option key={variable.id} value={variable.id}>{variable.name}</option>))}
              </Select>
            </FormControl>
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
  onChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  variables: getActiveProject(state).variables,
  item: { ...props.item, variable: findById(getActiveProject(state), props.item.variableId) },
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (id, variableId) => {
    dispatch(setVariableChanged(id, variableId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SetAction);

