import { Meteor } from 'meteor/meteor';
import { findById, toId } from '../../logic/utils';
import { Scenes } from '../scenes/scenes';
import {
  Nodes, INSERT, REMOVE, UPDATE,
} from './nodes';


Nodes.helpers({
  scene() {
    return Scenes.findOne(toId(this.sceneId));
  },
});


Meteor.methods({
  [INSERT](name, sceneId, link) {
    // Make sure the user is logged in before inserting a project
    if (!this.userId) throw new Meteor.Error('not-authorized');

    return Nodes.insert({
      owner: this.userId,
      start: false,
      name,
      sceneId,
      link,
    });
  },

  [UPDATE](id, { name, link }) {
    return Nodes.update(toId(id), { name, link });
  },

  [REMOVE](id) {
    // Make sure the user is logged in before removing a label
    if (!this.userId) throw new Meteor.Error('not-authorized');
    const node = findById(Nodes, id);
    if (node && node.start) throw new Meteor.Error('indestructible-item');

    return Nodes.remove(toId(id));
  },
});
