import { arrayMove } from 'react-sortable-hoc';
import { merge } from '../../lib/history';
import { SET, TEXT } from '../../data/datatypes';
import { textReducer } from '../../components/Text/reducers';
import { setActionReducer } from '../../components/SetAction/reducers';


export const NODE_COMPONENTS_SORTED = 'Node/NODE_COMPONENTS_SORTED';
export const NODE_COMPONENT_ADD = 'Node/NODE_COMPONENT_ADD';
export const NODE_LABEL_CHANGE = 'Node/NODE_LABEL_CHANGE';


export const nodeComponentsSorted = (id, oldIndex, newIndex) => ({
  type: NODE_COMPONENTS_SORTED,
  id,
  oldIndex,
  newIndex,
});

export const nodeComponentAdd = (id, component) => (
  {
    type: NODE_COMPONENT_ADD,
    id,
    component,
  });

export const nodeLabelChange = (id, label) => merge({
  type: NODE_LABEL_CHANGE,
  id,
  label,
});

export function nodeReducer(state, action) {
  // ignore action if it is not meant for this node
  if (state.id !== action.id) return { ...state, components: state.components.map(componentMapper(action)) };

  switch (action.type) {
    case NODE_COMPONENTS_SORTED:
      return {
        ...state,
        components: arrayMove(state.components, action.oldIndex, action.newIndex),
      };

    case NODE_COMPONENT_ADD:
      return {
        ...state,
        components: [...state.components, action.component],
      };

    case NODE_LABEL_CHANGE:
      return {
        ...state,
        label: action.label,
      };

    default:
      return state;
  }
}


const componentMapper = (action) => (state) => componentReducer(state, action);

const componentReducer = (state, action) => {
  switch (state.type) {
    case TEXT:
      return textReducer(state, action);

    case SET:
      return setActionReducer(state, action);

    default:
      return state;
  }
};
