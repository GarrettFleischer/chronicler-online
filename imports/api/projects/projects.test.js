/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  describe('Labels', () => {
    describe('methods', () => {
      it('can delete owned task', () => {
        assert(1).is(1);
      });
    });
  });
}
