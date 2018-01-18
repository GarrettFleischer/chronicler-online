import { empty, peek, push } from '../lib/stack';
// PUBLIC FUNCTIONS
import { DataType } from './nodes';

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
  const found = filterBy(matchIdAndType(id, type))(state);
  return empty(found) ? null : peek(found);
}


export function findParents(state, id) {
  return filterBy(matchParents(id))(state);
}


export function setById(state, id, data, type = NO_FILTER) {
  return mapBy(setIdAndType(id, type, data))(state);
}


export function validateLabel(state, label) {
  if (label && label.length)
    return (findNumLabels(state, label) <= 1);

  return false;
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
const matchIdAndType = (id, type = NO_FILTER) => (item) => (item.id === id && (type === NO_FILTER || item.type === type));

const matchParents = (id) => (item) => {
  switch (item.type) {
    case DataType.PROJECT:
      return !empty(item.scenes.filter(matchIdAndType(id)));

    case DataType.SCENE:
      return !empty(item.nodes.filter(matchIdAndType(id)));

    case DataType.NODE:
      return !empty(item.components.filter(matchIdAndType(id)));

    case DataType.CHOICE:
      return !empty(item.links.filter(matchIdAndType(id)));

    case DataType.LINK:
    case DataType.IF_LINK:
      return !empty(item.components.filter(matchIdAndType(id)));

    case DataType.IF:
      return (!empty(item.components.filter(matchIdAndType(id))) &&
        !empty(item.elseComponents.filter(matchIdAndType(id))));

    default:
      return false;
  }
};

const numLabels = (label) => (acc, curr) => {
  if (curr.label && (curr.label.toLocaleLowerCase() && label.toLocaleLowerCase()))
    return acc + 1;

  return acc;
};


const filterBy = (filter, found = []) => (item) => {
  let result = filter(item) ? push(found, item) : found;

  switch (item.type) {
    case DataType.PROJECT:
      result = item.scenes.filter(filterBy(filter, result));
      break;

    case DataType.SCENE:
      result = item.nodes.filter(filterBy(filter, result));
      break;

    case DataType.NODE:
      result = item.components.filter(filterBy(filter, result));
      break;

    case DataType.CHOICE:
      result = item.links.filter(filterBy(filter, result));
      break;

    case DataType.LINK:
    case DataType.IF_LINK:
      result = item.components.filter(filterBy(filter, result));
      break;

    case DataType.IF:
      result = item.components.filter(filterBy(filter, result));
      result = item.elseComponents.filter(filterBy(filter, result));
      break;

    default:
      break;
  }

  return result;
};


const reduceBy = (reduce) => (acc, curr) => {
  let result = reduce(acc, curr);

  switch (curr.type) {
    case DataType.PROJECT:
      result = curr.scenes.reduce(reduceBy(reduce), result);
      break;

    case DataType.SCENE:
      result = curr.nodes.reduce(reduceBy(reduce), result);
      break;

    case DataType.NODE:
      result = curr.components.reduce(reduceBy(reduce), result);
      break;

    case DataType.CHOICE:
      result = curr.links.reduce(reduceBy(reduce), result);
      break;

    case DataType.LINK:
    case DataType.IF_LINK:
      result = curr.components.reduce(reduceBy(reduce), result);
      break;

    case DataType.IF:
      result = curr.components.reduce(reduceBy(reduce), result);
      result = curr.elseComponents.reduce(reduceBy(reduce), result);
      break;

    default:
      break;
  }

  return result;
};


const mapBy = (func) => (curr) => {
  const updated = func(curr);

  switch (updated.type) {
    case DataType.PROJECT:
      return { ...updated, scenes: updated.scenes.map(mapBy(func)) };

    case DataType.SCENE:
      return { ...updated, nodes: updated.nodes.map(mapBy(func)) };

    case DataType.NODE:
      return { ...updated, components: updated.components.map(mapBy(func)) };

    case DataType.CHOICE:
      return { ...updated, links: updated.links.map(mapBy(func)) };

    case DataType.LINK:
    case DataType.IF_LINK:
      return { ...updated, components: updated.components.map(mapBy(func)) };

    case DataType.IF:
      return {
        ...updated,
        components: updated.components.map(mapBy(func)),
        elseComponents: updated.elseComponents.map(mapBy(func)),
      };

    default:
      return updated;
  }
};
