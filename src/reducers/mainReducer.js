import immu from 'immu';


export default function mainReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export const initialState = immu({
  chronicler: {
    past: [],
    present: {
      base: {}, // initialBaseState
      unid: {}, // initialUnidState
    },
    future: [],
    canUndo: false,
    canRedo: true,
  },
});
