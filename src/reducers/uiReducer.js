export const SET_NODE_REORDERING = 'SET_NODE_REORDERING';
export const setNodeReordering = (reordering) => ({ type: SET_NODE_REORDERING, reordering });

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

export const SET_COMPONENT_SORTING = 'SET_COMPONENT_SORTING';
export const setConditionSorting = (sorting) => ({ type: SET_COMPONENT_SORTING, sorting });

export const SET_FLOWCHART_OFFSET = 'SET_FLOWCHART_OFFSET';
export const setFlowchartOffset = (offset) => ({ type: SET_FLOWCHART_OFFSET, offset });

export const SET_FLOWCHART_DRAGGING = 'SET_FLOWCHART_DRAGGING';
export const setFlowchartDragging = (dragging) => ({ type: SET_FLOWCHART_DRAGGING, dragging });

export const SET_FLOWCHART_MOUSE = 'SET_FLOWCHART_MOUSE';
export const setFlowchartMouse = (mouse) => ({ type: SET_FLOWCHART_MOUSE, mouse });

export const SET_SCENE_VALUE = 'SET_SCENE_VALUE';
export const setSceneValue = (value) => ({ type: SET_SCENE_VALUE, value });

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
        condition: conditionReducer(state.condition, action),
        flowchart: flowchartReducer(state.flowchart, action),
        scene: sceneReducer(state.scene, action),
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
    reordering: false,
  },
  itemMenu: {
    anchorEl: null,
    showMenu: undefined,
  },
  chooseComponentDialog: {
    show: false,
    value: undefined,
  },
  condition: {
    sorting: false,
  },
  flowchart: {
    offset: { x: 100, y: 0 },
    mouse: { x: 0, y: 0, offx: 0, offy: 0 },
    dragging: false,
  },
  scene: {
    value: 0,
  },
};


const nodeReducer = (state, action) => {
  switch (action.type) {
    case SET_NODE_REORDERING:
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

const conditionReducer = (state, action) => {
  switch (action.type) {
    case SET_COMPONENT_SORTING:
      return { ...state, sorting: action.sorting };

    default:
      return state;
  }
};

const flowchartReducer = (state, action) => {
  switch (action.type) {
    case SET_FLOWCHART_OFFSET:
      return { ...state, offset: action.offset };

    case SET_FLOWCHART_DRAGGING:
      return { ...state, dragging: action.dragging };

    case SET_FLOWCHART_MOUSE:
      return { ...state, mouse: action.mouse };

    default:
      return state;
  }
};

const sceneReducer = (state, action) => {
  switch (action.type) {
    case SET_SCENE_VALUE:
      return { ...state, value: action.value };

    default:
      return state;
  }
};
