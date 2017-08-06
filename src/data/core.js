import { DataType } from './nodes';

//
// export const FilterType = {
//   ANY: 'FilterType/ANY',
//   SCENE: 'FilterType/SCENE',
//   NODE: 'FilterType/NODE',
//   COMPONENT: 'FilterType/COMPONENT',
// };


export function findById(state, id) {
  return matchBy(matchId(id))(null, state);
}


const matchId = (id) => (acc, curr) => {
  if (acc !== null) return acc;
  if (curr.id === id) return curr;
  return null;
};


const matchBy = (func) => (acc, curr) => {
  let found = func(acc, curr);
  if (found !== null) return found;


  switch (curr.type) {
    case DataType.BASE:
      return curr.scenes.reduce(matchBy(func), null);

    case DataType.SCENE:
      return curr.nodes.reduce(matchBy(func), null);

    case DataType.NODE:
      return curr.components.reduce(matchBy(func), null);

    case DataType.CHOICE:
      return curr.links.reduce(matchBy(func), null);

    case DataType.LINK:
    case DataType.IF_LINK:
      return curr.components.reduce(matchBy(func), null);

    case DataType.IF:
      found = curr.components.reduce(matchBy(func), null);
      if (found !== null) return found;
      return curr.elseComponents.reduce(matchBy(func), null);

    default:
      return null;
  }
};
