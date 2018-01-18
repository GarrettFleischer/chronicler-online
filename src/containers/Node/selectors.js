// noinspection JSUnresolvedVariable
import { createSelector } from 'reselect';
import { findById } from '../../data/core';
import { DataType } from '../../data/nodes';
import { getActiveProject } from '../../data/state';


export const selectNodeDomain = (state, id) => {
  console.log('state: ', state);
  console.log('activeProject: ', getActiveProject(state));
  findById(getActiveProject(state), id, DataType.NODE);
};
export const selectStateDomain = (state) => state.chronicler;

const makeSelectNode = () => createSelector(
  selectNodeDomain,
  selectStateDomain,
  (node, state) => ({ node, state }),
);
export default makeSelectNode;
