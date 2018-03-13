import { sceneReducer } from '../Scene/reducers';
import { variableReducer } from '../../reducers/reducers';
import { mapReducer } from '../../data/utilities';

// export const projectReducer = (state, action) => ({ ...state, scenes: state.scenes.map(sceneMapper(action)) });

export const projectReducer = (state, action) => ({
  ...state,
  scenes: mapReducer(state.scenes, action, sceneReducer),
  variables: mapReducer(state.variables, action, variableReducer),
});

const sceneMapper = (action) => (state) => sceneReducer(state, action);
// const variableMapper = (action) => (state) => variableReducer(state, action);
