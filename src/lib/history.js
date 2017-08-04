import immu from 'immu';
import deepEqual from 'deep-equal';

export const UNDO = 'lib/history/UNDO';
export const REDO = 'lib/history/REDO';


/**
 * @summary             provides a higher order reducer for managing state history
 * @param reducer       the reducer to enhance
 * @param initialState  an optional initial state for the reducer to use
 * @returns {func}      a new reducer that can handle undo and redo actions
 */
export default function history(reducer, initialState) {
  const historyInitialState = { past: [], present: reducer(initialState), future: [], canUndo: false, canRedo: false };

  return function historyReducer(state = historyInitialState, action) {
    const { past, present, future, canUndo, canRedo } = state;

    let newPast = past;
    let newPresent = present;
    let newFuture = future;
    let newCanUndo = canUndo;
    let newCanRedo = canRedo;

    switch (action.type) {
      case UNDO:
        for (let i = 0; i < action.payload.changes; i += 1) {
          if (!newCanUndo) {
            return state;
          }

          newFuture = [newPresent, ...newFuture];
          newPresent = newPast[past.length - 1];
          newPast = newPast.slice(0, past.length - 1);
          newCanUndo = newPast.length > 0;
          newCanRedo = true;
        }
        break;

      case REDO:
        for (let i = 0; i < action.payload.changes; i += 1) {
          if (!newCanRedo) {
            return state;
          }

          newPast = [...newPast, newPresent];
          newPresent = newFuture[0];
          newFuture = newFuture.slice(1);
          newCanUndo = true;
          newCanRedo = newFuture.length > 0;
        }
        break;

      default:
        newPresent = reducer(present, action);
        if (deepEqual(newPresent, present)) {
          return state;
        }
        newPast = [...past, present];
        newCanUndo = true;
        newFuture = [];
        newCanRedo = false;
        break;
    }

    return immu({
      past: newPast,
      present: newPresent,
      future: newFuture,
      canUndo: newCanUndo,
      canRedo: newCanRedo,
    });
  };
}


export function undo(changes = 1) {
  return {
    type: UNDO,
    payload: { changes },
  };
}


export function redo(changes = 1) {
  return {
    type: REDO,
    payload: { changes },
  };
}
