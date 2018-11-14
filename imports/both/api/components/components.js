import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import Schema from 'simpl-schema';
import { Id } from '../customTypes';


export const TEXT = 'TEXT';
export const SET = 'SET';

export const INSERT = 'components.insert';
export const UPDATE = 'components.update';
export const REMOVE = 'components.remove';

const addComponent = (type, nodeId, order, data) => Meteor.call(INSERT, type, nodeId, order, data);
export const addTextComponent = (nodeId, order) => addComponent(TEXT, nodeId, order, {});
export const addSetActionComponent = (nodeId, order) => addComponent(SET, nodeId, order, {});
export const updateComponentOrder = (id, order) => Meteor.call(UPDATE, id, { order });
export const updateComponentData = (id, data) => Meteor.call(UPDATE, id, { data });
export const removeComponent = (id) => Meteor.call(REMOVE, id);

const dataSchema = new Schema({
  // Text
  text: {
    type: String,
    optional: true,
  },

  // Set Action
  variableId: {
    type: String,
    optional: true,
  },
  value: {
    type: String,
    optional: true,
  },
  valueIsVariable: {
    type: Boolean,
    optional: true,
  },
});

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
