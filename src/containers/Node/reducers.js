import { arrayMove } from 'react-sortable-hoc';
import { cText } from '../../data/nodes';
import { acquireUid } from '../../lib/unid';


export const NODE_COMPONENTS_SORTED = 'Node/NODE_COMPONENTS_SORTED';
export const NODE_COMPONENT_ADD = 'Node/NODE_COMPONENT_ADD';


export const nodeComponentsSorted = (id, oldIndex, newIndex) => ({
  type: NODE_COMPONENTS_SORTED,
  id,
  oldIndex,
  newIndex,
});

export const nodeComponentAdd = (id) => (
  acquireUid({
    type: NODE_COMPONENT_ADD,
    id,
    component: cText(-1, 'new component'),
  }));


export function nodeReducer(state, action) {
  // ignore action if it is not meant for this node
  if (state.id !== action.id) return state;

  switch (action.type) {
    case NODE_COMPONENTS_SORTED:
      return {
        ...state,
        components: arrayMove(state.components, action.oldIndex, action.newIndex),
      };

    case NODE_COMPONENT_ADD:
      return {
        ...state,
        components: [...state.components, { ...action.component, id: state.uid }],
      };

    default:
      return state;
  }
}
