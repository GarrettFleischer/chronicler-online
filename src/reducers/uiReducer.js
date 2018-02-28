export const SET_REORDERING = 'SET_REORDERING';
export const setReordering = (reordering) => ({ type: SET_REORDERING, reordering });

export const RESTORE_DEFAULT_UI = 'RESTORE_DEFAULT_UI';
export const restoreDefaultUI = () => ({ type: RESTORE_DEFAULT_UI });

export const SET_SHOW_CHOOSE_NODE_DIALOG = 'SET_SHOW_CHOOSE_NODE_DIALOG';
export const setShowChooseNodeDialog = (show) => ({ type: SET_SHOW_CHOOSE_NODE_DIALOG, show });

export const SET_CHOOSE_NODE_DIALOG_VALUE = 'SET_CHOOSE_NODE_DIALOG_VALUE';
export const setChooseNodeDialogValue = (value) => ({ type: SET_CHOOSE_NODE_DIALOG_VALUE, value });

export const SET_CHOICE_REORDERING = 'SET_CHOICE_REORDERING';
export const setChoiceReordering = (reordering) => ({ type: SET_CHOICE_REORDERING, reordering });

export const SET_ITEM_MENU = 'SET_ITEM_MENU';
export const setItemMenu = (anchorEl, showMenu) => ({ type: SET_ITEM_MENU, anchorEl, showMenu });

export const SET_SHOW_CHOOSE_COMPONENT_DIALOG = 'SET_SHOW_CHOOSE_COMPONENT_DIALOG';
export const setShowChooseComponentDialog = (show) => ({ type: SET_SHOW_CHOOSE_COMPONENT_DIALOG, show });

export const SET_CHOOSE_COMPONENT_DIALOG_VALUE = 'SET_CHOOSE_COMPONENT_DIALOG_VALUE';
export const setChooseComponentDialogValue = (value) => ({ type: SET_CHOOSE_COMPONENT_DIALOG_VALUE, value });

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
        itemMenu: itemMenuReducer(state.itemMenu, action),
        chooseComponentDialog: chooseComponentDialogReducer(state.chooseComponentDialog, action),
      };
  }
}

export const initialState = {
  node: {
    reordering: false,
  },
  link: {
    showChooseNodeDialog: undefined,
    chooseNodeDialogValue: undefined, // PropTypeId of selected node
  },
  choice: {
    anchorEl: null,
    showMenu: undefined,
    reordering: false, // PropTypeId of the choice sorting components
  },
  itemMenu: {
    anchorEl: null,
    showMenu: undefined,
  },
  chooseComponentDialog: {
    show: false,
    value: undefined,
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
    case SET_CHOICE_REORDERING:
      return { ...state, reordering: action.reordering };

    default:
      return state;
  }
};

const itemMenuReducer = (state, action) => {
  switch (action.type) {
    case SET_ITEM_MENU:
      return { ...state, anchorEl: action.anchorEl, showMenu: action.showMenu };

    default:
      return state;
  }
};


const chooseComponentDialogReducer = (state, action) => {
  switch (action.type) {
    case SET_SHOW_CHOOSE_COMPONENT_DIALOG:
      return { ...state, show: action.show };

    case SET_CHOOSE_COMPONENT_DIALOG_VALUE:
      return { ...state, value: action.value };

    default:
      return state;
  }
};
