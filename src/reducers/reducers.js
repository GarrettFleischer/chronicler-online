import { intlReducer } from 'react-intl-redux';
import pouchReducer from './pouchReducer';


export default function rootReducer(state, action) {
  return {
    ...state,
    chronicler: chroniclerReducer(state.chronicler, action),
    intl: intlReducer(state.intl, action),
  };
}


function chroniclerReducer(state, action) {
  return pouchReducer(state, action);
  // const unidReducer = unid(baseReducer, state.present.data);
  // const historyReducer = history(unidReducer, state.present);
  // return historyReducer(state, action);
}


// function baseReducer(state, action) {
//   return {
//     ...state,
//     variables: state.variables.map(varMapper(action)),
//     scenes: state.scenes.map(sceneMapper(action)),
//     nodes: state.nodes.map(nodeMapper(action)),
//     components: state.components.map(componentMapper(action)),
//   };
// }
//
// // TODO write var reducer
// // eslint-disable-next-line no-unused-vars
// const varMapper = (action) => (state) => (state);
//
// // TODO write scene reducer
// // eslint-disable-next-line no-unused-vars
// const sceneMapper = (action) => (state) => (state);
//
// const nodeMapper = (action) => (state) => nodeReducer(state, action);
//
// // TODO map if and choice links
// // TODO write component reducer
// // eslint-disable-next-line no-unused-vars
// const componentMapper = (action) => (state) => (state);
