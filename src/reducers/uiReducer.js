export const SET_REORDERING = 'SET_REORDERING';
export const RESTORE_DEFAULT_UI = 'RESTORE_DEFAULT_UI';

export const setReordering = (reordering) => ({
  type: SET_REORDERING,
  reordering,
});

export const restoreDefaultUI = () => ({ type: RESTORE_DEFAULT_UI });

export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    case RESTORE_DEFAULT_UI:
      return initialState;

    default:
      return { ...state, node: nodeReducer(state.node, action) };
  }
}

export const initialState = {
  ui: {
    node: {
      reordering: false,
    },
  },
};


const nodeReducer = (state, action) => {
  switch (action.type) {
    case SET_REORDERING:
      return { ...state, reordering: action.reordering };

    default:
      return state;
  }
};
