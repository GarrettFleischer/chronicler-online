import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import lifecycle from 'react-pure-lifecycle';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { resetLogin, setEmail, setPassword, setRegister, setUsername } from '../../reducers/uiReducer';
import Align from '../../components/Align';
import { loginAsync } from '../../sagas/api';

// TODO use intl
const Login = ({ ui, onRegisterChange, onUsernameChange, onPasswordChange, onEmailChange, onLogin, onRegister }) => (
  <Align container>
    <Align center>
      <div style={{ marginBottom: '15px' }}>
        <TextField
          onChange={onEmailChange}
          label={'Email'}
          value={ui.email}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        {ui.register &&
        <TextField
          onChange={onUsernameChange}
          label={'Username'}
          value={ui.username}
        />}
      </div>
      <div style={{ marginBottom: '15px' }}>
        <TextField
          type="password"
          onChange={onPasswordChange}
          label={'Password'}
          value={ui.password}
        />
      </div>
      <Button onClick={onRegisterChange(!ui.register)}>{ui.register ? 'Login' : 'Register'}</Button>
      <Button onClick={() => ui.register ? onRegister(ui) : onLogin(ui)}>{ui.register ? 'Register' : 'Login'}</Button>
    </Align>
  </Align>
  );

Login.propTypes = {
  ui: PropTypes.object.isRequired,
// eslint-disable-next-line react/no-unused-prop-types
  resetUI: PropTypes.func.isRequired,
  onRegisterChange: PropTypes.func.isRequired,
  onUsernameChange: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  ui: state.ui.login,
});

const mapDispatchToProps = (dispatch) => ({
  resetUI: () => {
    dispatch(resetLogin());
  },
  onRegisterChange: (register) => () => {
    dispatch(setRegister(register));
  },
  onUsernameChange: (event) => {
    dispatch(setUsername(event.target.value));
  },
  onPasswordChange: (event) => {
    dispatch(setPassword(event.target.value));
  },
  onEmailChange: (event) => {
    dispatch(setEmail(event.target.value));
  },
  onLogin: ({ email, password }) => {
    dispatch(loginAsync(email, password));
  },
  onRegister: ({ email, username, password }) => {
  },
});

const methods = {
  componentWillMount: ({ resetUI }) => {
    resetUI();
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(lifecycle(methods)(Login));
