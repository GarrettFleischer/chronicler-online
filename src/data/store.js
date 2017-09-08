import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers/reducers';
import { localDB, pouchMiddleWare, remoteDB } from './pouchMiddleWare';
// import rootSaga from '../sagas/sagas'; // TODO: IMPLEMENT SAGA

//  Returns the store instance
// It can  also take initialState argument when provided
export default function configureStore() {
  // TODO find a better way to handle synchronization
  localDB.sync(remoteDB, { live: true });

  const sagaMiddleware = createSagaMiddleware();
  return {
    ...createStore(
      rootReducer,
      undefined,
      composeWithDevTools(applyMiddleware(sagaMiddleware, pouchMiddleWare)),
    ),
    // runSaga: sagaMiddleware.run(rootSaga),
  };
}
