import { DataType } from './nodes';

//
// export const FilterType = {
//   ANY: 'FilterType/ANY',
//   SCENE: 'FilterType/SCENE',
//   NODE: 'FilterType/NODE',
//   COMPONENT: 'FilterType/COMPONENT',
// };


const matchId = (id) => (acc, curr) => {
  if (acc !== null) return acc;
  if (curr.id === id) return curr;
  return null;
};

const matchIdR = (id) => (acc, curr) => {
  let found = matchId(id)(acc, curr);
  if (found !== null) return found;


  switch (curr.type) {
    case DataType.BASE:
      return curr.scenes.reduce(matchIdR(id), null);

    case DataType.SCENE:
      return curr.nodes.reduce(matchIdR(id), null);

    case DataType.NODE:
      return curr.components.reduce(matchIdR(id), null);

    case DataType.CHOICE:
      return curr.links.reduce(matchIdR(id), null);

    case DataType.LINK:
    case DataType.IF_LINK:
      return curr.components.reduce(matchIdR(id), null);

    case DataType.IF:
      found = curr.components.reduce(matchIdR(id), null);
      if (found !== null) return found;
      return curr.elseComponents.reduce(matchIdR(id), null);

    default:
      return null;
  }
};


export function findById(state, id) {
  return matchIdR(id)(null, state);
}


