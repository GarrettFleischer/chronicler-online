import { Meteor } from 'meteor/meteor';
import { Components } from '../components/components';
import { Scenes } from '../scenes/scenes';
import {
  Nodes, INSERT, REMOVE, UPDATE,
} from './nodes';


Nodes.helpers({
  scene() {
    return Scenes.findOne({ _id: this.sceneId });
  },
  children() {
    return Nodes.find({ parentId: this._id }).fetch();
  },
  components() {
    return Components.find({ nodeId: this._id }).fetch();
  },
});


Meteor.methods({
  [INSERT](text, sceneId, parentId) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    return Nodes.insert({
      owner: this.userId,
      text,
      sceneId,
      parentId,
    });
  },

  [UPDATE](id, { text }) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    return Nodes.update({ _id: id }, { $set: { text } });
  },

  [REMOVE](id) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    return Nodes.remove({ _id: id });
  },
});

Nodes.before.remove((userId, doc) => {
  Nodes.remove({ parentId: doc._id });
  Components.remove({ nodeId: doc._id });
});
