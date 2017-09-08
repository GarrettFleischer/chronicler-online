import { setById } from '../data/core';
import { DataType } from '../data/nodes';


export const INSERT = 'pouch/INSERT';
export const BATCH_INSERT = 'pouch/BATCH_INSERT';
export const REMOVE = 'pouch/REMOVE';
export const UPDATE = 'pouch/UPDATE';

export const insert = (doc) => ({ type: INSERT, doc });
export const batchInsert = (docs) => ({ type: BATCH_INSERT, docs });
export const remove = (doc) => ({ type: REMOVE, doc });
export const update = (doc) => ({ type: UPDATE, doc });

// TODO implement this reducer...
export default function pouchReducer(state, action) {
  switch (action.type) {
    case INSERT:
      return insertDocs(state, [action.doc]);

    case BATCH_INSERT:
      return insertDocs(state, action.docs);

    case REMOVE:
      return removeDoc(state, action.doc);

    case UPDATE:
      return setById(state, action.doc._id, action.doc);

    default:
      return state;
  }
}


const insertDocs = (state, docs) => {
  let newState = state;

  for (let i = 0; i < docs.length; ++i) {
    const doc = docs[i];

    switch (doc.type) {
      case DataType.VARIABLE:
        newState = { ...newState, variables: [...newState.variables, doc] };
        break;

      case DataType.SCENE:
        newState = { ...newState, scenes: [...newState.scenes, doc] };
        break;

      case DataType.NODE:
        newState = { ...newState, nodes: [...newState.nodes, doc] };
        break;

      case DataType.COMPONENT:
        newState = { ...newState, components: [...newState.components, doc] };
        break;

      default:
        break;
    }
  }

  return newState;
};

const removeDoc = (state, doc) => {
  switch (doc.type) {
    case DataType.VARIABLE:
      return { ...state, variables: removeFrom(state.variables, doc) };

    case DataType.SCENE:
      return { ...state, scenes: removeFrom(state.scenes, doc) };

    case DataType.NODE:
      return { ...state, nodes: removeFrom(state.nodes, doc) };

    case DataType.COMPONENT:
      return { ...state, components: removeFrom(state.components, doc) };

    default:
      return state;
  }
};

const removeFrom = (array, item) => {
  const index = array.indexOf(item);
  if (index > -1)
    return array.slice(index);

  return array;
};
