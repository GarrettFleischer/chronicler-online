import { arrayMove } from 'react-sortable-hoc';
import { findById, setById } from '../../data/core';
import { DataType } from '../../data/nodes';


export const LIST_SORTED = 'Node/LIST_SORTED';


export function listSorted(nodeId, oldIndex, newIndex) {
  return {
    type: LIST_SORTED,
    nodeId,
    oldIndex,
    newIndex,
  };
}


export function nodeReducer(state, action) {
  let item;


  console.log(action);

  switch (action.type) {
    case LIST_SORTED:
      item = findById(state, action.nodeId, DataType.NODE);
      return setById(
        state,
        action.nodeId,
        { components: arrayMove(item.components, action.oldIndex, action.newIndex) },
        DataType.NODE);

    default:
      return state;
  }
}