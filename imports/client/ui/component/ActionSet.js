import PropTypes from 'prop-types';
import React from 'react';
import { TextField, Select, MenuItem, FormControlLabel, Checkbox, withStyles } from '@material-ui/core';
import { withTracker } from 'meteor/react-meteor-data';
import { updateComponentData } from '../../../both/api/components/components';
import { Variables } from '../../../both/api/variables/variables';


const styles = (theme) => ({
  wrapper: { display: 'flex' },
  item: { margin: theme.spacing.unit },
});

const ActionSetUI = ({ classes, component, variables }) => {
  const updateValue = (e) => {
    updateComponentData(component._id, { value: e.target.value });
  };

  const updateVariable = (e) => {
    updateComponentData(component._id, { variableId: e.target.value });
  };

  const updateValueIsVariable = (e) => {
    updateComponentData(component._id, { valueIsVariable: e.target.checked });
  };

  return (
    <div className={classes.wrapper}>
      <span className={classes.item}>
        {'*set '}
      </span>
      <Select
        value={component.data.variableId || ''}
        onChange={updateVariable}
        displayEmpty
        className={classes.item}
      >
        {variables.map((v) => (
          <MenuItem value={v._id}>
            {v.name}
          </MenuItem>
        ))}
      </Select>
      {component.data.valueIsVariable
      && (
        <Select
          value={component.data.value || ''}
          onChange={updateValue}
          displayEmpty
          className={classes.item}
        >
          {variables.map((v) => (
            <MenuItem value={v._id}>
              {v.name}
            </MenuItem>
          ))}
        </Select>
      )}
      {!component.data.valueIsVariable
      && (
        <TextField
          value={component.data.value}
          onChange={updateValue}
          className={classes.item}
        />
      )
      }
      <FormControlLabel
        control={(
          <Checkbox
            checked={component.data.valueIsVariable}
            onChange={updateValueIsVariable}
            className={classes.item}
          />
        )}
        label="variable?"
      />

    </div>
  );
};

ActionSetUI.propTypes = {
  classes: PropTypes.object.isRequired,
  component: PropTypes.object.isRequired,
  variables: PropTypes.array.isRequired,
};

const mapTrackerToProps = () => ({ variables: Variables.find().fetch() });

export const ActionSet = withTracker(mapTrackerToProps)(withStyles(styles)(ActionSetUI));
