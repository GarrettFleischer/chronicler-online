import { Meteor } from 'meteor/meteor';
import { LABEL, Nodes } from '../nodes/nodes';
import { Projects } from '../projects/projects';
import {
  Scenes, INSERT, REMOVE, UPDATE,
} from './scenes';

Scenes.helpers({
  project() {
    return Projects.findOne(this.projectId);
  },
  nodes() {
    return Nodes.find({ sceneId: this._id }).fetch();
  },
  startNode() {
    return Nodes.findOne({ sceneId: this._id, parentId: null });
  },
});

Meteor.methods({
  [INSERT](name, projectId) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    return Scenes.insert({
      name,
      projectId,
      owner: this.userId,
      createdOn: Date.now(),
    });
  },

  [UPDATE](id, { name }) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    return Scenes.update({ _id: id }, { $set: { name } });
  },

  [REMOVE](id) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    return Scenes.remove({ _id: id });
  },
});


// eslint-disable-next-line func-names
Scenes.after.insert(function (userId) {
  (
    Nodes.insert({
      type: LABEL,
      owner: userId,
      text: 'start',
      sceneId: this._id,
      parentId: null,
    })
  );
});

Scenes.before.remove((userId, doc) => Nodes.remove({ sceneId: doc._id }));
