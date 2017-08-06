import { DataType } from './nodes';


export const NO_FILTER = 'core/NO_FILTER';


export function findById(state, id, type = NO_FILTER) {
  return matchBy(matchIdAndType(id, type))(null, state);
}


const matchIdAndType = (id, type) => (acc, curr) => {
  if (acc !== null)
    return acc;

  if (curr.id === id && (type === NO_FILTER || curr.type === type))
    return curr;

  return null;
};


const matchBy = (filter) => (acc, curr) => {
  let found = filter(acc, curr);
  if (found !== null) return found;


  switch (curr.type) {
    case DataType.BASE:
      return curr.scenes.reduce(matchBy(filter), null);

    case DataType.SCENE:
      return curr.nodes.reduce(matchBy(filter), null);

    case DataType.NODE:
      return curr.components.reduce(matchBy(filter), null);

    case DataType.CHOICE:
      return curr.links.reduce(matchBy(filter), null);

    case DataType.LINK:
    case DataType.IF_LINK:
      return curr.components.reduce(matchBy(filter), null);

    case DataType.IF:
      found = curr.components.reduce(matchBy(filter), null);
      if (found !== null) return found;
      return curr.elseComponents.reduce(matchBy(filter), null);

    default:
      return null;
  }
};
