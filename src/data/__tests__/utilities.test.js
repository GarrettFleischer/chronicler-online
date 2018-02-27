import { diff, patch } from '../utilities';

describe('merge', () => {
  it('is immutable', () => {
    const obj1 = {
      top: { topIn: { value: 2, other: 'hello' } },
      mid: { value: 1 },
    };
    const obj2 = {
      top: { topIn: { value: 3, other: 'hello' } },
      mid: { value: 1 },
    };
    const expected = {
      top: { topIn: { value: 2, other: 'hello' } },
      mid: { value: 1 },
    };

    patch(obj1, diff(obj1, obj2));
    expect(obj1).toEqual(expected);
  });

  it('merges deeply nested values', () => {
    const obj = {
      top: { topIn: { value: 2, other: 'hello' } },
      mid: { value: 1 },
    };
    const expected = {
      top: { topIn: { value: 3, other: 'hello' } },
      mid: { value: 1 },
    };

    const delta = diff(obj, expected);
    const result = patch(obj, delta);
    expect(result).toEqual(expected);
  });

  it('merges deeply nested arrays', () => {
    const obj = {
      top: { topIn: { value: [2, 3, 4], other: 'hello' } },
      mid: { value: 1 },
    };
    const expected = {
      top: { topIn: { value: [1, 2, 3, 4], other: 'hello' } },
      mid: { value: 1 },
    };
    const delta = diff(obj, expected);

    const result = patch(obj, delta);
    expect(result).toEqual(expected);
  });
});
