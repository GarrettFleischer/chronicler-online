import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Tabs, { Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import lifecycle from 'react-pure-lifecycle';
import { setTabViewValue } from '../../reducers/uiReducer';
import { PropTypeId } from '../../data/datatypes';

export const makeTab = (label, component) => ({ label, component });

const TabView = ({ ui, setValue, id, tabs }) => (
  <Paper style={{ height: '85vh' }}>
    <Tabs
      value={ui.value[id] || 0}
      onChange={setValue(id)}
      indicatorColor="primary"
      centered
    >
      {tabs.map((tab) => <Tab key={tab.label} label={tab.label} />)}
    </Tabs>
    <div style={{ paddingTop: 8 * 3 }}>
      {tabs[ui.value[id]] && tabs[ui.value[id]].component}
    </div>
  </Paper>
);

TabView.propTypes = {
  ui: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
  id: PropTypeId.isRequired,
  tabs: PropTypes.array.isRequired,
};

const methods = {
  componentWillMount: ({ id, setValue }) => {
    setValue(id)(null, 0);
  },
};

const mapStateToProps = (state) => ({
  ui: state.ui.tabView,
});

const mapDispatchToProps = (dispatch) => ({
  setValue: (id) => (event, value) => {
    dispatch(setTabViewValue(id, value));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(lifecycle(methods)(TabView));
