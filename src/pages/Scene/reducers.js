import { ADD_VARIABLE, DELETE_VARIABLE, variableReducer } from '../../components/Variable/reducers';
import { makeTemp } from '../../data/datatypes';
import { mapReducer } from '../../data/utilities';
import { nodeReducer } from '../Node/reducers';


export const SCENE_ADD_NODE = 'SCENE_ADD_NODE';
export const sceneAddNode = (id, node) => ({ type: SCENE_ADD_NODE, id, node });

export const SET_SCENE_NAME = 'SET_SCENE_NAME';
export const setSceneName = (id, name) => ({ type: SET_SCENE_NAME, id, name });

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
      return {
        ...newState,
        variables: (action.id === newState.id ? [...newState.variables, makeTemp('', '', action.id)] : newState.variables),
      };

    case DELETE_VARIABLE:
      return { ...newState, variables: newState.variables.filter((variable) => variable.id !== action.id) };

    case SET_SCENE_NAME:
      return { ...newState, name: action.id === newState.id ? action.name : newState.name };

    default:
      return newState;
  }
};

