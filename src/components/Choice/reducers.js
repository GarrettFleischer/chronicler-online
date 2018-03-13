import { arrayMove } from 'react-sortable-hoc';
import { linkReducer } from '../Link/reducers';
import { FINISH, makeChoiceItem, makeLink } from '../../data/datatypes';
import { mapReducer } from '../../data/utilities';

export const CHOICE_ADD_ITEM = 'CHOICE_ADD_ITEM';
export const choiceAddItem = (id) => ({ type: CHOICE_ADD_ITEM, id });

export const CHOICE_SORT_END = 'CHOICE_SORT_END';
export const choiceSortEnd = (id, oldIndex, newIndex) => ({ type: CHOICE_SORT_END, id, oldIndex, newIndex });

export const CHOICE_DELETE_ITEM = 'CHOICE_DELETE_ITEM';
export const choiceDeleteItem = (id) => ({ type: CHOICE_DELETE_ITEM, id });

export const CHOICE_ITEM_TEXT_CHANGED = 'CHOICE_ITEM_TEXT_CHANGED';
export const choiceItemTextChanged = (id, text) => ({ type: CHOICE_ITEM_TEXT_CHANGED, id, text });


export const choiceReducer = (state, action) => {
  const newState = { ...state, choices: mapReducer(state.choices, action, choiceItemReducer) };

  switch (action.type) {
    case CHOICE_ADD_ITEM:
      return { ...newState, choices: [...newState.choices, makeChoiceItem(null, null, '', makeLink(FINISH, ''))] };

    case CHOICE_SORT_END:
      return { ...newState, choices: arrayMove(newState.choices, action.oldIndex, action.newIndex) };

    case CHOICE_DELETE_ITEM:
      return { ...newState, choices: newState.choices.filter((item) => item.id !== action.id) };

    default:
      return newState;
  }
};


const choiceItemReducer = (state, action) => {
  if (state.id !== action.id)
    return { ...state, link: linkReducer(state.link, action) };

  switch (action.type) {
    case CHOICE_ITEM_TEXT_CHANGED:
      return { ...state, text: action.text };

    default:
      return state;
  }
};
