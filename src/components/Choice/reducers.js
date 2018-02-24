export const CHOICE_ITEM_TEXT_CHANGED = 'CHOICE_ITEM_TEXT_CHANGED';

export const choiceItemTextChanged = (id, text) => ({ type: CHOICE_ITEM_TEXT_CHANGED, id, text });

export const choiceReducer = (state, action) => {
  if (state.id !== action.id)
    return { ...state, choices: state.choices.map(choiceMapper(action)) };

  switch (action.type) {
    default:
      return state;
  }
};

const choiceMapper = (action) => (state) => choiceItemReducer(state, action);

const choiceItemReducer = (state, action) => {
  if (state.id !== action.id)
    return state;

  switch (action.type) {
    case CHOICE_ITEM_TEXT_CHANGED:
      return { ...state, text: action.text };

    default:
      return state;
  }
};
