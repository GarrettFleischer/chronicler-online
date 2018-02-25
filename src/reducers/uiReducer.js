export const SET_REORDERING = 'SET_REORDERING';
export const RESTORE_DEFAULT_UI = 'RESTORE_DEFAULT_UI';

export const SET_SHOW_CHOOSE_NODE_DIALOG = 'SET_SHOW_CHOOSE_NODE_DIALOG';
export const SET_CHOOSE_NODE_DIALOG_VALUE = 'SET_CHOOSE_NODE_DIALOG_VALUE';

export const setReordering = (reordering) => ({ type: SET_REORDERING, reordering });
export const restoreDefaultUI = () => ({ type: RESTORE_DEFAULT_UI });

export const setShowChooseNodeDialog = (show) => ({ type: SET_SHOW_CHOOSE_NODE_DIALOG, show });
export const setChooseNodeDialogValue = (value) => ({ type: SET_CHOOSE_NODE_DIALOG_VALUE, value });

export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    case RESTORE_DEFAULT_UI:
      return initialState;

    default:
      return {
        ...state,
        node: nodeReducer(state.node, action),
        link: linkReducer(state.link, action),
        choice: choiceReducer(state.choice, action),
      };
  }
}

export const initialState = {
  node: {
    reordering: false,
  },
  link: {
    showChooseNodeDialog: undefined,
    chooseNodeDialogValue: undefined, // id of selected node
  },
  choice: {
    reordering: undefined, // id of the choice sorting components
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

const linkReducer = (state, action) => {
  switch (action.type) {
    case SET_SHOW_CHOOSE_NODE_DIALOG:
      return { ...state, showChooseNodeDialog: action.show };

    case SET_CHOOSE_NODE_DIALOG_VALUE:
      return { ...state, chooseNodeDialogValue: action.value };

    default:
      return state;
  }
};

const choiceReducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
