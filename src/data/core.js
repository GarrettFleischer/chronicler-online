import { DataType } from './nodes';


export const NO_FILTER = 'core/NO_FILTER';


export function findById(state, id, type = NO_FILTER) {
  return reduceBy(matchIdAndType(id, type))(null, state);
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

const setIdAndType = (id, type, data) => (curr) => {
  if (curr.id === id && (type === NO_FILTER || curr.type === type))
    return { ...curr, ...data };

  return curr;
};


const matchIdAndType = (id, type) => (acc, curr) => {
  if (acc !== null)
    return acc;

  if (curr.id === id && (type === NO_FILTER || curr.type === type))
    return curr;

  return null;
};

const numLabels = (label) => (acc, curr) => {
  if (curr.label && (curr.label.toLocaleLowerCase() && label.toLocaleLowerCase()))
    return acc + 1;

  return acc;
};

const reduceBy = (filter) => (acc, curr) => {
  let found = filter(acc, curr);
  if (found !== null) return found;

  switch (curr.type) {
    case DataType.BASE:
      return curr.scenes.reduce(reduceBy(filter), null);

    case DataType.SCENE:
      return curr.nodes.reduce(reduceBy(filter), null);

    case DataType.NODE:
      return curr.components.reduce(reduceBy(filter), null);

    case DataType.CHOICE:
      return curr.links.reduce(reduceBy(filter), null);

    case DataType.LINK:
    case DataType.IF_LINK:
      return curr.components.reduce(reduceBy(filter), null);

    case DataType.IF:
      found = curr.components.reduce(reduceBy(filter), null);
      if (found !== null) return found;
      return curr.elseComponents.reduce(reduceBy(filter), null);

    default:
      return null;
  }
};

const mapBy = (func) => (curr) => {
  const updated = func(curr);

  switch (updated.type) {
    case DataType.BASE:
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
