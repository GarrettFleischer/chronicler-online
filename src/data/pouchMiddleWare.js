import PouchMiddleWare from 'pouch-redux-middleware';
import PouchDB from 'pouchdb';
// import { batchInsert, insert, remove, update } from '../reducers/pouchReducer';

export const localDB = new PouchDB('chronicler');
export const remoteDB = new PouchDB('http://127.0.0.1:5984/chronicler');

export const INSERT = 'INSERT';
export const BATCH_INSERT = 'BATCH_INSERT';
export const REMOVE = 'REMOVE';
export const UPDATE = 'UPDATE';

const insert = (doc) => ({ type: INSERT, doc });
const batchInsert = (docs) => ({ type: BATCH_INSERT, docs });
const remove = (doc) => ({ type: REMOVE, doc });
const update = (doc) => ({ type: UPDATE, doc });

export const pouchMiddleWare = PouchMiddleWare({
  path: '/chronicler/present',
  localDB,
  actions: {
    remove,
    insert,
    batchInsert,
    update,
  },
});

