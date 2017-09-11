import { arrayMove } from 'react-sortable-hoc';


export const NODE_COMPONENTS_SORTED = 'Node/NODE_COMPONENTS_SORTED';
export const NODE_COMPONENT_ADD = 'Node/NODE_COMPONENT_ADD';


export const nodeComponentsSorted = (_id, oldIndex, newIndex) => ({
  type: NODE_COMPONENTS_SORTED,
  _id,
  oldIndex,
  newIndex,
});

export const nodeComponentAdd = (_id, componentId) => (
  {
    type: NODE_COMPONENT_ADD,
    _id,
    componentId,
  });


export function nodeReducer(state, action) {
  // ignore action if it is not meant for this node
  if (state._id !== action._id) return state;

  switch (action.type) {
    case NODE_COMPONENTS_SORTED:
      return {
        ...state,
        children: arrayMove(state.children, action.oldIndex, action.newIndex),
      };

    case NODE_COMPONENT_ADD:
      return {
        ...state,
        children: [...state.children, action.componentId],
      };

    default:
      return state;
  }
}
