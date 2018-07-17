import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import Schema from 'simpl-schema';
import { Id, LinkSchema } from '../customTypes';

export const INSERT = 'labels.insert';
export const REMOVE = 'labels.remove';

export const AddLabel = (name, sceneId, link) => Meteor.call(INSERT, name, sceneId, link);
export const RemoveLabel = (id) => Meteor.call(REMOVE, id);

export const LabelSchema = new Schema({
  owner: Id,
  name: String,
  sceneId: Id,
  link: LinkSchema,
});

export const Labels = new Mongo.Collection('labels');
Labels.attachSchema(LabelSchema);
