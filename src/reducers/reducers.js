import { intlReducer } from 'react-intl-redux';


export default function rootReducer(state, action) {
  return {
    ...state,
    intl: intlReducer(state.intl, action),
  };
}