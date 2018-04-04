export const ACTION_HISTORY_CLEAR = 'ACTION_HISTORY_CLEAR';
export const actionHistoryClear = () => ({ type: ACTION_HISTORY_CLEAR });


export default (filter = () => true) => (state = initState, action) => {
  switch (action.type) {
    case ACTION_HISTORY_CLEAR:
      return [];

    default:
      return filter(action) ? [...state, action] : state;
  }
};

const initState = [];
