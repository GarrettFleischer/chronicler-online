import { sceneReducer } from '../Scene/reducers';
import { mapReducer } from '../../data/utilities';
import { ADD_VARIABLE, DELETE_VARIABLE, variableReducer } from '../../components/Variable/reducers';
import { makeCreate } from '../../data/datatypes';

export const projectReducer = (state, action) => {
  const newState = ({
    ...state,
    scenes: mapReducer(state.scenes, action, sceneReducer),
    variables: mapReducer(state.variables, action, variableReducer),
  });

  switch (action.type) {
    case DELETE_VARIABLE:
      return { ...newState, variables: newState.variables.filter((variable) => variable.id !== action.id) };

    case ADD_VARIABLE:
      return { ...newState, variables: (action.id === newState.id ? [...newState.variables, makeCreate('', '')] : newState.variables) };

    default:
      return newState;
  }
};
