import { intlReducer } from 'react-intl-redux';
import history from '../lib/history';
import uiReducer from './uiReducer';
import { projectReducer } from '../containers/Project/reducers';
import { mapReducer } from '../data/utilities';

export const SET_VARIABLE_NAME = 'SET_VARIABLE_NAME';
export const setVariableName = (id, name) => ({ type: SET_VARIABLE_NAME, id, name });

export const SET_VARIABLE_VALUE = 'SET_VARIABLE_VALUE';
export const setVariableValue = (id, value) => ({ type: SET_VARIABLE_VALUE, id, value });

export const variableReducer = (state, action) => {
  if (state.id !== action.id) return state;

  switch (action.type) {
    case SET_VARIABLE_NAME:
      return { ...state, name: action.name };

    case SET_VARIABLE_VALUE:
      return { ...state, value: action.value };

    default:
      return state;
  }
};

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

