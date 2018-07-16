import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


const insert = 'labels.insert';
const remove = 'labels.remove';

export const AddLabel = (text, link) => Meteor.call(insert, text, link);
export const RemoveLabel = (labelId) => Meteor.call(remove, labelId);

export const Labels = new Mongo.Collection('labels');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tasks', () => Labels.find({ owner: this.userId }));
}

Meteor.methods({
  [insert]: (text, link) => {
    check(text, String);
    check(link, Object);

    // Make sure the user is logged in before inserting a label
    if (!this.userId) throw new Meteor.Error('not-authorized');

    Labels.insert({
      text,
      link,
      owner: this.userId,
    });
  },
  [remove]: (labelId) => {
    check(labelId, String);

    // Make sure the user is logged in before removing a label
    if (!this.userId) throw new Meteor.Error('not-authorized');

    Labels.remove(labelId);
  },
  // 'labels.setChecked': (taskId, setChecked) => {
  //   check(taskId, String);
  //   check(setChecked, Boolean);
  //
  //   Tasks.update(taskId, { $set: { checked: setChecked } });
  // },
});
