import Schema from 'simpl-schema';
import { CHOICE, GOTO } from '../logic/links';


export const Id = { type: String }; // , regEx: Schema.Regex.Id };

export const LinkSchema = new Schema({
  type: [GOTO, CHOICE],
  to: Id,
});
