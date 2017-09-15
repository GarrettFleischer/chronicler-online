import { parse } from '../parser';


describe('parser', () => {
  it('works', () => {
    const cs = 'Hello world\n\nAnd all who inhabit it!\n\n*set joy 23\n*goto fun\n\n*label fun\n*set fun %+ 10\n*finish';
    const expected = [];

    const result = parse(cs);

    expect(result).toEqual(expected);
  });
});
