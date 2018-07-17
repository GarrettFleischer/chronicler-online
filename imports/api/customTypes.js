import Schema from 'simpl-schema';


export const Id = { type: String }; // , regEx: Schema.Regex.Id };

export const LinkSchema = new Schema({
  type: ['LinkLabel', 'LinkChoice'],
  to: Id,
});
