import deepEqual from 'deep-equal';
import { peek, pop, push } from './stack';


export const UNDO = 'actionHistory/UNDO';
export const REDO = 'actionHistory/REDO';


/**
 * @summary                 provides a higher order reducer for managing state history
 * @param undoReducer       the reducer that knows how to undo all actions
 * @param reducer           the reducer to enhance
 * @param initReducerState  an optional initial state for the reducer to use
 * @returns {function}      a new reducer that can handle undo and redo actions
 */
export default function history(undoReducer, reducer, initReducerState = {}) {
  const historyInitialState = {
    ...initState,
    ...reducer(initReducerState, {}),
  };

  return function historyReducer(state = historyInitialState, action) {
    let newState = { ...state };

    switch (action.type) {
      case UNDO:
        if (action.changes < 1) return state;
        for (let i = 0; i < action.changes; ++i) {
          // revert changes if undo is not possible the number of changes
          if (!newState.canUndo) return state;
          const present = peek(newState.past);
          newState = undoReducer(newState, present);
          newState.future = push(newState.future, present);
          newState.past = pop(newState.past);
          newState.canUndo = newState.past.length > 0;
        }
        newState.canRedo = true;
        break;

      case REDO:
        if (action.changes < 1) return state;
        for (let i = 0; i < action.changes; ++i) {
          // revert changes if redo is not possible the number of changes
          if (!newState.canRedo) return state;
          const present = peek(newState.future);
          newState = reducer(newState, present);
          newState.past = push(newState.past, present);
          newState.future = pop(newState.future);
          newState.canRedo = newState.future.length > 0;
        }
        newState.canUndo = true;
        break;

      default:
        // reduce the state and only create an undo if the state changed
        newState = reducer(state, action);
        if (deepEqual(newState, state)) return state;
        newState.past = push(newState.past, action);
        newState.future = [];
        newState.canUndo = true;
        newState.canRedo = false;
        break;
    }

    return newState;
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


export const initState = { past: [], present: {}, future: [], canUndo: false, canRedo: false };
