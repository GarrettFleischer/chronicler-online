
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, user });
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const loginFailure = (err) => ({ type: LOGIN_FAILURE, err });


export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const registerSuccess = (user) => ({ type: REGISTER_SUCCESS, user });
export const REGISTER_FAILURE = 'REGISTER_FAILURE';
export const registerFailure = (err) => ({ type: REGISTER_FAILURE, err });


export const REQUEST_PROJECTS_SUCCESS = 'REQUEST_PROJECTS_SUCCESS';
export const requestProjectsSuccess = (projects) => ({ type: REQUEST_PROJECTS_SUCCESS, projects });

export const REQUEST_PROJECTS_FAILURE = 'REQUEST_PROJECTS_FAILURE';
export const requestProjectsFailure = (msg) => ({ type: REQUEST_PROJECTS_FAILURE, msg });


export const apiReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return { ...state, user: action.user };

    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return { ...state, user: null };

    default:
      return state;
  }
};


export const initialState = {
  user: null,
};
