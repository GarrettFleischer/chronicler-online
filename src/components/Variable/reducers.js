export const SET_VARIABLE_NAME = 'SET_VARIABLE_NAME';
export const setVariableName = (id, name) => ({ type: SET_VARIABLE_NAME, id, name });

export const SET_VARIABLE_VALUE = 'SET_VARIABLE_VALUE';
export const setVariableValue = (id, value) => ({ type: SET_VARIABLE_VALUE, id, value });

export const DELETE_VARIABLE = 'DELETE_VARIABLE';
export const deleteVariable = (id) => ({ type: DELETE_VARIABLE, id });

export const variableReducer = (state, action) => {
  if (state.id !== action.id) return state;

  switch (action.type) {
    case SET_VARIABLE_NAME:
      return { ...state, name: action.name };

    case SET_VARIABLE_VALUE:
      return { ...state, value: action.value };

    default:
      return state;
  }
};
