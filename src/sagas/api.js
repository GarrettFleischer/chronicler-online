import { takeLatest, all, put, call } from 'redux-saga/effects';
import fetch from 'node-fetch';

export const LOGIN_ASYNC = 'LOGIN_ASYNC';
export const loginAsync = (email, password) => ({ type: LOGIN_ASYNC, email, password });

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const loginSuccess = (result) => ({ type: LOGIN_SUCCESS, result });

export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const loginFailure = (result) => ({ type: LOGIN_FAILURE, result });

export const REGISTER_ASYNC = 'REGISTER_ASYNC';
export const registerAsync = (email, username, password) => ({ type: REGISTER_ASYNC, email, username, password });

export const REQUEST_PROJECTS = 'REQUEST_PROJECTS';
export const requestProjects = (userId) => ({ type: REQUEST_PROJECTS, userId });

export const RECEIVE_PROJECTS = 'RECEIVE_PROJECTS';
export const receiveProjects = (projects) => ({ type: RECEIVE_PROJECTS, projects });

export const RECEIVE_PROJECTS_FAILED = 'RECEIVE_PROJECTS_FAILED';
export const receiveProjectsFailed = (msg) => ({ type: RECEIVE_PROJECTS_FAILED, msg });

const postJSON = (params) => ({
  method: 'post',
  mode: 'no-cors',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(params),
});

function* onLoginAsync() {
  yield takeLatest(LOGIN_ASYNC, login);
}

function* login({ email, password }) {
  const pjson = postJSON({ email, password });
  console.log('postJSON: ', pjson);
  try {
    const response = yield call(fetch, 'http://localhost:3001/users/login', pjson);
    // const user = yield response.json();
    console.log('response: ', response);
    return response;
  } catch (e) {
    console.log('e: ', e);
    return null;
  }
}

function* onFetchProjects() {
  yield takeLatest(REQUEST_PROJECTS, fetchProjects);
}

function* fetchProjects(action) {

}


export default function* apiSaga() {
  yield all([
    onLoginAsync(),
    onFetchProjects(),
  ]);
}
