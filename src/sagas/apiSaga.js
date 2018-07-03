import fetch from 'node-fetch';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { loginFailure, loginSuccess, registerFailure, registerSuccess } from '../reducers/apiReducer';


export const LOGIN_ASYNC = 'LOGIN_ASYNC';
export const loginAsync = (name, password) => ({ type: LOGIN_ASYNC, name, password });

export const REGISTER_ASYNC = 'REGISTER_ASYNC';
export const registerAsync = (email, name, password) => ({ type: REGISTER_ASYNC, email, name, password });

export const REQUEST_PROJECTS_ASYNC = 'REQUEST_PROJECTS_ASYNC';
export const requestProjectsAsync = (userId) => ({ type: REQUEST_PROJECTS_ASYNC, userId });


const postJSON = (params) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(params),
});

// const getUser = () => ({
//   method: 'GET',
//   headers: { 'x-access-token': window.sessionStorage.getItem('token') },
// });

function* onLoginAsync() {
  yield takeLatest(LOGIN_ASYNC, login);
}

function* login({ name, password }) {
  try {
    const response = yield call(fetch, 'http://localhost:3001/users/login', postJSON({ name, password }));
    const data = yield response.json();
    if (data.auth) {
      window.sessionStorage.setItem('token', data.token);
      yield put(loginSuccess(data.user));
    } else
      yield put(loginFailure(data.err));
  } catch (e) {
    yield put(loginFailure());
  }
}

function* onRegisterAsync() {
  yield takeLatest(REGISTER_ASYNC, register);
}

function* register({ email, name, password }) {
  try {
    const response = yield call(fetch, 'http://localhost:3001/users/register', postJSON({ email, name, password }));
    const data = yield response.json();
    if (data.auth) {
      window.sessionStorage.setItem('token', data.token);
      yield put(registerSuccess(data.user));
    } else
      yield put(registerFailure(data.err));
  } catch (e) {
    yield put(registerFailure());
  }
}

function* onFetchProjects() {
  yield takeLatest(REQUEST_PROJECTS_ASYNC, fetchProjects);
}

function* fetchProjects() {
  return yield null;
}


export default function* apiSaga() {
  yield all([
    onRegisterAsync(),
    onLoginAsync(),
    onFetchProjects(),
  ]);
}
