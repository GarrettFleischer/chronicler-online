import { intlReducer } from 'react-intl-redux';
import history from '../lib/history';
import uiReducer from './uiReducer';
import { projectReducer } from '../containers/Project/reducers';
import { mapReducer } from '../data/utilities';
import actionHistoryReducer from '../lib/actionHistory';
import { apiReducer } from './apiReducer';

// TODO check if the project has _id to determine whether a post or update is necessary
// TODO possibly namespace all actions
// TODO create list of actions that sync reducer
// const actionFilter = (action) => {
//   return true;
// };

export default function rootReducer(state, action) {
  return {
    ...state,
    ui: uiReducer(state.ui, action),
    api: apiReducer(state.api, action),
    // actionHistory: actionHistoryReducer()(state.actionHistory, action),
    chronicler: chroniclerReducer(state.chronicler, action),
    intl: intlReducer(state.intl, action),
  };
}


function chroniclerReducer(state, action) {
  const historyReducer = history(presentReducer, state.present);
  return historyReducer(state, action);
}


function presentReducer(state, action) {
  return { ...state, projects: mapReducer(state.projects, action, projectReducer) };
}

