import { findById } from '../core';
import { base, cChoice, cIf, cLink, cNext, cText, LinkType, node, scene } from '../nodes';


describe('core', () => {

  describe('findById', () => {

    it('returns null when id not found', () => {
      const result = findById(complexState(), 999);
      expect(result).toEqual(null);
    });

    it('can find a scene at any index', () => {
      let result = findById(complexState(), 1);
      expect(result.id).toEqual(1);

      result = findById(complexState(), 9);
      expect(result.id).toEqual(9);
    });

    it('can find a node at any index', () => {
      let result = findById(complexState(), 2);
      expect(result.id).toEqual(2);

      result = findById(complexState(), 13);
      expect(result.id).toEqual(13);
    });

    it('can find a component at any index', () => {
      let result = findById(complexState(), 3);
      expect(result.id).toEqual(3);

      result = findById(complexState(), 17);
      expect(result.id).toEqual(17);
    });

    it('can find a link', () => {
      const result = findById(complexState(), 18);
      expect(result.id).toEqual(18);
    });

  });

});


function complexState() {
  return (
    base([

      scene(1, 'scene 1', [

        node(2, null, [
          cText(3, 'text 3'),
          cNext(4, 'next 4', 5),
        ]),

        node(5, null, [
          cText(6, 'text 6'),
          cChoice(7, [
            cLink(8, LinkType.NORMAL, 'choice 8', 2, []),
          ]),
        ]),

      ]),

      scene(9, 'scene 9', [

        node(10, null, [
          cText(11, 'text 3'),
          cNext(12, 'next 4', 13),
        ]),

        node(13, null, [
          cText(14, 'text 6'),

          cIf(15, '',
            [cText(16, '')],
            [cChoice(17, [
              cLink(18, LinkType.NORMAL, 'choice 18', 10, []),
            ]),
            ]),


        ]),

      ]),

    ]));
}