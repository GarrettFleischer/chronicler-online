import deepEqual from 'deep-equal';
import { peek, pop, push } from './stack';


export const UNDO = 'history/UNDO';
export const REDO = 'history/REDO';
export const MERGE = 'history/MERGE';


/**
 * @summary                 provides a higher order reducer for managing state history
 * @param reducer           the reducer to enhance
 * @param initReducerState  an optional initial state for the reducer to use
 * @returns {function}      a new reducer that can handle undo and redo actions
 */
export default function history(reducer, initReducerState) {
  const historyInitialState = {
    ...initState,
    present: reducer(initReducerState, {}),
  };

  return function historyReducer(state = historyInitialState, action) {
    const { past, present, future, canUndo, canRedo, lastActionType, updateTime } = state;

    let newPast = past;
    let newPresent = present;
    let newFuture = future;
    let newCanUndo = canUndo;
    let newCanRedo = canRedo;
    let newLastActionType = lastActionType;
    const newUpdateTime = (new Date()).getTime();

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
        newLastActionType = action.type;
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
        newLastActionType = action.type;
        break;

      case MERGE: {
        const mergeAction = `${MERGE}/${action.action.type}`;
        newPresent = reducer(present, action.action);
        if (deepEqual(newPresent, present)) return state;
        // merge only if the last action was the same or time since last update was less than a second
        if (lastActionType !== mergeAction || (newUpdateTime - updateTime) > 1000) {
          newPast = push(past, present);
          newCanUndo = true;
        }
        newFuture = [];
        newCanRedo = false;
        newLastActionType = mergeAction;
        break;
      }

      default:
        // reduce the state and only create an undo if the state changed
        newPresent = reducer(present, action);
        if (deepEqual(newPresent, present)) return state;
        newPast = push(past, { ...present });
        newFuture = [];
        newCanUndo = true;
        newCanRedo = false;
        newLastActionType = action.type;
        break;
    }

    return {
      ...state,
      past: newPast,
      present: newPresent,
      future: newFuture,
      canUndo: newCanUndo,
      canRedo: newCanRedo,
      lastActionType: newLastActionType,
      updateTime: newUpdateTime,
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


export function merge(action) {
  return {
    type: MERGE,
    action,
  };
}


export const initState = { past: [], present: {}, future: [], canUndo: false, canRedo: false, lastActionType: null };
