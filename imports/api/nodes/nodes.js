import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import Schema from 'simpl-schema';
import { Id, LinkSchema } from '../customTypes';

export const LABEL = 'LABEL';
export const CHOICE = 'CHOICE';
export const IF = 'IF';

export const INSERT = 'nodes.insert';
export const UPDATE = 'nodes.update';
export const REMOVE = 'nodes.remove';

export const AddNode = (text, sceneId, link) => Meteor.call(INSERT, text, sceneId, link);
export const UpdateNodeText = (id, name) => Meteor.call(UPDATE, id, { name });
export const UpdateNodeLink = (id, link) => Meteor.call(UPDATE, id, { link });
export const RemoveNode = (id) => Meteor.call(REMOVE, id);

export const LabelSchema = new Schema({
  type: [LABEL, CHOICE, IF],
  owner: Id,
  start: Boolean,
  text: String,
  sceneId: Id,
  link: LinkSchema,
});

export const Nodes = new Mongo.Collection('nodes');
Nodes.attachSchema(LabelSchema);
