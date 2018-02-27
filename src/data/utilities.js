import deepCopy from 'deepcopy';
const jdp = require('jsondiffpatch').create({});

export function removeKeys(deep, ...keys) {
  return (object) => {
    let newObject = object;
    if (!object || object.substring || object.toFixed)
      return object;

    if (object instanceof Array)
      newObject = newObject.map(removeKeys(deep, ...keys));
    else {
      keys.forEach((key) => {
        delete newObject[key];
      });

      if (deep) {
        Object.keys(newObject).forEach((key) => {
          newObject[key] = removeKeys(deep, ...keys)(newObject[key]);
        });
      }
    }

    return newObject;
  };
}

export const indexOf = (string, ...strings) => {
  let index = -1;
  for (let i = 0; i < strings.length && index === -1; ++i)
    index = string.indexOf(strings[i]);
  return index;
};


export const diff = (obj1, obj2) => jdp.diff(obj1, obj2);

export const patch = (obj, delta) => {
  const copy = deepCopy(obj);
  jdp.patch(copy, delta);
  return copy;
};
