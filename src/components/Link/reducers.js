
import { CHOICE, CONDITION, IF, NODE_LINK } from '../../data/datatypes';
import { choiceReducer } from '../Choice/reducers';
import { nodeLinkReducer } from '../NodeLink/reducers';
import { conditionReducer } from '../Condition/reducers';


export const linkReducer = (state, action) => {
  switch (state.type) {
    case NODE_LINK:
      return nodeLinkReducer(state, action);

    case CHOICE:
      return choiceReducer(state, action);

    case CONDITION:
      return conditionReducer(state, action);

    default:
      return state;
  }
};
