import PouchMiddleWare from 'pouch-redux-middleware';
import PouchDB from 'pouchdb';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { batchInsert, insert, remove, update } from '../reducers/pouchReducer';
import rootReducer from '../reducers/reducers';
// import rootSaga from '../sagas/sagas'; // TODO: IMPLEMENT SAGA

//  Returns the store instance
// It can  also take initialState argument when provided
const configureStore = (initialState = {}) => {
  const sagaMiddleware = createSagaMiddleware();
  const db = new PouchDB('chronicler');
  const pouchMiddleWare = PouchMiddleWare({
    path: '/',
    db,
    actions: {
      remove,
      insert,
      batchInsert,
      update,
    },
  });

  return {
    ...createStore(
      rootReducer,
      initialState,
      composeWithDevTools(applyMiddleware(sagaMiddleware, pouchMiddleWare)),
    ),
    // runSaga: sagaMiddleware.run(rootSaga),
  };
};

export default configureStore;
