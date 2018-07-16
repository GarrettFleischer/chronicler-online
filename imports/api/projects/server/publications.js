import { Meteor } from 'meteor/meteor';
import { Labels } from '../projects';

Meteor.publish('tasks', () => Labels.find({ owner: this.userId }));
