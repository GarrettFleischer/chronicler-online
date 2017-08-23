export const INSERT = 'pouch/INSERT';
export const BATCH_INSERT = 'pouch/BATCH_INSERT';
export const REMOVE = 'pouch/REMOVE';
export const UPDATE = 'pouch/UPDATE';

export const insert = (doc) => ({ type: INSERT, doc });
export const batchInsert = (docs) => ({ type: BATCH_INSERT, docs });
export const remove = (doc) => ({ type: REMOVE, doc });
export const update = (doc) => ({ type: UPDATE, doc });

// TODO implement this reducer...
export default function pouchReducer(state, action) {
  switch (action) {
    default:
      return state;
  }
}
