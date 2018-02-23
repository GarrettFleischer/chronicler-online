import { nodeReducer } from '../Node/reducers';


export const SCENE_ADD_NODE = 'SCENE_ADD_NODE';

export const sceneAddNode = (id, node) => ({ type: SCENE_ADD_NODE, id, node });

export const sceneReducer = (state, action) => {
  if (state.id !== action.id) return { ...state, nodes: state.nodes.map(nodeMapper(action)) };

  switch (action.type) {
    case SCENE_ADD_NODE:
      return { ...state, nodes: [...state.nodes, action.node] };

    default:
      return state;
  }
};

const nodeMapper = (action) => (state) => nodeReducer(state, action);
