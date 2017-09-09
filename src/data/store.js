import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers/reducers';
import { pouchMiddleWare } from './pouchMiddleWare';
// import rootSaga from '../sagas/sagas'; // TODO: IMPLEMENT SAGA

//  Returns the store instance
// It can  also take initialState argument when provided
export default function configureStore() {
  // TODO find a better way to handle synchronization
// eslint-disable-next-line no-console
//   localDB.sync(remoteDB, { live: true, retry: true }).on('error', console.log.bind(console));

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
