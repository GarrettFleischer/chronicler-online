import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import Schema from 'simpl-schema';
import { Id } from '../customTypes';

export const TEXT = 'TEXT';
export const SET = 'SET';

export const INSERT = 'components.insert';
export const UPDATE = 'components.update';
export const REMOVE = 'components.remove';

export const addComponent = (type, nodeId, order, data) => Meteor.call(INSERT, type, nodeId, order, data);
export const addTextComponent = (nodeId, order) => addComponent(TEXT, nodeId, order, { text: 'hello' });// Meteor.call(INSERT, TEXT, nodeId, order, { text: '' });
export const updateComponentOrder = (id, order) => Meteor.call(UPDATE, id, { order });
export const UpdateComponentData = (id, data) => Meteor.call(UPDATE, id, { data });
export const RemoveComponent = (id) => Meteor.call(REMOVE, id);

const dataSchema = new Schema({ text: { type: String, optional: true } });

export const ComponentSchema = new Schema({
  owner: Id,
  createdOn: Date,
  type: String,
  nodeId: Id,
  order: Number,
  data: dataSchema,
});


export const Components = new Mongo.Collection('components');
Components.attachSchema(ComponentSchema);
