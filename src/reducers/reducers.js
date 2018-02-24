import { intlReducer } from 'react-intl-redux';
import history from '../lib/history';
import uiReducer from './uiReducer';
import { sceneReducer } from '../containers/Scene/reducers';


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
  return { ...state, projects: state.projects.map(projectMapper(action)) };
}

const projectMapper = (action) => (state) => projectReducer(state, action);

function projectReducer(state, action) {
  return { ...state, scenes: state.scenes.map(sceneMapper(action)) };
}

const sceneMapper = (action) => (state) => sceneReducer(state, action);

// function sceneReducer(state, action) {
//   return { ...state, nodes: state.nodes.map(nodeMapper(action)) };
// }
//
// const nodeMapper = (action) => (state) => nodeReducer(state, action);

