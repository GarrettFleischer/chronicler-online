import { intlReducer } from 'react-intl-redux';
import { nodeReducer } from '../containers/Node/reducers';
import unid from '../lib/unid';


export default function rootReducer(state, action) {
  return {
    ...state,
    chronicler: chroniclerReducer(state.chronicler, action),
    intl: intlReducer(state.intl, action),
  };
}


function chroniclerReducer(state, action) {
  // const unidReducer = unid(nodeReducer, state.present.data);
  // const historyReducer = history(unidReducer, state.present);
  // return historyReducer(state, action);
  const unidReducer = unid(nodeReducer, state.present.data);

  return {
    ...state,
    present: unidReducer(state.present, action),
  };

  // return {
  //   ...state,
  //   present: {
  //     ...state.present,
  //     unid: {
  //       ...state.present.unid,
  //       data: nodeReducer(state.present.unid.data, action),
  //     },
  //   },
  // };
}