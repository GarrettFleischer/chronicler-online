import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import Schema from 'simpl-schema';


const insert = 'projects.insert';
const remove = 'projects.remove';

export const AddProject = (title) => Meteor.call(insert, title);
export const RemoveProject = (projectId) => Meteor.call(remove, projectId);

export const LabelSchema = new Schema({
  title: String,
  owner: { type: String, regEx: Schema.RegEx.Id },
  collaborators: { type: new Array({ type: String, regEx: Schema.RegEx.Id }), defaultValue: [] },

});

export const Labels = new Mongo.Collection('projects');

Meteor.methods({
  [insert]: (title) => {
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
