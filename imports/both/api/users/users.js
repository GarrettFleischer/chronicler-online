import { Meteor } from 'meteor/meteor';


export const UPDATE_USERNAME = 'users.update_username';

export const UpdateUserName = (id, name) => Meteor.call(UPDATE_USERNAME, id, { name });
