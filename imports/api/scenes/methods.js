import { Meteor } from 'meteor/meteor';
import { LABEL, Nodes } from '../nodes/nodes';
import { Projects } from '../projects/projects';
import {
  Scenes, INSERT, REMOVE, UPDATE,
} from './scenes';
import {
  findById, IdToStr, selectKeyId, toId,
} from '../../logic/utils';


Scenes.helpers({
  project() {
    return Projects.findOne(toId(this.projectId));
  },
  nodes() {
    return Nodes.find(selectKeyId('sceneId', this._id)).fetch();
  },
  startNode() {
    return Nodes.findOne({ sceneId: IdToStr(this._id), start: true });
  },
});

Meteor.methods({
  [INSERT](name, projectId) {
    if (!this.userId) throw new Meteor.Error('not-authorized');

    return Scenes.insert({
      name,
      projectId,
      owner: this.userId,
    });
  },

  [UPDATE](id, { name }) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    const scene = findById(Scenes, id);
    if (scene && scene.name === 'startup') throw new Meteor.Error('immutable-item');

    return Scenes.update(toId(id), { $set: { name } });
  },

  [REMOVE](id) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    const scene = findById(Scenes, id);
    if (scene && scene.name === 'startup') throw new Meteor.Error('indestructible-item');

    return Scenes.remove(toId(id));
  },
});


Scenes.after.insert((userId) => Nodes.insert({
  type: LABEL,
  owner: userId,
  start: true,
  sceneId: IdToStr(this._id),
  link: null,
}));

Scenes.before.remove((userId, doc) => Nodes.remove({ sceneId: IdToStr(doc._id) }));
