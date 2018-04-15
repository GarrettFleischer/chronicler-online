import { all } from 'redux-saga/effects';
import apiSaga from './apiSaga';
import fileSystemSaga from './filesystemSaga';

export default function* rootSaga() {
  yield all([
    apiSaga(),
    fileSystemSaga(),
  ]);
}
