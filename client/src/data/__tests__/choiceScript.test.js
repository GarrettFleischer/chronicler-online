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
          label: '',
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

    // remove id from nested objects, then error and tokens from top object
    const result = parse(cs);
    const filtered = removeKeys(false, 'error', 'tokens', 'indent')(removeKeys(true, 'id')({ ...result }));

    expect(filtered).toEqual(expected);
  });

  it('handles nested choices', () => {
    const cs = "Hello World!\n\n*choice\n  *hide_reuse #And all who inhabit it!\n    My, you're cheerful\n    *goto cheerful\n\n  *disable_reuse #I hate Mondays...\n    Indeed\n    *label hate\n    *set happy false\n    *finish\n\n*label cheerful\n*set happy true\n*finish";
    const expected = {
      object: [
        {
          components: [
            {
              text: 'Hello World!\n',
              type: 'TEXT',
            },
          ],
          label: '',
          link: {
            choices: [
              {
                choice: 'And all who inhabit it!',
                condition: null,
                nodes: [
                  {
                    components: [
                      {
                        text: "My, you're cheerful",
                        type: 'TEXT',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'cheerful',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                reuse: 'HIDE_REUSE',
                type: 'CHOICE_ITEM',
              },
              {
                choice: 'I hate Mondays...',
                condition: null,
                nodes: [
                  {
                    components: [
                      {
                        text: 'Indeed',
                        type: 'TEXT',
                      },
                    ],
                    label: '',
                    link: {
                      node: {
                        components: [
                          {
                            text: 'happy false',
                            type: 'SET',
                          },
                        ],
                        label: 'hate',
                        link: {
                          text: '',
                          type: 'FINISH',
                        },
                        type: 'NODE',
                      },
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                reuse: 'DISABLE_REUSE',
                type: 'CHOICE_ITEM',
              },
            ],
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              text: 'happy true',
              type: 'SET',
            },
          ],
          label: 'cheerful',
          link: {
            text: '',
            type: 'FINISH',
          },
          type: 'NODE',
        },
      ],
      success: true,
    };

    const result = parse(cs);
    const filtered = removeKeys(false, 'error', 'tokens', 'indent')(removeKeys(true, 'id')({ ...result }));

    expect(filtered).toEqual(expected);
  });
});


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
