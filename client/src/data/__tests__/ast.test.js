import { generateSymbolTable } from '../ast';
import { CREATE, LABEL, makeLine, parse, TEMP } from '../parser';


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
});


const removeId = (item) => {
  // noinspection JSUnusedLocalSymbols
  const { id, ...other } = item;
  return other;
};
