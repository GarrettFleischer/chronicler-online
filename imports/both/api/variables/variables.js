import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import Schema from 'simpl-schema';
import { Id } from '../customTypes';


export const INSERT = 'variables.insert';
export const UPDATE = 'variables.update';
export const REMOVE = 'variables.remove';

export const addVariable = (sceneId, name, value) => Meteor.call(INSERT, sceneId, name, value);
export const updateVariableSceneId = (id, sceneId) => Meteor.call(UPDATE, id, { sceneId });
export const updateVariableName = (id, name) => Meteor.call(UPDATE, id, { name });
export const updateVariableValue = (id, value) => Meteor.call(UPDATE, id, { value });
export const removeVariable = (id) => Meteor.call(REMOVE, id);

export const VariableSchema = new Schema({
  owner: Id,
  createdOn: Date,
  sceneId: {
    type: Id,
    optional: true,
  },
  name: String,
  value: String,
});


export const Variables = new Mongo.Collection('variables');
Variables.attachSchema(VariableSchema);
