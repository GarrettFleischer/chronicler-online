import { intlReducer } from 'react-intl-redux';
import { nodeReducer } from '../containers/Node/reducers';
import history from '../lib/history';
import unid from '../lib/unid';


export default function rootReducer(state, action) {
  return {
    ...state,
    chronicler: chroniclerReducer(state.chronicler, action),
    intl: intlReducer(state.intl, action),
  };
}


function chroniclerReducer(state, action) {
  const unidReducer = unid(baseReducer, state.present.data);
  const historyReducer = history(unidReducer, state.present);
  return historyReducer(state, action);
}


function baseReducer(state, action) {
  return {
    ...state,
    scenes: state.scenes.map(sceneMapper(action)),
  };
}


const sceneMapper = (action) => (state) => ({
  ...state,
  nodes: state.nodes.map(nodeMapper(action)),
});


const nodeMapper = (action) => (state) => {
  const updated = nodeReducer(state, action);
  return {
    ...updated,
    components: updated.components.map(componentMapper(action)),
  };
};

// TODO map if and choice links
const componentMapper = () => (state) => ({
  ...state,
});
