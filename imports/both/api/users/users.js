import { Meteor } from 'meteor/meteor';


export const UPDATE = 'users.update';

export const UpdateUserName = (id, name) => Meteor.call(UPDATE, id, { name });
