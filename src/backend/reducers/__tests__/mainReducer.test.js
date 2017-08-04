import mainReducer, {initialState} from '../mainReducer';

it('has an initial state', () => {
  expect(mainReducer(undefined, {})).toEqual(initialState);
});
