import { generateSymbolTable, makeBlock, procBlocks } from '../ast';
import { CHOICE, CHOICE_ITEM, CREATE, FINISH, LABEL, makeLine, parse, TEMP, TEXT } from '../parser';


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
});


const removeId = (item) => {
  // noinspection JSUnusedLocalSymbols
  const { id, ...other } = item;
  return other;
};
