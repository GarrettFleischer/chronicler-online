import { sceneReducer } from '../Scene/reducers';
import { mapReducer } from '../../data/utilities';
import { DELETE_VARIABLE, variableReducer } from '../../components/Variable/reducers';

export const projectReducer = (state, action) => {
  const newState = ({
    ...state,
    scenes: mapReducer(state.scenes, action, sceneReducer),
    variables: mapReducer(state.variables, action, variableReducer),
  });

  switch (action.type) {
    case DELETE_VARIABLE:
      return { ...newState, variables: newState.variables.filter((variable) => variable.id !== action.id) };

    default:
      return newState;
  }
};
