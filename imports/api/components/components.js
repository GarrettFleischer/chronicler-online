import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import Schema from 'simpl-schema';
import { Id } from '../customTypes';

export const TEXT = 'TEXT';
export const SET = 'SET';

export const INSERT = 'components.insert';
export const UPDATE = 'components.update';
export const REMOVE = 'components.remove';

export const AddComponent = (type, nodeId, order, data) => Meteor.call(INSERT, type, nodeId, order, data);
export const UpdateComponentData = (id, data) => Meteor.call(UPDATE, id, { data });
export const RemoveComponent = (id) => Meteor.call(REMOVE, id);

export const ComponentSchema = new Schema({
  type: String,
  owner: Id,
  nodeId: Id,
  order: Number,
  data: Object,
  createdOn: Date,
});

export const Components = new Mongo.Collection('components');
Components.attachSchema(ComponentSchema);
