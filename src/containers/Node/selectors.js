import { createSelector } from 'reselect';
import { findById } from '../../data/core';
import { DataType } from '../../data/nodes';
import { getBase } from '../../store/state';


export const selectNodeDomain = (state, id) => findById(getBase(state), id, DataType.NODE);

/**
 * Other specific selectors
 */


/**
 * Default selector used by Node
 */

const makeSelectNode = () => {
  return createSelector(
    selectNodeDomain,
    (node) => ({ ...node }),
  );
};
export default makeSelectNode;