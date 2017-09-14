import { generateSymbolTable, makeBlock, makeComponent, makeNode, procBlocks } from '../ast';
import { CHOICE, CHOICE_ITEM, CREATE, FINISH, GOTO, LABEL, makeLine, parse, TEMP, TEXT } from '../parser';


const makeChoiceNode = (id, );


describe('ast', () => {
  it('generates a symbol table', () => {
    const cs = '*create name\n*temp color\n*label node_23';
    const lines = parse(cs);
    const expected = [
      makeLine(CREATE, 0, '*create name', 0, 'name'),
      makeLine(TEMP, 1, '*temp color', 0, 'color'),
      makeLine(LABEL, 2, '*label node_23', 0, 'node_23'),
    ];
    const result = generateSymbolTable(lines).map(removeId); // ignore id field

    expect(result).toEqual(expected);
  });

  it('processes blocks', () => {
    const cs = 'Hello World!\n\n*choice\n  #And all who inhabit it!\n\n    My, you\'re cheerful.\n\n    *choice\n      #YES\n        *finish\n      #NO\n        *finish\n    *finish\n\n  #I hate Mondays...\n    Indeed.\n    *finish\n*finish';
    const expected =
      makeBlock(0, [
        makeLine(TEXT, 0, 'Hello World!', 0, 'Hello World!'),
        makeLine(TEXT, 1, '', 0, ''),
        makeLine(CHOICE, 2, '*choice', 0, ''),
        makeBlock(2, [
          makeLine(CHOICE_ITEM, 3, '  #And all who inhabit it!', 2, 'And all who inhabit it!'),
          makeBlock(4, [
            makeLine(TEXT, 5, '    My, you\'re cheerful.', 4, 'My, you\'re cheerful.'),
            makeLine(TEXT, 6, '', 0, ''),
            makeLine(CHOICE, 7, '    *choice', 4, ''),
            makeBlock(6, [
              makeLine(CHOICE_ITEM, 8, '      #YES', 6, 'YES'),
              makeBlock(8, [
                makeLine(FINISH, 9, '        *finish', 8, ''),
              ]),
              makeLine(CHOICE_ITEM, 10, '      #NO', 6, 'NO'),
              makeBlock(8, [
                makeLine(FINISH, 11, '        *finish', 8, ''),
              ]),
            ]),
            makeLine(FINISH, 12, '    *finish', 4, ''),
          ]),
          makeLine(CHOICE_ITEM, 14, '  #I hate Mondays...', 2, 'I hate Mondays...'),
          makeBlock(4, [
            makeLine(TEXT, 15, '    Indeed.', 4, 'Indeed.'),
            makeLine(FINISH, 16, '    *finish', 4, ''),
          ]),
        ]),
        makeLine(FINISH, 17, '*finish', 0, ''),
      ]);
    const lines = parse(cs);
    const result = procBlocks(lines);

    expect(result).toEqual(expected);
  });

  it('can process nodes', () => {
    const cs = 'Hello World!\n\n*choice\n  #And all who inhabit it!\n\n    My, you\'re cheerful.\n\n    *choice\n      #YES\n        *finish\n      #NO\n        *finish\n    *finish\n\n  #I hate Mondays...\n    Indeed.\n    *finish\n*finish';
    const lines = [
      makeLine(TEXT, 0, 'Hello World!', 0, 'Hello World!'),
      makeLine(TEXT, 1, '', 0, ''),
      makeLine(CHOICE, 2, '*choice', 0, ''),
      makeLine(CHOICE_ITEM, 3, '  #And all who inhabit it!', 2, 'And all who inhabit it!'),
      makeLine(GOTO, 4, '    *goto node_1', 4, 'node_1'),
      makeLine(TEXT, 5, '    My, you\'re cheerful.', 4, 'My, you\'re cheerful.'),
      makeLine(TEXT, 6, '', 0, ''),
      makeLine(CHOICE, 7, '    *choice', 4, ''),
      makeLine(CHOICE_ITEM, 8, '      #YES', 6, 'YES'),
      makeLine(FINISH, 9, '        *finish', 8, ''),
      makeLine(CHOICE_ITEM, 10, '      #NO', 6, 'NO'),
      makeLine(FINISH, 11, '        *finish', 8, ''),
      makeLine(FINISH, 12, '    *finish', 4, ''),
      makeLine(CHOICE_ITEM, 14, '  #I hate Mondays...', 2, 'I hate Mondays...'),
      makeLine(TEXT, 15, '    Indeed.', 4, 'Indeed.'),
      makeLine(FINISH, 16, '    *finish', 4, ''),
      makeLine(FINISH, 17, '*finish', 0, ''),
    ];

    const expected = [
      makeNode(1, [makeComponent(2, TEXT, { text: 'Hello World!\n' })], makeLink(CHOICE, [
        makeChoice(3, 'And all who inhabit it!', 5),
        makeChoice(4, 'I hate Mondays...',),
      ])),
      makeNode(5, [makeComponent(6, TEXT, { text: 'My, you\'re cheerful.\n' })], makeLink(CHOICE, [
        makeChoice(7, 'YES',),
        makeChoice(8, 'NO',),
      ])),
      makeNode(),
    ];
  });

  it('processes components', () => {
    const cs = 'Hello World!\n\n*choice\n  #And all who inhabit it!\n\n    My, you\'re cheerful.\n\n    *choice\n      #YES\n        *finish\n      #NO\n        *finish\n    *finish\n\n  #I hate Mondays...\n    Indeed.\n    *finish\n*finish';
    const l1 = makeLine(TEXT, 0, 'Hello World!', 0, 'Hello World!');
    const l2 = makeLine(TEXT, 1, '', 0, '');
    const l3 = makeLine(CHOICE, 2, '*choice', 0, '');
    const l4 = makeLine(CHOICE_ITEM, 3, '  #And all who inhabit it!', 2, 'And all who inhabit it!');
    const l5 = makeLine(TEXT, 5, '    My, you\'re cheerful.', 4, 'My, you\'re cheerful.');
    const l6 = makeLine(TEXT, 6, '', 0, '');
    const l7 = makeLine(CHOICE, 7, '    *choice', 4, '');
    const l8 = makeLine(CHOICE_ITEM, 8, '      #YES', 6, 'YES');
    const l9 = makeLine(FINISH, 9, '        *finish', 8, '');
    const l10 = makeLine(CHOICE_ITEM, 10, '      #NO', 6, 'NO');
    const l11 = makeLine(FINISH, 11, '        *finish', 8, '');
    const l12 = makeLine(FINISH, 12, '    *finish', 4, '');
    const l13 = makeLine(CHOICE_ITEM, 14, '  #I hate Mondays...', 2, 'I hate Mondays...');
    const l14 = makeLine(TEXT, 15, '    Indeed.', 4, 'Indeed.');
    const l15 = makeLine(FINISH, 16, '    *finish', 4, '');
    const l16 = makeLine(FINISH, 17, '*finish', 0, '');
    const expected = [
      makeComponent(TEXT, 0, [l1, l2], []),
      makeComponent(CHOICE, 0, [l3, l4, l5, l6, l7, l8, l9, l10, l11, l12, l13, l14, l15], [
        makeComponent(CHOICE_ITEM, 2, [l4, l5, l6, l7, l8, l9, l10, l11, l12], []),
      ]),
    ];
  });
});


const removeId = (item) => {
  // noinspection JSUnusedLocalSymbols
  const { id, ...other } = item;
  return other;
};
