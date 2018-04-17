import { arrayMove } from 'react-sortable-hoc';
import { componentReducer } from '../../components/Component/reducers';
import { linkReducer } from '../../components/Link/reducers';
import { makeSetAction, makeText, SET, TEXT } from '../../data/datatypes';
import { mapReducer } from '../../data/utilities';


export const NODE_COMPONENTS_SORTED = 'Node/NODE_COMPONENTS_SORTED';
export const NODE_COMPONENT_ADD = 'Node/NODE_COMPONENT_ADD';
export const NODE_LABEL_CHANGE = 'Node/NODE_LABEL_CHANGE';
export const NODE_DELETE_COMPONENT = 'NODE_DELETE_COMPONENT';

export const nodeDeleteComponent = (id) => ({ type: NODE_DELETE_COMPONENT, id });

export const nodeComponentsSorted = (id, oldIndex, newIndex) => ({ type: NODE_COMPONENTS_SORTED, id, oldIndex, newIndex });

export const nodeComponentAdd = (id, value) => ({ type: NODE_COMPONENT_ADD, id, value });

export const nodeLabelChange = (id, label) => ({ type: NODE_LABEL_CHANGE, id, label });


export function nodeReducer(state, action) {
  // pass action to children
  const newState = {
    ...state,
    components: mapReducer(state.components, action, componentReducer),
    link: linkReducer(state.link, action),
  };

  // handle delete actions
  switch (action.type) {
    case NODE_DELETE_COMPONENT:
      return { ...newState, components: newState.components.filter((component) => component.id !== action.id) };
    default:
      break;
  }

  // handle actions meant for this node
  if (action.id !== state.id) return newState;
  switch (action.type) {
    case NODE_DELETE_COMPONENT:
      return { ...newState, components: newState.components.filter((component) => component.id !== action.id) };

    case NODE_COMPONENTS_SORTED:
      return { ...newState, components: arrayMove(newState.components, action.oldIndex, action.newIndex) };

    case NODE_COMPONENT_ADD:
      return { ...newState, components: [...newState.components, makeComponentForValue(action.value)] };

    case NODE_LABEL_CHANGE:
      return { ...newState, label: action.label };

    default:
      return newState;
  }
}


const makeComponentForValue = (value) => {
  switch (value) {
    case TEXT:
      return makeText('');

    case SET:
      return makeSetAction('', '', '', false);

    default:
      return undefined;
  }
};
