import { Meteor } from 'meteor/meteor';
import { Scenes } from '../scenes/scenes';
import {
  Projects, INSERT, REMOVE, UPDATE,
} from './projects';


Projects.helpers({
  scenes() {
    return Scenes.find({ projectId: this._id }, { sort: { createdOn: 1 } }).fetch();
  },
  // startScene() {
  //   return Scenes.find({ projectId: IdToStr(this._id) }).sort({ createdOn: 1 }).limit(1).fetch();
  // },
});


Meteor.methods({
  [INSERT](name, author) {
    if (!this.userId) throw new Meteor.Error('not-authorized');

    return Projects.insert({
      owner: this.userId,
      createdOn: Date.now(),
      name,
      author,
    });
  },

  [UPDATE](id, { name, author }) {
    return Projects.update({ _id: id }, { $set: { name, author } });
  },

  [REMOVE](id) {
    if (!this.userId) throw new Meteor.Error('not-authorized');

    Projects.remove({ _id: id });
  },
});

// Projects.after.insert((userId) => Scenes.insert({
//   owner: userId,
//   projectId: IdToStr(this._id),
//   name: 'startup',
// }));

Projects.before.remove((userId, doc) => Scenes.remove({ projectId: doc._id }));
