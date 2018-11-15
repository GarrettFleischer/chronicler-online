import { Meteor } from 'meteor/meteor';
import { Projects } from '../projects/projects';
import { Variables, INSERT, REMOVE, UPDATE } from './variables';


Variables.helpers({
  project() {
    return Projects.findOne({ _id: this.projectId });
  },
});


Meteor.methods({
  [INSERT](projectId, sceneId, name, value) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    return Variables.insert({
      owner: this.userId,
      createdOn: Date.now(),
      projectId,
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
