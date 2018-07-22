import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import Schema from 'simpl-schema';
import { Id } from '../customTypes';

export const LABEL = 'LABEL';
export const CHOICE = 'CHOICE';
export const IF = 'IF';
export const GOTO = 'GOTO';

export const INSERT = 'nodes.insert';
export const UPDATE = 'nodes.update';
export const REMOVE = 'nodes.remove';

export const AddNode = (type, text, sceneId, parentId) => Meteor.call(INSERT, type, text, sceneId, parentId);
export const UpdateNodeText = (id, name) => Meteor.call(UPDATE, id, { name });
export const RemoveNode = (id) => Meteor.call(REMOVE, id);

export const NodeSchema = new Schema({
  type: String,
  owner: Id,
  text: String,
  sceneId: Id,
  parentId: { type: Id, optional: true },
});

export const Nodes = new Mongo.Collection('nodes');
Nodes.attachSchema(NodeSchema);
