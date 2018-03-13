import { intlReducer } from 'react-intl-redux';
import history from '../lib/history';
import uiReducer from './uiReducer';
import { projectReducer } from '../containers/Project/reducers';
import { mapReducer } from '../data/utilities';

export default function rootReducer(state, action) {
  return {
    ...state,
    ui: uiReducer(state.ui, action),
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

