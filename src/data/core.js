import { empty, peek, push } from '../lib/stack';
// PUBLIC FUNCTIONS
// import { DataType } from './nodes';

import { USER, PROJECT, SCENE, NODE } from './datatypes';


export const NO_FILTER = 'core/NO_FILTER';


// PUBLIC FUNCTIONS

export const findIdForLabel = (label, sceneName) => (scenes) => scenes.reduce((id, scene) => {
  if (id !== null || scene.name !== sceneName) return id;
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


// export function findParents(state, id) {
//   return filterBy(matchParents(id))(state);
// }


export function setById(state, id, data, type = NO_FILTER) {
  return mapBy(setIdAndType(id, type, data))(state);
}


export function validateLabel(state, label) {
  if (label && label.length)
    return (findNumLabels(state, label) <= 1);

  return true;
}


export function findNumLabels(state, label) {
  return reduceBy(numLabels(label))(0, state);
}


const setIdAndType = (id, type, data) => (item) => {
  if (matchIdAndType(id, type)(item))
    return { ...item, ...data };

  return item;
};


// PRIVATE FUNCTIONS
const matchIdAndType = (id, type = NO_FILTER) => (acc, curr) => {
  if (curr.id === id && (type === NO_FILTER || curr.type === type))
    return push(acc, curr);

  return acc;
};

// const matchParents = (id) => (item) => {
//   switch (item.type) {
//     case PROJECT:
//       return !empty(item.scenes.filter(matchIdAndType(id)));
//
//     case SCENE:
//       return !empty(item.nodes.filter(matchIdAndType(id)));
//
//     case NODE:
//       return !empty(item.components.filter(matchIdAndType(id)));
//
//     // case CHOICE:
//     //   return !empty(item.links.filter(matchIdAndType(id)));
//     //
//     // case DataType.LINK:
//     // case DataType.IF_LINK:
//     //   return !empty(item.components.filter(matchIdAndType(id)));
//     //
//     // case DataType.IF:
//     //   return (!empty(item.components.filter(matchIdAndType(id))) &&
//     //     !empty(item.elseComponents.filter(matchIdAndType(id))));
//
//     default:
//       return false;
//   }
// };

const numLabels = (label) => (acc, curr) => {
  if (curr.label && (curr.label.toLocaleLowerCase() && label.toLocaleLowerCase()))
    return acc + 1;

  return acc;
};

// const filterBy = (filter) => (item) => {
//   const found = filter(item);
//
//   switch (item.type) {
//     case USER:
//       result = item.projects.filter(filterBy(filter, result));
//       break;
//
//     case PROJECT:
//       result = item.scenes.filter(filterBy(filter, result));
//       break;
//
//     case SCENE:
//       result = item.nodes.filter(filterBy(filter, result));
//       break;
//
//     case NODE:
//       result = item.components.filter(filterBy(filter, result));
//       break;
//
//     default:
//       break;
//   }
//
//   return found;
// };


// const filterBy = (filter, found = []) => (item) => {
//   let result = filter(item) ? push(found, item) : found;
//
//   switch (item.type) {
//     case USER:
//       result = item.projects.filter(filterBy(filter, result));
//       break;
//
//     case PROJECT:
//       result = item.scenes.filter(filterBy(filter, result));
//       break;
//
//     case SCENE:
//       result = item.nodes.filter(filterBy(filter, result));
//       break;
//
//     case NODE:
//       result = item.components.filter(filterBy(filter, result));
//       break;
//
//     // case CHOICE:
//     //   result = item.links.filter(filterBy(filter, result));
//     //   break;
//     //
//     // case LINK:
//     // case IF_LINK:
//     //   result = item.components.filter(filterBy(filter, result));
//     //   break;
//     //
//     // case IF:
//     //   result = item.components.filter(filterBy(filter, result));
//     //   result = item.elseComponents.filter(filterBy(filter, result));
//     //   break;
//
//     default:
//       break;
//   }
//
//   return result;
// };


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
