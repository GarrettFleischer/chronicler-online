import { arrayMove } from 'react-sortable-hoc';
import { linkReducer } from '../Link/reducers';
import { ELSE, ELSEIF, FINISH, IF, makeElse, makeLink } from '../../data/datatypes';

export const CONDITION_ADD_ITEM = 'CONDITION_ADD_ITEM';
export const conditionAddItem = (id) => ({ type: CONDITION_ADD_ITEM, id });

export const CONDITION_SORT_END = 'CONDITION_SORT_END';
export const conditionSortEnd = (id, oldIndex, newIndex) => ({ type: CONDITION_SORT_END, id, oldIndex, newIndex });

export const CONDITION_DELETE_ITEM = 'CONDITION_DELETE_ITEM';
export const conditionDeleteItem = (id, itemId) => ({ type: CONDITION_DELETE_ITEM, id, itemId });

export const CONDITION_ITEM_TEXT_CHANGED = 'CONDITION_ITEM_TEXT_CHANGED';
export const conditionItemTextChanged = (id, text) => ({ type: CONDITION_ITEM_TEXT_CHANGED, id, text });


export const conditionReducer = (state, action) => {
  if (state.id !== action.id)
    return { ...state, conditions: state.conditions.map(conditionMapper(action)) };

  switch (action.type) {
    case CONDITION_ADD_ITEM:
      return { ...state, conditions: ([...state.conditions, makeElse(makeLink(FINISH, ''))]).map(conditionMapper(action)) };

    case CONDITION_SORT_END:
      if (action.oldIndex !== action.newIndex)
        return { ...state, conditions: (arrayMove(state.conditions, action.oldIndex, action.newIndex)).map(conditionMapper(action)) };
      return state;

    case CONDITION_DELETE_ITEM:
      return { ...state, conditions: (state.conditions.filter((item) => item.id !== action.itemId)).map(conditionMapper(action)) };

    default:
      return state;
  }
};

const conditionMapper = (action) => (state, index, conditions) => convert(index, conditions)(conditionItemReducer(state, index, conditions, action));

const conditionItemReducer = (state, index, conditions, action) => {
  if (state.id !== action.id)
    return { ...state, link: linkReducer(state.link, action) };

  switch (action.type) {
    case CONDITION_ITEM_TEXT_CHANGED:
      return { ...state, condition: action.text };

    default:
      return state;
  }
};

const convert = (index, conditions) => (state) => {
  if (!conditions)
    return state;

  switch (state.type) {
    case IF:
      if (index > 0) {
        if (index === (conditions.length - 1) && state.condition && !state.condition.length)
          return convertElse(state);
        return convertElseIf(state);
      }
      return state;

    case ELSEIF:
      if (index === (conditions.length - 1) && (!state.condition || !state.condition.length))
        return convertElse(state);
      else if (index === 0)
        return convertIf(state);
      return state;

    case ELSE:
      if (index < (conditions.length - 1) || (state.condition && state.condition.length))
        return convertElseIf(state);
      else if (index === 0)
        return convertIf(state);
      return state;

    default:
      return state;
  }
};

const convertIf = (state) => ({ ...state, type: IF, condition: state.condition || '' });
const convertElseIf = (state) => ({ ...state, type: ELSEIF, condition: state.condition || '' });
const convertElse = (state) => ({ ...state, type: ELSE, condition: undefined });
