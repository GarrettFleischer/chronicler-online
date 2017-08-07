import { intlReducer } from 'react-intl-redux';
import { nodeReducer } from '../containers/Node/reducers';
import unid from '../lib/unid';
import history from '../lib/history';


export default function rootReducer(state, action) {
  return {
    ...state,
    chronicler: chroniclerReducer(state.chronicler, action),
    intl: intlReducer(state.intl, action),
  };
}


function chroniclerReducer(state, action) {
  const unidReducer = unid(nodeReducer, state.present.data);
  const historyReducer = history(unidReducer, state.present);
  return historyReducer(state, action);
}
