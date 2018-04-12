// noinspection JSUnresolvedVariable
import { createSelector } from 'reselect';
import { findById } from '../../data/core';
import { getActiveProject } from '../../data/state';


export const selectNodeDomain = (state, id) => findById(getActiveProject(state), id);
export const selectStateDomain = (state) => state.chronicler;

export const makeSelectNode = () => createSelector(
  selectNodeDomain,
  selectStateDomain,
  (node, state) => ({ node, state }),
);
