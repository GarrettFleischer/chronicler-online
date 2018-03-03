import { empty, peek, push } from '../lib/stack';
// PUBLIC FUNCTIONS
// import { DataType } from './nodes';

import { USER, PROJECT, SCENE, NODE, NODE_LINK, CHOICE, CONDITION } from './datatypes';


export const NO_FILTER = 'core/NO_FILTER';


// PUBLIC FUNCTIONS

export const getNodeName = (node) => node.label === '' ? `node_${node.id}` : node.label;

export const findIdForLabel = (label, sceneName = undefined) => (scenes) => scenes.reduce((id, scene) => {
  if (id !== null || (sceneName !== undefined && scene.name !== sceneName)) return id;
  return scene.nodes.reduce((nid, node) => {
    if (nid !== null) return nid;
    return node.label === label ? node.id : null;
  }, id);
}, null);


export function findById(state, id, type = NO_FILTER) {
  // since no more than one thing can match an id, peek the first returned element
  const found = reduceBy(matchIdAndType(id, type))([], state);
  return empty(found) ? null : peek(found);
}

export const findByType = (state, type) => reduceBy(matchType(type))([], state);

export function findParents(state, id) {
  return reduceBy(matchParents(id))([], state);
}


// export function setById(state, id, data, type = NO_FILTER) {
//   return mapBy(setIdAndType(id, type, data))(state);
// }


export function validateLabel(state, label) {
  if (label && label.length)
    return (findNumLabels(state, label) <= 1);

  return true;
}


export function findNumLabels(state, label) {
  return reduceBy(numLabels(label))(0, state);
}


// const setIdAndType = (id, type, data) => (item) => {
//   if (matchIdAndType(id, type)(item))
//     return { ...item, ...data };
//
//   return item;
// };


// PRIVATE FUNCTIONS
const matchIdAndType = (id, type = NO_FILTER) => (acc, curr) => {
  if (curr.id === id && (type === NO_FILTER || curr.type === type))
    return push(acc, curr);

  return acc;
};

const matchType = (type) => (acc, curr) => {
  if (curr.type === type)
    return push(acc, curr);

  return acc;
};

// TODO check type
const matchParents = (childId) => (acc, curr) => {
  if ((getLinks(curr.link)).contains(childId))
    return push(acc, curr);

  return acc;
};

export const getLinks = (state) => {
  if (!state) return []; // give up if state is undefined
  let links = [];

  switch (state.type) {
    case NODE_LINK:
      links = push(links, state.node);
      break;

    case CHOICE:
      state.choices.forEach((choice) => {
        (getLinks(choice.link)).forEach((link) => {
          links = push(links, link);
        });
      });
      break;

    case CONDITION:
      state.conditions.forEach((condition) => {
        (getLinks(condition.link)).forEach((link) => {
          links = push(links, link);
        });
      });
      break;

    default:
      break;
  }

  return links.filter((link) => link); // remove undefined
};

const numLabels = (label) => (acc, curr) => {
  if (curr.label && (curr.label.toLocaleLowerCase() && label.toLocaleLowerCase()))
    return acc + 1;

  return acc;
};

const reduceBy = (reduce) => (acc, curr) => {
  let result = reduce(acc, curr);

  switch (curr.type) {
    case PROJECT:
      result = curr.scenes.reduce(reduceBy(reduce), result);
      result = curr.variables.reduce(reduce, result); // recursive reduction not necessary for variables
      break;

    case SCENE:
      result = curr.nodes.reduce(reduceBy(reduce), result);
      // result = curr.variables.reduce(reduceBy(reduce), result);
      break;

    case NODE:
      result = curr.components.reduce(reduceBy(reduce), result);
      break;

    default:
      break;
  }

  return result;
};


const mapBy = (func) => (curr) => {
  const updated = func(curr);

  switch (updated.type) {
    case USER:
      return { ...updated, projects: updated.projects.map(mapBy(func)) };

    case PROJECT:
      return {
        ...updated,
        scenes: updated.scenes.map(mapBy(func)),
        variables: updated.variables.map(func), // recursive mapping not necessary for variables
      };

    case SCENE:
      return {
        ...updated,
        nodes: updated.nodes.map(mapBy(func)),
        // variables: updated.variables.map(mapBy(func)),
      };

    case NODE:
      return { ...updated, components: updated.components.map(mapBy(func)) };

    default:
      return updated;
  }
};
