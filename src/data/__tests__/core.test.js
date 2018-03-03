import { findById, flatten, flattenNodes, getLinks } from '../core';
import { base } from '../nodes';
import { getActiveProject, initialState } from '../state';
import {
  FINISH, makeChoice, makeChoiceItem, makeCondition, makeCreate, makeElse, makeElseIf, makeIf, makeLink,
  makeNodeLink, makeProject,
} from '../datatypes';


describe('core', () => {
  describe('findById', () => {
    it('can find a global variable', () => {
      const result = findById(getActiveProject(initialState), 'var_str');
      expect(result).toEqual({ ...makeCreate('str', '50'), id: 'var_str' });
    });
  });

  describe('getLinks', () => {
    it('returns a single link from a NODE_LINK', () => {
      const link = makeNodeLink('1');
      const expected = ['1'];
      const result = getLinks(link);
      expect(result).toEqual(expected);
    });

    it('returns multiple links from a choice', () => {
      const link = makeChoice([
        makeChoiceItem(null, null, '', makeNodeLink('1')),
        makeChoiceItem(null, null, '', makeLink(FINISH, '')),
        makeChoiceItem(null, null, '', makeNodeLink('2')),
      ]);
      const expected = ['2', '1'];
      const result = getLinks(link);
      expect(result).toEqual(expected);
    });

    it('returns multiple links from a condition', () => {
      const link = makeCondition([
        makeIf('', makeNodeLink('1')),
        makeElseIf('', makeLink(FINISH, '')),
        makeElse(makeNodeLink('2')),
      ]);
      const expected = ['2', '1'];
      const result = getLinks(link);
      expect(result).toEqual(expected);
    });
  });

  describe('findParents', () => {
    it('works', () => {
      makeProject('1', '', '', [

      ], []);
    });
  });
});

// describe('core', () => {
//   describe('findById', () => {
//     it('returns null when PropTypeId not found', () => {
//       const result = findById(complexState(), 999);
//       expect(result).toEqual(null);
//     });
//
//     it('returns null if PropTypeId exists but does not match type', () => {
//       const result = findById(complexState(), 18, DataType.NODE);
//       expect(result).toEqual(null);
//     });
//
//     it('can match by type', () => {
//       const result = findById(complexState(), 10, DataType.NODE);
//       expect(result.PropTypeId).toEqual(10);
//     });
//
//     it('can find a scene at any index', () => {
//       let result = findById(complexState(), 1);
//       expect(result.PropTypeId).toEqual(1);
//
//       result = findById(complexState(), 9);
//       expect(result.PropTypeId).toEqual(9);
//     });
//
//     it('can find a node at any index', () => {
//       let result = findById(complexState(), 2);
//       expect(result.PropTypeId).toEqual(2);
//
//       result = findById(complexState(), 13);
//       expect(result.PropTypeId).toEqual(13);
//     });
//
//     it('can find a component at any index', () => {
//       let result = findById(complexState(), 3);
//       expect(result.PropTypeId).toEqual(3);
//
//       result = findById(complexState(), 17);
//       expect(result.PropTypeId).toEqual(17);
//     });
//
//     it('can find a link', () => {
//       const result = findById(complexState(), 18);
//       expect(result.PropTypeId).toEqual(18);
//     });
//   });
//
//   describe('setById', () => {
//     it('can set in a node', () => {
//       const result = setById(complexState(), 13, { PropTypeId: 999 }, DataType.NODE);
//       const updatedNode = findById(result, 999, DataType.NODE);
//
//       expect(updatedNode.PropTypeId).toEqual(999);
//     });
//   });
// });
//
//
// function complexState() {
//   return (
//     base([
//
//       scene(1, 'scene 1', [
//
//         node(2, null, [
//           cText(3, 'text 3'),
//           cNext(4, 'next 4', 5),
//         ]),
//
//         node(5, null, [
//           cText(6, 'text 6'),
//           cChoice(7, [
//             cLink(8, LinkType.NORMAL, 'choice 8', 2, []),
//           ]),
//         ]),
//
//       ]),
//
//       scene(9, 'scene 9', [
//
//         node(10, null, [
//           cText(11, 'text 3'),
//           cNext(12, 'next 4', 13),
//         ]),
//
//         node(13, null, [
//           cText(14, 'text 6'),
//
//           cIf(15, '',
//             [cText(16, '')],
//             [cChoice(17, [
//               cLink(18, LinkType.NORMAL, 'choice 18', 10, []),
//             ]),
//             ]),
//
//
//         ]),
//
//       ]),
//
//     ]));
// }
