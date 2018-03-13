import { arrayMove } from 'react-sortable-hoc';
import { componentReducer } from '../../components/Component/reducers';
import { linkReducer } from '../../components/Link/reducers';
import { makeSetAction, makeText, SET, TEXT } from '../../data/datatypes';
import { mapReducer } from '../../data/utilities';


export const NODE_COMPONENTS_SORTED = 'Node/NODE_COMPONENTS_SORTED';
export const NODE_COMPONENT_ADD = 'Node/NODE_COMPONENT_ADD';
export const NODE_LABEL_CHANGE = 'Node/NODE_LABEL_CHANGE';
export const NODE_DELETE_COMPONENT = 'NODE_DELETE_COMPONENT';

export const nodeDeleteComponent = (id, componentId) => ({ type: NODE_DELETE_COMPONENT, id, componentId });

export const nodeComponentsSorted = (id, oldIndex, newIndex) => ({ type: NODE_COMPONENTS_SORTED, id, oldIndex, newIndex });

export const nodeComponentAdd = (id, value) => ({ type: NODE_COMPONENT_ADD, id, value });

export const nodeLabelChange = (id, label) => ({ type: NODE_LABEL_CHANGE, id, label });


export function nodeReducer(state, action) {
  // ignore action if it is not meant for this node
  if (state.id !== action.id) {
    return {
      ...state,
      components: mapReducer(state.components, action, componentReducer),
      link: linkReducer(state.link, action) };
  }

  switch (action.type) {
    case NODE_DELETE_COMPONENT:
      return { ...state, components: state.components.filter((component) => component.id !== action.componentId) };

    case NODE_COMPONENTS_SORTED:
      return { ...state, components: arrayMove(state.components, action.oldIndex, action.newIndex) };

    case NODE_COMPONENT_ADD:
      return { ...state, components: [...state.components, makeComponentForValue(action.value)] };

    case NODE_LABEL_CHANGE:
      return { ...state, label: action.label };

    default:
      return state;
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
