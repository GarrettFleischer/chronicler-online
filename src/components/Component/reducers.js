
import { SET, SET2, TEXT } from '../../data/datatypes';
import { textReducer } from '../Text/reducers';
import { setActionReducer } from '../SetAction/reducers';


export const componentReducer = (state, action) => {
  switch (state.type) {
    case TEXT:
      return textReducer(state, action);

    case SET:
    case SET2:
      return setActionReducer(state, action);

    default:
      return state;
  }
};
