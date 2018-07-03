import { all, call, put, takeEvery } from 'redux-saga/effects';


export const READ_FILE_ASYNC = 'READ_FILE_ASYNC';
export const readFileAsync = (file, action) => ({ type: READ_FILE_ASYNC, file, action });


const readFilePromise = (file) => (
  new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsText(file);
  })
);

function* onReadFileAsync() {
  yield takeEvery(READ_FILE_ASYNC, readFile);
}

function* readFile({ file, action }) {
  try {
    const data = yield call(readFilePromise, file);
    yield put(action({ name: file.name, data }));
  } catch (e) {
    // TODO put error action
    console.log('readFile error: ', e);
  }
}


export default function* fileSystemSaga() {
  yield all([
    onReadFileAsync(),
  ]);
}
