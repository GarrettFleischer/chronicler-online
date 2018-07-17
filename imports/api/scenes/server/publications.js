import { Meteor } from 'meteor/meteor';
import { Scenes } from '../scenes';


Meteor.publish('scenes', () => Scenes.find({ owner: this.userId }));
