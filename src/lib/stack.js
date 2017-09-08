export function push(stack, data) {
  return [data, ...stack];
}


export function pop(stack) {
  return stack.slice(1);
}


export function peek(stack) {
  return stack[0];
}


export function empty(stack) {
  return (stack.length === 0);
}
