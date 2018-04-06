import { arrayMove } from 'react-sortable-hoc';
import { sceneReducer } from '../Scene/reducers';
import { mapReducer } from '../../data/utilities';
import { ADD_VARIABLE, DELETE_VARIABLE, variableReducer } from '../../components/Variable/reducers';
import { FINISH, makeCreate, makeLink, makeNode, makeScene } from '../../data/datatypes';


export const SET_PROJECT_TITLE = 'SET_PROJECT_TITLE';
export const setProjectTitle = (id, title) => ({ type: SET_PROJECT_TITLE, id, title });

export const SET_PROJECT_AUTHOR = 'SET_PROJECT_AUTHOR';
export const setProjectAuthor = (id, author) => ({ type: SET_PROJECT_AUTHOR, id, author });

export const ADD_SCENE = 'ADD_SCENE';
export const addScene = (id) => ({ type: ADD_SCENE, id });

export const SORT_SCENES = 'SORT_SCENES';
export const sortScenes = (id, oldIndex, newIndex) => ({ type: SORT_SCENES, id, oldIndex, newIndex });


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
      return {
        ...newState,
        variables: (action.id === newState.id ? [...newState.variables, makeCreate('', '')] : newState.variables),
      };

    case SET_PROJECT_TITLE:
      return { ...state, title: action.title };

    case SET_PROJECT_AUTHOR:
      return { ...state, author: action.author };

    case ADD_SCENE:
      return {
        ...newState,
        scenes: (action.id === newState.id ? [...newState.scenes, makeDefaultScene()] : newState.scenes),
      };

    case SORT_SCENES:
      return {
        ...newState,
        scenes: (action.id !== newState.id || action.oldIndex === 0 ? newState.scenes : arrayMove(newState.scenes, action.oldIndex, action.newIndex)) };

    default:
      return newState;
  }
};

const makeDefaultScene = () => makeScene('', [makeNode('', [], makeLink(FINISH, ''))], []);
