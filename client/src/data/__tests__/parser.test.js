import { makeLine, parse, TEXT } from '../parser';


describe('parser', () => {
  it('handles text lines', () => {
    const cs = 'hello\n    world\n        and all\nwho inhabit it';
    const expected = [
      makeLine(TEXT, 0, 'hello', 0, 'hello'),
      makeLine(TEXT, 1, '    world', 4, 'world'),
      makeLine(TEXT, 2, '        and all', 8, 'and all'),
      makeLine(TEXT, 3, 'who inhabit it', 0, 'who inhabit it'),
    ];
    const result = parse(cs);

    expect(result).toEqual(expected);
  });
});
