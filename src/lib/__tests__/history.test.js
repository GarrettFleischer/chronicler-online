import history, { initState as initHistoryState, merge } from '../history';


const SET_VALUE = 'history.test/SET_VALUE';


function testReducer(state = initTestState, action) {
  switch (action.type) {
    case SET_VALUE:
      return { ...state, value: action.value };

    default:
      return state;
  }
}


function setValue(value) {
  return { type: SET_VALUE, value };
}


const initTestState = { key: 'foo', value: 23 };


describe('history', () => {
  describe('merge', () => {
    it('can merge into present state if the previous action was of the same type', () => {
      const historyReducer = history(testReducer, initTestState);
      const present = { key: 'foo', value: 7 };
      const expected = {
        ...initHistoryState,
        past: [initTestState],
        present,
        canUndo: true,
        lastActionType: SET_VALUE
      };

      let result = historyReducer({ ...initHistoryState, present: initTestState }, setValue(15));
      result = historyReducer(result, merge(setValue(7)));

      expect(result).toEqual(expected);
    });
  });
});
