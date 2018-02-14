
export const SET_VARIABLE_CHANGED = 'SET_VARIABLE_CHANGED';

export const setVariableChanged = (id, variableId) => ({ type: SET_VARIABLE_CHANGED, id, variableId });

export const setActionReducer = (state, action) => {
  if (action.id !== state.id)
    return state;

  switch (action.type) {
    case SET_VARIABLE_CHANGED:
      return { ...state, variableId: action.variableId };

    default:
      return state;
  }
};
