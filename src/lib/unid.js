import { empty, peek, pop, push } from './stack';


export const ACQUIRE_UID = 'unid/ACQUIRE_UID';
export const RELEASE_UID = 'unid/RELEASE_UID';


export default function unid(reducer, initReducerState) {
  const initUnidState = { ...initState, data: updateData(reducer, initReducerState, 0, {}) };

  return (state = initUnidState, action) => {
    const { guid, uid, avail, data } = state;

    let nguid = guid;
    let nuid = uid;
    let navail = avail;
    let ndata;

    switch (action.type) {
      case ACQUIRE_UID:
        if (empty(avail)) {
          nguid = guid + 1;
          nuid = nguid;
        } else {
          nuid = peek(avail);
          navail = pop(avail);
        }
        ndata = updateData(reducer, data, nuid, action.action);
        break;

      case RELEASE_UID:
        navail = push(avail, action.uid);
        ndata = updateData(reducer, data, uid, action.action);
        break;

      default:
        ndata = updateData(reducer, data, uid, action);
        break;
    }

    return { ...state, guid: nguid, uid: nuid, avail: navail, data: ndata };
  };
}


export function acquireUid(action) {
  return { type: ACQUIRE_UID, action };
}


export function releaseUid(action, uid) {
  return { type: RELEASE_UID, action, uid };
}


export const initState = { guid: 0, uid: 0, avail: [], data: {} };


function updateData(reducer, data, uid, action) {
  return reducer({ ...data, uid }, action);
}
