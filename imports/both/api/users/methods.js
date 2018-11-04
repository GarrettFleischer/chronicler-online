import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { UPDATE_USERNAME } from './users';


Meteor.methods({
  [UPDATE_USERNAME](id, { name }) {
    Accounts.setUsername(id, name);
  },
});
