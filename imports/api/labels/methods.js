import { Meteor } from 'meteor/meteor';
import { Scenes } from '../scenes/scenes';
import { Labels, INSERT, REMOVE } from './labels';


Labels.helpers({
  scene() {
    return Scenes.findOne(this.sceneId);
  },
});


Meteor.methods({
  [INSERT]: (name, sceneId, link) => {
    // Make sure the user is logged in before inserting a project
    if (!this.userId) throw new Meteor.Error('not-authorized');

    Labels.insert({
      owner: this.userId,
      name,
      sceneId,
      link,
    });
  },
  [REMOVE]: (id) => {
    // Make sure the user is logged in before removing a label
    if (!this.userId) throw new Meteor.Error('not-authorized');

    Labels.remove(id);
  },
});
