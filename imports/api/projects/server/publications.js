import { Meteor } from 'meteor/meteor';
import { Projects } from '../projects';

Meteor.publish('projects', () => Projects.find({ owner: this.userId }));
