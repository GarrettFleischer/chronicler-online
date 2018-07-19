import { Meteor } from 'meteor/meteor';
import { IdToStr, selectKeyId, toId } from '../../logic/utils';
import { Scenes } from '../scenes/scenes';
import {
  Projects, INSERT, REMOVE, UPDATE,
} from './projects';


Projects.helpers({
  scenes() {
    return Scenes.find(selectKeyId('projectId', this._id)).fetch();
  },
  startScene() {
    return Scenes.findOne({ projectId: IdToStr(this._id), name: 'startup' });
  },
});


Meteor.methods({
  [INSERT](name, author) {
    if (!this.userId) throw new Meteor.Error('not-authorized');

    return Projects.insert({
      owner: this.userId,
      name,
      author,
    });
  },

  [UPDATE](id, { name, author }) {
    return Projects.update(toId(id), { name, author });
  },

  [REMOVE](id) {
    if (!this.userId) throw new Meteor.Error('not-authorized');

    Projects.remove(id);
  },
});

Projects.after.insert((userId) => Scenes.insert({
  owner: userId,
  projectId: IdToStr(this._id),
  name: 'startup',
}));

Projects.before.remove((userId, doc) => Scenes.remove({ projectId: IdToStr(doc._id) }));
