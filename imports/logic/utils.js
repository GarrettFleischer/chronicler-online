import { Mongo } from 'meteor/mongo';


export const IdToStr = (id) => {
  // eslint-disable-next-line no-underscore-dangle
  if (id instanceof Mongo.ObjectID) return id._str;
  if (typeof id === 'string') return id;
  return undefined;
};

export const toId = (id) => {
  if (id instanceof Mongo.ObjectID) return id;
  if (typeof id === 'string') return new Mongo.ObjectID(id);
  return undefined;
};

export const matchId = (id) => (item) => IdToStr(item._id) === IdToStr(id);

export const findById = (collection, id) => collection.findOne({ _id: toId(id) });

export const filterOne = (array, id) => array.filter(matchId(id))[0];

export const selectKeyId = (key, id) => ({ [key]: IdToStr(id) });
