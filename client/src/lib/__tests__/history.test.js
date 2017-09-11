import history, { initState as initHistoryState, merge, MERGE } from '../history';


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
  describe('undo', () => {
    it('does nothing if the given number of changes is less than 1', () => {

    });

    it('does nothing if the given number of changes exceed the size of the past states', () => {

    });

    it('undoes 1 action', () => {

    });

    it('undoes multiple actions', () => {

    });
  });

  describe('redo', () => {
    it('does nothing if the given number of changes is less than 1', () => {

    });

    it('does nothing if the given number of changes exceed the size of the future states', () => {

    });

    it('undoes 1 action', () => {

    });

    it('undoes multiple actions', () => {

    });
  });

  describe('merge', () => {
    it('can merge into present state if the previous action was of the same type and marked mergeable', () => {
      const historyReducer = history(testReducer, initTestState);
      const past = [{ ...initTestState, value: 15 }, initTestState];
      const present = { ...initTestState, value: 723 };
      const expected = {
        ...initHistoryState,
        past,
        present,
        canUndo: true,
        lastActionType: `${MERGE}/${SET_VALUE}`,
      };

      let result = historyReducer({ ...initHistoryState, present: initTestState }, setValue(15));
      result = historyReducer(result, merge(setValue(7)));
      result = historyReducer(result, merge(setValue(723)));

      expect(result).toEqual(expected);
    });

    it('ignores undo and redo actions', () => {

    });

    it('will not merge actions of different types', () => {

    });
  });
});
