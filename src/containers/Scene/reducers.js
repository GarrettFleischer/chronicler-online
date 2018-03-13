import { nodeReducer } from '../Node/reducers';
import { mapReducer } from '../../data/utilities';
import { variableReducer } from '../../components/Variable/reducers';


export const SCENE_ADD_NODE = 'SCENE_ADD_NODE';

export const sceneAddNode = (id, node) => ({ type: SCENE_ADD_NODE, id, node });

export const sceneReducer = (state, action) => {
  if (state.id !== action.id) {
    return {
      ...state,
      nodes: mapReducer(state.nodes, action, nodeReducer),
      variables: mapReducer(state.variables, action, variableReducer),
    };
  }

  switch (action.type) {
    case SCENE_ADD_NODE:
      return { ...state, nodes: [...state.nodes, action.node] };

    default:
      return state;
  }
};

