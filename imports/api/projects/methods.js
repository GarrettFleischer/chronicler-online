import { Meteor } from 'meteor/meteor';
import { Scenes } from '../scenes/scenes';
import { Projects, INSERT, REMOVE } from './projects';


Projects.helpers({
  scenes() {
    return Scenes.find({ projectId: this._id }).fetch();
  },
});


Meteor.methods({
  [INSERT]: (name, author) => {
    // Make sure the user is logged in before inserting a project
    if (!this.userId) throw new Meteor.Error('not-authorized');

    Projects.insert({
      owner: this.userId,
      name,
      author,
    });
  },
  [REMOVE]: (id) => {
    // Make sure the user is logged in before removing a label
    if (!this.userId) throw new Meteor.Error('not-authorized');

    Projects.remove(id);
  },
  // 'labels.setChecked': (taskId, setChecked) => {
  //   check(taskId, String);
  //   check(setChecked, Boolean);
  //
  //   Tasks.update(taskId, { $set: { checked: setChecked } });
  // },
});


Projects.before.remove((userId, doc) => Scenes.remove({ projectId: doc._id }));
