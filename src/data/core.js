import { empty, peek, pop, push } from '../lib/stack';
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
  if ((getLinks(curr.link)).includes(childId))
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

export const getNodePositions = (state, colWidth, rowHeight) => {
  const coord = {};
  state.scenes.forEach((scene) => {
    scene.nodes.forEach((node) => {
      coord[node.id] = { x: 0, y: 0 };
    });
  });

  state.scenes.forEach((scene) => {
    if (scene.nodes.length) {
      const startNode = scene.nodes[0];
      const rows = buildRows(state, startNode.id);
      const width = maxWidth(rows);

      rows.forEach((row, y) => {
        const offset = width / (row.length + 1);
        row.forEach((id, x) => {
          coord[id].x = Math.round((x + offset) * colWidth);
          coord[id].y = Math.round(y * rowHeight);
        });
      });
    }
  });

  return coord;
};

// Iteratively searches over the state starting at the given id.
// Returns true if there is a path that loops back to the given id.
/**
 * @return {boolean}
 */
// export function ContainsLoop(state, nodeId) {
//   let stack = Stack.of(nodeId);
//   let visited = List();
//
//   while (stack.size) {
//     const top = stack.peek();
//     stack = stack.pop();
//
//     if (!visited.contains(top)) {
//       visited = visited.push(top);
//
//       const children = FindChildren(state, top);
//       for (let i = 0; i < children.size; ++i) {
//         if (children.getIn([i, 'Id']) === nodeId)
//           return true;
//
//         stack = stack.push(children.getIn([i, 'Id']));
//       }
//     }
//   }
//
//   return false;
// }

// Helper function for UpdateNodePositions
const buildRows = (state, nodeId) => {
  const rows = [];
  let stack = [{ id: nodeId, row: 0 }];
  const visited = [];

  while (stack.length) {
    const top = peek(stack);
    stack = pop(stack);
    if (!visited.includes(top.id)) {
      visited.push(top.id);

      while (top.row >= rows.length) rows.push([]);
      const currentRow = rows[top.row];
      currentRow.push(top.id);

      const children = getChildren(state, top.id);
      children.forEach((child) => {
        stack = push(stack, { id: child.id, row: top.row + 1 });
      });
    }
  }

  return rows; // handleMultipleParents(state, rows);
};

const getChildren = (state, nodeId) => {
  const links = getLinks(findById(state, nodeId, NODE));
  return links.map((id) => findById(state, id, NODE));
};

// Helper function for BuildRows
// function HandleMultipleParents(state, rows) {
//   let newRows = rows;
//   let done = false;
//   let visited = List();
//
//   // reset iteration whenever a change is made
//   while (!done) {
//     done = true;
//
//     for (let y = 0; y < newRows.size && done; ++y) {
//       let row = newRows.get(y);
//
//       for (let x = 0; x < row.size && done; ++x) {
//         const currentId = row.get(x);
//
//         // ignore this node if already processed
//         if (!visited.contains(currentId)) {
//           visited = visited.push(currentId);
//
//           // if (!ContainsLoop(state, currentId)) {
//           // calc max parent row + 1
//           const parents = FindParents(state, currentId);
//           let newY = y;
//           parents.forEach((parent) => {
//             const below = IsBelow(newRows, currentId, parent.get('Id'));
//             if (parent.get('Id') !== currentId && below)
//               newY = Math.max(newY, RowOf(newRows, parent.get('Id')) + 1);
//           });
//
//           if (newY !== y) {
//             done = false;
//             while (newY >= newRows.size) newRows = newRows.push(List());
//             const newRow = newRows.get(newY).push(currentId);
//             row = row.delete(x);
//             newRows = newRows.set(y, row);
//             newRows = newRows.set(newY, newRow);
//           }
//           // }
//         }
//       }
//     }
//   }
//
//   return newRows;
// }

/**
 * @return {boolean}
 */
const isBelow = (rows, childId, parentId) => {
  for (let y = 0; y < rows.length; ++y) {
    const row = rows[y];
    let potential = false;
    for (let x = 0; x < row.length; ++x) {
      const id = row[x];
      if (id === parentId) potential = true;
      if (id === childId && !potential) return false;
    }
    if (potential) return true;
  }
  return false;
};

// // Helper function for BuildRows
// /**
//  * @return {number}
//  */
// function RowOf(rows, nodeId) {
//   for (let y = 0; y < rows.size; ++y) {
//     const row = rows.get(y);
//     for (let x = 0; x < row.size; ++x) {
//       if (row.get(x) === nodeId)
//         return y;
//     }
//   }
//
//   return -1;
// }

// Helper function for BuildRows
/**
 * @return {number}
 */
function maxWidth(rows) {
  let width = 0;

  for (let y = 0; y < rows.length; ++y)
    width = Math.max(width, rows[y].length);

  return width;
}


// export const layoutNodes = ({ state, nodes, levelSeparation = 100, siblingSeparation = 100, subtreeSeparation = 200 }) => {
//   const layout = [];
//
//   const levelZeroPtr = nodes[0];
//   let xTopAdjustment = 0;
//   let yTopAdjustment = 0;
//   const prevNodeAtLevel = { 0: null };
//
//   const data = {};
//   nodes.forEach((node) => {
//     const links = getLinks(node.link);
//     data[node] = {
//       parents: findParents(state, node.id),
//       firstChild: links.length ? findById(state, links[0], NODE) : null,
//       leftSibling: null,  // TODO write this
//       rightSibling: null, // TODO write this
//       x: 0,
//       y: 0,
//       prelim: 0,
//       modifier: 0,
//       leftNeighbor: null, // TODO write this
//     };
//   });
//
//
//   const positionTree = (node) => {
//     if (node) {
//       initPrevNodeList();
//
//       firstWalk(node, 0);
//
//       xTopAdjustment = data[node].x - data[node].prelim;
//       yTopAdjustment = data[node].y;
//
//       return secondWalk(node, 0, 0);
//     }
//
//     return true;
//   };
//
//   const initPrevNodeList = () => {};
//
//   const firstWalk = (node, level) => {
//     data[node].leftNeighbor = prevNodeAtLevel[level];
//     prevNodeAtLevel[level] = node;
//     if (isLeaf(node)) {
//       const leftSibling = data[node].leftSibling;
//       if (leftSibling)
//         data[node].prelim = data[leftSibling].prelim + siblingSeparation; // + meanNodeSize(leftSibling, node);
//     }
//     else {
//       const leftMost = data[node].firstChild;
//       const rightMost = leftMost;
//       firstWalk(leftMost, level + 1);
//
//       const
//     }
//   };
//
//   const isLeaf = (node) => empty(getLinks(node.link));
//
//   return layout;
// };
