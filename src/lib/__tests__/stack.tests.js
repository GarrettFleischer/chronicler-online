import { empty, peek, pop, push } from '../stack';


describe('stack', () => {

  describe('push', () => {

    it('is immutable', () => {
      const stack = [1, 2, 3];
      const expected = [1, 2, 3];
      push(stack, 4);

      expect(stack).toEqual(expected);
    });

    it('adds an element to the stack', () => {
      const stack = [3, 2, 1];
      const expected = [4, 3, 2, 1];
      const result = push(stack, 4);

      expect(result).toEqual(expected);
    });

  });


  describe('pop', () => {

    it('is immutable', () => {
      const stack = [1, 2, 3];
      const expected = [1, 2, 3];
      pop(stack);

      expect(stack).toEqual(expected);
    });

    it('removes the top element from the stack', () => {
      const stack = [3, 2, 1];
      const expected = [2, 1];
      const result = pop(stack);

      expect(result).toEqual(expected);
    });

  });

  describe('peek', () => {

    it('is immutable', () => {
      const stack = [1, 2, 3];
      const expected = [1, 2, 3];
      peek(stack);

      expect(stack).toEqual(expected);
    });

    it('returns the top element on the stack', () => {
      const stack = [3, 2, 1];
      const expected = 3;
      const result = peek(stack);

      expect(result).toEqual(expected);
    });

  });

  describe('empty', () => {

    it('is immutable', () => {
      const stack = [1, 2, 3];
      const expected = [1, 2, 3];
      empty(stack);

      expect(stack).toEqual(expected);
    });

    it('returns false when there is data', () => {
      const stack = [3, 2, 1];
      const expected = false;
      const result = empty(stack);

      expect(result).toEqual(expected);
    });

    it('returns true when there is no data', () => {
      const stack = [];
      const expected = true;
      const result = empty(stack);

      expect(result).toEqual(expected);
    });

  });

});

