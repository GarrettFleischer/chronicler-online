
import { CHOICE, NODE_LINK } from '../../data/datatypes';
import { choiceReducer } from '../Choice/reducers';
import { nodeLinkReducer } from '../NodeLink/reducers';


export const linkReducer = (state, action) => {
  switch (state.type) {
    case NODE_LINK:
      return nodeLinkReducer(state, action);

    case CHOICE:
      return choiceReducer(state, action);

    default:
      return state;
  }
};
