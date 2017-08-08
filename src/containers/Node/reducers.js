import { arrayMove } from 'react-sortable-hoc';


export const NODE_COMPONENTS_SORTED = 'Node/NODE_COMPONENTS_SORTED';


export function nodeComponentsSorted(id, oldIndex, newIndex) {
  return {
    type: NODE_COMPONENTS_SORTED,
    id,
    oldIndex,
    newIndex,
  };
}


export function nodeReducer(state, action) {
  switch (action.type) {
    case NODE_COMPONENTS_SORTED:
      // ignore action if it is not meant for this node
      if (state.id !== action.id) return state;
      return {
        ...state,
        components: arrayMove(state.components, action.oldIndex, action.newIndex),
      };

    default:
      return state;
  }
}
