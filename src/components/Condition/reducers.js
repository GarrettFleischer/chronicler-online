import { arrayMove } from 'react-sortable-hoc';
import { linkReducer } from '../Link/reducers';
import { FINISH, makeChoiceItem, makeLink } from '../../data/datatypes';

export const CHOICE_ADD_ITEM = 'CHOICE_ADD_ITEM';
export const choiceAddItem = (id) => ({ type: CHOICE_ADD_ITEM, id });

export const CHOICE_SORT_END = 'CHOICE_SORT_END';
export const choiceSortEnd = (id, oldIndex, newIndex) => ({ type: CHOICE_SORT_END, id, oldIndex, newIndex });

export const CHOICE_DELETE_ITEM = 'CHOICE_DELETE_ITEM';
export const choiceDeleteItem = (id, itemId) => ({ type: CHOICE_DELETE_ITEM, id, itemId });

export const CHOICE_ITEM_TEXT_CHANGED = 'CHOICE_ITEM_TEXT_CHANGED';
export const choiceItemTextChanged = (id, text) => ({ type: CHOICE_ITEM_TEXT_CHANGED, id, text });


export const choiceReducer = (state, action) => {
  if (state.id !== action.id)
    return { ...state, choices: state.choices.map(choiceMapper(action)) };

  switch (action.type) {
    case CHOICE_ADD_ITEM:
      return { ...state, choices: [...state.choices, makeChoiceItem(null, null, '', makeLink(FINISH, ''))] };

    case CHOICE_SORT_END:
      return { ...state, choices: arrayMove(state.choices, action.oldIndex, action.newIndex) };


    case CHOICE_DELETE_ITEM:
      return { ...state, choices: state.choices.filter((item) => item.id !== action.itemId) };

    default:
      return state;
  }
};

const choiceMapper = (action) => (state) => choiceItemReducer(state, action);

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
