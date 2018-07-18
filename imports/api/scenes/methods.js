import { Meteor } from 'meteor/meteor';
import { Labels } from '../labels/labels';
import { Projects } from '../projects/projects';
import { Scenes, INSERT, REMOVE } from './scenes';


Scenes.helpers({
  project() {
    return Projects.findOne(this.projectId);
  },
  labels() {
    return Labels.find({ sceneId: this._id._str }).fetch();
  },
});

Meteor.methods({
  [INSERT]: (name, projectId) => {
    // Make sure the user is logged in before inserting a project
    if (!this.userId) throw new Meteor.Error('not-authorized');

    Scenes.insert({
      owner: this.userId,
      name,
      projectId,
    });
  },
  [REMOVE]: (id) => {
    // Make sure the user is logged in before removing a label
    if (!this.userId) throw new Meteor.Error('not-authorized');

    Scenes.remove(id);
  },
});

Projects.before.remove((userId, doc) => Labels.remove({ sceneId: doc._id }));
