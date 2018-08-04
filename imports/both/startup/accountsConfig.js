// import { Accounts } from 'meteor/accounts-base';
import { AccountsReact } from 'meteor/meteoreact:accounts';
import { FlowRouter } from 'meteor/kadira:flow-router';

AccountsReact.configure({
  defaultState: 'signUp',
  redirects: {
    toSignUp: () => FlowRouter.go('register'),
    toSignIn: () => FlowRouter.go('login'),
    toForgotPwd: () => FlowRouter.go('forgot-password'),
    toChangePwd: () => FlowRouter.go('change-password'),
    toResetPwd: () => FlowRouter.go('reset-password'),
    toResendVerification: () => FlowRouter.go('resend-verification'),
  },
});
