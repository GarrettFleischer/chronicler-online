
export const TEXT_COMPONENT_CHANGED = 'TEXT_COMPONENT_CHANGED';

export const textComponentChanged = (id, text) => ({ type: TEXT_COMPONENT_CHANGED, id, text });

export const textReducer = (state, action) => {
  if (action.id !== state.id)
    return state;

  switch (action.type) {
    case TEXT_COMPONENT_CHANGED:
      return { ...state, text: action.text };

    default:
      return state;
  }
};
