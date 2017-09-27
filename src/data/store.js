import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers/reducers';
// import rootSaga from '../sagas/sagas'; // TODO: IMPLEMENT SAGA

//  Returns the store instance
// It can  also take initialState argument when provided
export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();
  return {
    ...createStore(
      rootReducer,
      initialState,
      composeWithDevTools(applyMiddleware(sagaMiddleware)),
    ),
    // runSaga: sagaMiddleware.run(rootSaga),
  };
}
