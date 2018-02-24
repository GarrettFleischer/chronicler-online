
export const NODE_LINK_CHANGED = 'NODE_LINK_CHANGED';

export const nodeLinkChanged = (id, nodeId) => ({ type: NODE_LINK_CHANGED, id, nodeId });

export const nodeLinkReducer = (state, action) => {
  if (action.id !== state.id)
    return state;

  switch (action.type) {
    case NODE_LINK_CHANGED:
      return { ...state, node: action.nodeId };

    default:
      return state;
  }
};
