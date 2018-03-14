import { nodeReducer } from '../Node/reducers';
import { mapReducer } from '../../data/utilities';
import { ADD_VARIABLE, DELETE_VARIABLE, variableReducer } from '../../components/Variable/reducers';
import { makeTemp } from '../../data/datatypes';


export const SCENE_ADD_NODE = 'SCENE_ADD_NODE';

export const sceneAddNode = (id, node) => ({ type: SCENE_ADD_NODE, id, node });

export const sceneReducer = (state, action) => {
  const newState = {
    ...state,
    nodes: mapReducer(state.nodes, action, nodeReducer),
    variables: mapReducer(state.variables, action, variableReducer),
  };

  switch (action.type) {
    case SCENE_ADD_NODE:
      return { ...newState, nodes: [...newState.nodes, action.node] };

    case ADD_VARIABLE:
      return { ...newState, variables: (action.id === newState.id ? [...newState.variables, makeTemp('', '', action.id)] : newState.variables) };

    case DELETE_VARIABLE:
      return { ...newState, variables: newState.variables.filter((variable) => variable.id !== action.id) };

    default:
      return newState;
  }
};

