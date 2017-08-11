// noinspection JSUnresolvedVariable
import { createSelector } from 'reselect';
import { findById } from '../../data/core';
import { DataType } from '../../data/nodes';
import { getBase } from '../../data/state';


export const selectNodeDomain = (state, id) => findById(getBase(state), id, DataType.NODE);
export const selectStateDomain = (state) => getBase(state);

const makeSelectNode = () => createSelector(
  selectNodeDomain,
  selectStateDomain,
  (node, state) => ({ node, state }),
);
export default makeSelectNode;
