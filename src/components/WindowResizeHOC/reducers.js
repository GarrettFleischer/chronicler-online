export const UI_SET_DIMENSIONS = 'UI_SET_DIMENSIONS';
export const setWindowDimensions = (width, height) => ({ type: UI_SET_DIMENSIONS, width, height });

export const uiWindow = (state = uiWindowInitialState, action) => {
  switch (action.type) {
    case UI_SET_DIMENSIONS:
      return { ...state, width: action.width, height: action.height };
    default:
      return state;
  }
};

const uiWindowInitialState = ({
  width: 0,
  height: 0,
});
