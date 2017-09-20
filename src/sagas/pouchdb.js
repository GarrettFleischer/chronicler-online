/* eslint-disable no-constant-condition */
import { call, put } from 'redux-saga/effects';
import { localDB as db } from '../data/pouchdb';


export function* monitorDbChanges() {
  const info = yield call([db, db.info]); // get reference to last change
  let lastSeq = info.update_seq;

  while (true) {
    try {
      const changes = yield call([db, db.changes], {
        since: lastSeq,
        continuous: true,
        include_docs: true,
        heartbeat: 20000,
      });
      if (changes) {
        for (let i = 0; i < changes.results.length; ++i)
          yield put({ type: 'CHANGED_DOC', doc: changes.results[i].doc });

        lastSeq = changes.last_seq;
      }
    } catch (error) {
      yield put({ type: 'monitor-changes-error', err: error });
    }
  }
}
