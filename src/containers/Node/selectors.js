// noinspection JSUnresolvedVariable
import { createSelector } from 'reselect';
import { findById } from '../../data/core';
import { DataType } from '../../data/nodes';
import { getBase } from '../../data/state';


export const selectNodeDomain = (state, id) => findById(getBase(state), id, DataType.NODE);

const makeSelectNode = () => createSelector(
  selectNodeDomain,
  (node) => ({ ...node }),
);
export default makeSelectNode;
