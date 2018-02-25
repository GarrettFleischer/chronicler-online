import { linkReducer } from '../Link/reducers';
import { FINISH, makeChoiceItem, makeLink } from '../../data/datatypes';

export const CHOICE_ADD_ITEM = 'CHOICE_ADD_ITEM';
export const CHOICE_ITEM_TEXT_CHANGED = 'CHOICE_ITEM_TEXT_CHANGED';

export const choiceAddItem = (id) => ({ type: CHOICE_ADD_ITEM, id });
export const choiceItemTextChanged = (id, text) => ({ type: CHOICE_ITEM_TEXT_CHANGED, id, text });

export const choiceReducer = (state, action) => {
  if (state.id !== action.id)
    return { ...state, choices: state.choices.map(choiceMapper(action)) };

  switch (action.type) {
    case CHOICE_ADD_ITEM:
      // TODO change this to a FINISH link
      return { ...state, choices: [...state.choices, makeChoiceItem(null, null, '', makeLink(FINISH, ''))] };

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
