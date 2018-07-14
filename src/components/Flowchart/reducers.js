export const UI_FLOWCHART_SELECTED = 'UI_FLOWCHART_SELECTED';
export const setFlowchartSelection = (id) => ({ type: UI_FLOWCHART_SELECTED, id });

export const uiFlowchart = (state = uiFlowchartInitialState, action) => {
  switch (action.type) {
    case UI_FLOWCHART_SELECTED:
      return { ...state, selected: action.id };
    default:
      return state;
  }
};

const uiFlowchartInitialState = {
  selected: null
};
