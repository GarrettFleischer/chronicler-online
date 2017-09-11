// noinspection JSUnresolvedVariable
import { createSelector } from 'reselect';
import { findById } from '../../data/core';
import { DataType } from '../../data/nodes';


export const selectNodeDomain = (state, id) => findById(state.chronicler.docs, id, DataType.NODE);
export const selectStateDomain = (state) => state.chronicler;

const makeSelectNode = () => createSelector(
  selectNodeDomain,
  selectStateDomain,
  (node, state) => ({ node, state }),
);
export default makeSelectNode;
