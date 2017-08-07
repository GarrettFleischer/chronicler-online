import deepEqual from 'deep-equal';
import { peek, pop, push } from './stack';


export const UNDO = 'history/UNDO';
export const REDO = 'history/REDO';


/**
 * @summary             provides a higher order reducer for managing state history
 * @param reducer       the reducer to enhance
 * @param initialState  an optional initial state for the reducer to use
 * @returns {function}  a new reducer that can handle undo and redo actions
 */
export default function history(reducer, initialState) {
  const historyInitialState = {
    past: [],
    present: reducer(initialState, {}),
    future: [],
    canUndo: false,
    canRedo: false,
  };

  return function historyReducer(state = historyInitialState, action) {
    const { past, present, future, canUndo, canRedo } = state;

    let newPast = past;
    let newPresent = present;
    let newFuture = future;
    let newCanUndo = canUndo;
    let newCanRedo = canRedo;

    switch (action.type) {
      case UNDO:
        if (action.changes < 1) return state;
        for (let i = 0; i < action.changes; i += 1) {
          // revert changes if undo is not possible the number of changes
          if (!newCanUndo) return state;
          newFuture = push(newFuture, newPresent);
          newPresent = peek(newPast);
          newPast = pop(newPast);
          newCanUndo = newPast.length > 0;
          newCanRedo = true;
        }
        break;

      case REDO:
        if (action.changes < 1) return state;
        for (let i = 0; i < action.changes; i += 1) {
          // revert changes if redo is not possible the number of changes
          if (!newCanRedo) return state;
          newPast = push(newPast, newPresent);
          newPresent = peek(newFuture);
          newFuture = pop(newFuture);
          newCanUndo = true;
          newCanRedo = newFuture.length > 0;
        }
        break;

      default:
        // reduce the state and only create an undo if the state changed
        newPresent = reducer(present, action);
        if (deepEqual(newPresent, present)) return state;
        newPast = push(past, present);
        newFuture = [];
        newCanUndo = true;
        newCanRedo = false;
        break;
    }

    return {
      ...state,
      past: newPast,
      present: newPresent,
      future: newFuture,
      canUndo: newCanUndo,
      canRedo: newCanRedo,
    };
  };
}


export function undo(changes = 1) {
  return {
    type: UNDO,
    changes,
  };
}


export function redo(changes = 1) {
  return {
    type: REDO,
    changes,
  };
}
