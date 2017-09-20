import { intlReducer } from 'react-intl-redux';
import { nodeReducer } from '../containers/Node/reducers';
import history from '../lib/history';


export default function rootReducer(state, action) {
  return {
    ...state,
    chronicler: chroniclerReducer(state.chronicler, action),
    intl: intlReducer(state.intl, action),
  };
}


function chroniclerReducer(state, action) {
  const historyReducer = history(presentReducer, state.present);
  return historyReducer(state, action);
}


function presentReducer(state, action) {
  return state.map(nodeMapper(action));
}


const nodeMapper = (action) => (state) => nodeReducer(state, action);

