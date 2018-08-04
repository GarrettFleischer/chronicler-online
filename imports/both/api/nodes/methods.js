import { Meteor } from 'meteor/meteor';
import { Components } from '../components/components';
import { Scenes } from '../scenes/scenes';
import { Nodes, INSERT, REMOVE, UPDATE, LABEL } from './nodes';


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
  [INSERT](type, text, sceneId, parentId) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    return Nodes.insert({
      owner: this.userId,
      createdOn: Date.now(),
      type,
      text,
      sceneId,
      parentId,
    });
  },

  [UPDATE](id, { text, parentId }) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    const node = Nodes.findOne({ _id: id });
    if (parentId && node.type !== LABEL) throw new Meteor.Error('modify-parentId-of-non-label');
    return Nodes.update({ _id: id }, { $set: { text, parentId } });
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
