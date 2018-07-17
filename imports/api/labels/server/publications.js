import { Meteor } from 'meteor/meteor';
import { Labels } from '../labels';

Meteor.publish('labels', () => Labels.find({ owner: this.userId }));
