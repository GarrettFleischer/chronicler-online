import unid, { acquireUid, initState as initUnidState, releaseUid } from '../unid';


const SET_VALUE = 'unid.test/SET_VALUE';


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


describe('unid', () => {

  describe('normal action', () => {

    it('handles empty actions', () => {
      const unidReducer = unid(testReducer, initTestState);
      const expected = { ...initUnidState, data: { ...initTestState, uid: 0 } };
      const result = unidReducer({ ...initUnidState, data: initTestState }, {});

      expect(result).toEqual(expected);
    });

    it('handles actions with payloads', () => {
      const unidReducer = unid(testReducer, initTestState);
      const expected = { ...initUnidState, data: { ...initTestState, value: 7, uid: 0 } };
      const result = unidReducer({ ...initUnidState, data: initTestState }, setValue(7));

      expect(result).toEqual(expected);
    });

  });

  describe('acquire action', () => {

    it('handles empty actions', () => {
      const unidReducer = unid(testReducer, initTestState);
      const expected = { ...initUnidState, guid: 1, uid: 1, data: { ...initTestState, uid: 1 } };
      const result = unidReducer({ ...initUnidState, data: initTestState }, acquireUid({}));

      expect(result).toEqual(expected);
    });

    it('handles actions with payloads', () => {
      const unidReducer = unid(testReducer, initTestState);
      const expected = { ...initUnidState, guid: 1, uid: 1, data: { ...initTestState, value: 7, uid: 1 } };
      const result = unidReducer({ ...initUnidState, data: initTestState }, acquireUid(setValue(7)));

      expect(result).toEqual(expected);
    });

    it('uses released uids when available', () => {
      const unidReducer = unid(testReducer, initTestState);
      const testState = {
        ...initUnidState,
        guid: 25,
        uid: 13,
        avail: [23, 5, 9],
        data: { ...initTestState, value: 7, uid: 23 },
      };
      const expected = {
        ...initUnidState,
        guid: 25,
        uid: 23,
        avail: [5, 9],
        data: { ...initTestState, value: 7, uid: 23 },
      };

      const result = unidReducer(testState, acquireUid(setValue(7)));

      expect(result).toEqual(expected);
    });

  });

  describe('release action', () => {

    it('handles empty actions', () => {
      const unidReducer = unid(testReducer, initTestState);
      const testState = {
        ...initUnidState,
        guid: 25,
        uid: 13,
        avail: [5, 9],
        data: { ...initTestState, value: 7, uid: 23 },
      };
      const expected = {
        ...initUnidState,
        guid: 25,
        uid: 13,
        avail: [23, 5, 9],
        data: { ...initTestState, value: 7, uid: 13 },
      };

      const result = unidReducer(testState, releaseUid({}, 23));

      expect(result).toEqual(expected);
    });

    it('handles actions with payloads', () => {
      const unidReducer = unid(testReducer, initTestState);
      const testState = {
        ...initUnidState,
        guid: 25,
        uid: 13,
        avail: [5, 9],
        data: { ...initTestState, value: 7, uid: 13 },
      };
      const expected = {
        ...initUnidState,
        guid: 25,
        uid: 13,
        avail: [23, 5, 9],
        data: { ...initTestState, value: 7, uid: 13 },
      };

      const result = unidReducer(testState, releaseUid(setValue(7), 23));

      expect(result).toEqual(expected);
    });

  });

});