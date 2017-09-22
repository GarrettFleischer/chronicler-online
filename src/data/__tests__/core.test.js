import { flatten, flattenNodes } from '../core';
import { base } from '../nodes';


describe('core', () => {
  it('works', () => {

  });

  it('flattens nested nodes', () => {
    const nodes = [
      {
        components: [
          {
            id: 'SJWZChZj-',
            text: 'Hello World!\n',
            type: 'TEXT',
          },
        ],
        id: 'B1YWbC2bjZ',
        label: '',
        link: {
          block: [
            {
              block: [
                {
                  components: [
                    {
                      id: 'SJeZZCnbo-',
                      text: 'My, you\'re cheerful',
                      type: 'TEXT',
                    },
                  ],
                  id: 'H1WZWR3bs-',
                  label: '',
                  link: {
                    text: 'cheerful',
                    type: 'GOTO',
                  },
                  type: 'NODE',
                },
              ],
              condition: null,
              id: 'Syf-bA3-s-',
              reuse: 'HIDE_REUSE',
              text: 'And all who inhabit it!',
              type: 'CHOICE_ITEM',
            },
            {
              block: [
                {
                  components: [
                    {
                      id: 'BymZbRnbiW',
                      text: 'Indeed',
                      type: 'TEXT',
                    },
                  ],
                  id: 'ryUb-R3bj-',
                  label: '',
                  link: {
                    node: {
                      components: [
                        {
                          id: 'S1EWZA2biZ',
                          text: 'happy false',
                          type: 'SET',
                        },
                      ],
                      id: 'BySWW0nbiW',
                      label: 'hate',
                      link: {
                        text: '',
                        type: 'FINISH',
                      },
                      type: 'NODE',
                    },
                    type: 'NODE_LINK',
                  },
                  type: 'NODE',
                },
              ],
              condition: {
                condition: '(true)',
                type: 'IF',
              },
              id: 'rywWWA2bjZ',
              reuse: 'DISABLE_REUSE',
              text: 'I hate Mondays...',
              type: 'CHOICE_ITEM',
            },
          ],
          id: 'HkuZb03WjZ',
          type: 'CHOICE',
        },
        type: 'NODE',
      },
      {
        components: [
          {
            id: 'rkcbZCnWoW',
            text: 'happy true',
            type: 'SET',
          },
        ],
        id: 'B1sZ-ChWib',
        label: 'cheerful',
        link: {
          text: '',
          type: 'FINISH',
        },
        type: 'NODE',
      },
    ];
    const expected = [
      {
        components: [
          {
            id: 'SJWZChZj-',
            text: 'Hello World!\n',
            type: 'TEXT',
          },
        ],
        id: 'B1YWbC2bjZ',
        label: '',
        link: {
          block: [
            {
              link: 'H1WZWR3bs-',
              condition: null,
              id: 'Syf-bA3-s-',
              reuse: 'HIDE_REUSE',
              text: 'And all who inhabit it!',
              type: 'CHOICE_ITEM',
            },
            {
              link: 'ryUb-R3bj-',
              condition: {
                condition: '(true)',
                type: 'IF',
              },
              id: 'rywWWA2bjZ',
              reuse: 'DISABLE_REUSE',
              text: 'I hate Mondays...',
              type: 'CHOICE_ITEM',
            },
          ],
          id: 'HkuZb03WjZ',
          type: 'CHOICE',
        },
        type: 'NODE',
      },
      {
        components: [
          {
            id: 'SJeZZCnbo-',
            text: 'My, you\'re cheerful',
            type: 'TEXT',
          },
        ],
        id: 'H1WZWR3bs-',
        label: '',
        link: {
          type: 'NODE_LINK',
          node: 'B1sZ-ChWib',
        },
        type: 'NODE',
      },
      {
        components: [
          {
            id: 'BymZbRnbiW',
            text: 'Indeed',
            type: 'TEXT',
          },
        ],
        id: 'ryUb-R3bj-',
        label: '',
        link: {
          node: 'BySWW0nbiW',
          type: 'NODE_LINK',
        },
        type: 'NODE',
      },
      {
        components: [
          {
            id: 'S1EWZA2biZ',
            text: 'happy false',
            type: 'SET',
          },
        ],
        id: 'BySWW0nbiW',
        label: 'hate',
        link: {
          text: '',
          type: 'FINISH',
        },
        type: 'NODE',
      },
      {
        components: [
          {
            id: 'rkcbZCnWoW',
            text: 'happy true',
            type: 'SET',
          },
        ],
        id: 'B1sZ-ChWib',
        label: 'cheerful',
        link: {
          text: '',
          type: 'FINISH',
        },
        type: 'NODE',
      },
    ];

    const result = flatten(nodes);
    expect(result).toEqual(expected);
  });
});

// describe('core', () => {
//   describe('findById', () => {
//     it('returns null when id not found', () => {
//       const result = findById(complexState(), 999);
//       expect(result).toEqual(null);
//     });
//
//     it('returns null if id exists but does not match type', () => {
//       const result = findById(complexState(), 18, DataType.NODE);
//       expect(result).toEqual(null);
//     });
//
//     it('can match by type', () => {
//       const result = findById(complexState(), 10, DataType.NODE);
//       expect(result.id).toEqual(10);
//     });
//
//     it('can find a scene at any index', () => {
//       let result = findById(complexState(), 1);
//       expect(result.id).toEqual(1);
//
//       result = findById(complexState(), 9);
//       expect(result.id).toEqual(9);
//     });
//
//     it('can find a node at any index', () => {
//       let result = findById(complexState(), 2);
//       expect(result.id).toEqual(2);
//
//       result = findById(complexState(), 13);
//       expect(result.id).toEqual(13);
//     });
//
//     it('can find a component at any index', () => {
//       let result = findById(complexState(), 3);
//       expect(result.id).toEqual(3);
//
//       result = findById(complexState(), 17);
//       expect(result.id).toEqual(17);
//     });
//
//     it('can find a link', () => {
//       const result = findById(complexState(), 18);
//       expect(result.id).toEqual(18);
//     });
//   });
//
//   describe('setById', () => {
//     it('can set in a node', () => {
//       const result = setById(complexState(), 13, { id: 999 }, DataType.NODE);
//       const updatedNode = findById(result, 999, DataType.NODE);
//
//       expect(updatedNode.id).toEqual(999);
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
