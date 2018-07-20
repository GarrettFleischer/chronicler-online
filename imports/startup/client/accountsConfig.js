import { Accounts } from 'meteor/accounts-base';


// noinspection JSCheckFunctionSignatures
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});
