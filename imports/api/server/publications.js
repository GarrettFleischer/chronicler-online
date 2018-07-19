/* eslint-disable func-names */
import { Meteor } from 'meteor/meteor';
import { Nodes } from '../nodes/nodes';
import { Projects } from '../projects/projects';
import { Scenes } from '../scenes/scenes';

Meteor.publish('projects', function () {
  if (!this.userId) return this.ready();

  return Projects.find({ owner: this.userId });
});

Meteor.publish('scenes', function () {
  if (!this.userId) return this.ready();

  return Scenes.find({ owner: this.userId });
});

Meteor.publish('nodes', function () {
  if (!this.userId) return this.ready();

  return Nodes.find({ owner: this.userId });
});
