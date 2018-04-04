import { takeLatest, put, call } from 'redux-saga/effects';


export const REQUEST_PROJECTS = 'REQUEST_PROJECTS';
export const requestProjects = (userId) => ({ type: REQUEST_PROJECTS, userId });

export const RECEIVE_PROJECTS = 'RECEIVE_PROJECTS';
export const receiveProjects = (projects) => ({ type: RECEIVE_PROJECTS, projects });

export const RECEIVE_PROJECTS_FAILED = 'RECEIVE_PROJECTS_FAILED';
export const receiveProjectsFailed = (msg) => ({ type: RECEIVE_PROJECTS_FAILED, msg });


const fetchProjects = async (action) => {

};

export function* onFetchProjects() {
  yield takeLatest(REQUEST_PROJECTS, fetchProjects);
}
