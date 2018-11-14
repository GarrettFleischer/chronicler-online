import { Meteor } from 'meteor/meteor';
import { Nodes } from '../nodes/nodes';
import { Variables, INSERT, REMOVE, UPDATE } from './variables';


Variables.helpers({
  node() {
    return Nodes.findOne({ _id: this.nodeId });
  },
});


Meteor.methods({
  [INSERT](sceneId, name, value) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    return Variables.insert({
      owner: this.userId,
      createdOn: Date.now(),
      sceneId,
      name,
      value,
    });
  },

  [UPDATE](id, { sceneId, name, value }) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    return Variables.update({ _id: id }, {
      $set: {
        sceneId,
        name,
        value,
      },
    });
  },

  [REMOVE](id) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    return Variables.remove({ _id: id });
  },
});
