
export const APP_SYNC_DATA = 'App/APP_SYNC_DATA';


export const syncData = () => ({
  type: APP_SYNC_DATA,
});


export function appReducer(state, action) {
  switch (action.type) {
    case APP_SYNC_DATA:
      return {
        ...state,
      };

    default:
      return state;
  }
}
