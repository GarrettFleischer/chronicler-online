export function enqueue(queue, data) {
  return [...queue, data];
}


export function dequeue(queue) {
  return queue.slice(1);
}


export function peek(queue) {
  return queue[0];
}


export function empty(queue) {
  return (queue.length === 0);
}


export function iterate(queue, func) {
  for (let i = queue.length - 1; i >= 0; --i)
    func(queue[i], queue.length - 1 - i);
}
