import { parse } from '../choiceScript';


describe('ChoiceScript parser', () => {
  it('handles non-nested code', () => {
    const cs = 'Hello world\n\nAnd all who inhabit it!\n\n*set joy 23\n*goto fun\n\n*label fun\n*set fun %+ 10\n*finish';
    const expected = {
      object: [
        {
          components: [
            {
              text: 'Hello world\n\nAnd all who inhabit it!\n',
              type: 'TEXT',
            },
            {
              text: 'joy 23',
              type: 'SET',
            },
          ],
          label: null,
          link: {
            text: 'fun',
            type: 'GOTO',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              text: 'fun %+ 10',
              type: 'SET',
            },
          ],
          label: 'fun',
          link: {
            text: '',
            type: 'FINISH',
          },
          type: 'NODE',
        },
      ],
      success: true,
    };

    const result = removeKeys(true, 'id', 'error', 'tokens')(parse(cs));

    expect(result).toEqual(expected);
  });
})
;


function removeKeys(deep, ...keys) {
  return (object) => {
    let newObject = object;
    if (!object || object.substring || object.toFixed)
      return object;

    if (object instanceof Array)
      newObject = newObject.map(removeKeys(deep, ...keys));
    else {
      keys.forEach((key) => {
        delete newObject[key];
      });

      if (deep) {
        Object.keys(newObject).forEach((key) => {
          newObject[key] = removeKeys(deep, ...keys)(newObject[key]);
        });
      }
    }

    return newObject;
  };
}
