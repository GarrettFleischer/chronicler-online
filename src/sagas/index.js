export default function rootSaga() {

}

// function createChannel() {
//   const messageQueue = [];
//   const resolveQueue = [];
//
//   function put(msg) {
//     // anyone waiting for a message ?
//     if (resolveQueue.length) {
//       // deliver the message to the oldest one waiting (First In First Out)
//       const nextResolve = resolveQueue.shift();
//       nextResolve(msg);
//     } else {
//       // no one is waiting ? queue the event
//       messageQueue.push(msg);
//     }
//   }
//
//   // returns a Promise resolved with the next message
//   function take() {
//     // do we have queued messages ?
//     if (messageQueue.length) {
//       // deliver the oldest queued message
//       return Promise.resolve(messageQueue.shift());
//     }
//       // no queued messages ? queue the taker until a message arrives
//     return new Promise((resolve) => resolveQueue.push(resolve));
//   }
//
//   return {
//     take,
//     put,
//   };
// }
//
// function createSyncChannel(replication) {
//   const channel = createChannel();
//
//   // every change event will call put on the channel
//   replication.on('change', channel.put);
//   return channel;
// }
//
// function* startSync(getState) {
//   // Wait for the configuration to be set. This can happen multiple
//   // times during the life cycle, for example when the user wants to
//   // switch database/workspace.
//   while (yield take(DATABASE_SET_CONFIGURATION)) {
//     const state = getState();
//     const wrapper = state.database.wrapper;
//
//     // Wait for a connection to work.
//     yield apply(wrapper, wrapper.connect);
//
//     // Trigger replication, and keep the promise.
//     const replication = wrapper.replicate();
//
//     if (replication)
//       yield call(monitorChangeEvents, createChangeChannel(replication));
//   }
// }
//
// function* monitorChangeEvents(channel) {
//   while (true) {
//     const info = yield call(channel.take); // Blocks until the promise resolves
//     yield put(databaseActions.replicationChange(info));
//   }
// }

