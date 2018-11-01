import { Meteor } from 'meteor/meteor';
import { UPDATE } from './users';


Meteor.methods({
  [UPDATE](id, { name }) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    return Meteor.users.update({ _id: id }, { $set: { profile: { $set: { name } } } });
  },
});
