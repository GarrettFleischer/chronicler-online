import { intlReducer } from 'react-intl-redux';
import { nodeReducer } from '../containers/Node/reducers';


export default function rootReducer(state, action) {
  return {
    ...state,
    chronicler: chroniclerReducer(state.chronicler, action),
    intl: intlReducer(state.intl, action),
  };
}


function chroniclerReducer(state, action) {
  const historyReducer = history(baseReducer, state.present);
  return historyReducer(state, action);
}


function baseReducer(state, action) {
  return state.map(nodeMapper(action));
}


const nodeMapper = (action) => (state) => nodeReducer(state, action);

