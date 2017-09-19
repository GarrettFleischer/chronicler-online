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
    const cs = "Hello World!\n\n*choice\n  *hide_reuse #And all who inhabit it!\n    My, you're cheerful\n    *goto cheerful\n\n  *disable_reuse *if (true) #I hate Mondays...\n    Indeed\n    *label hate\n    *set happy false\n    *finish\n\n*label cheerful\n*set happy true\n*finish";
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
                condition: {
                  condition: '(true) ',
                  type: 'IF',
                },
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

  it('handles if statements', () => {
    const cs = 'Hello world\n\n*if (happy)\n  do something\n  *goto blarg\n*elseif (cool)\n  do something else\n  *goto blarg\n*elseif (other)\n  its another\n  *finish\n*else\n  a thing\n  *finish\n\n*label blarg\n\n*if not (happy)\n  *if (ugly)\n    you are ugly\n    *finish\n*elseif not (cool)\n  do other things\n  *goto foo\n\n*label foo\nbar\n*ending';
    const expected = {
      object: [
        {
          components: [
            {
              text: 'Hello world\n',
              type: 'TEXT',
            },
          ],
          label: '',
          link: {
            block: [
              {
                components: [
                  {
                    text: 'do something',
                    type: 'TEXT',
                  },
                ],
                label: '',
                link: {
                  text: 'blarg',
                  type: 'GOTO',
                },
                type: 'NODE',
              },
            ],
            condition: '(happy)',
            elses: [
              {
                block: [
                  {
                    components: [
                      {
                        text: 'do something else',
                        type: 'TEXT',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'blarg',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                condition: '(cool)',
                type: 'ELSEIF',
              },
              {
                block: [
                  {
                    components: [
                      {
                        text: 'its another',
                        type: 'TEXT',
                      },
                    ],
                    label: '',
                    link: {
                      text: '',
                      type: 'FINISH',
                    },
                    type: 'NODE',
                  },
                ],
                condition: '(other)',
                type: 'ELSEIF',
              },
              {
                block: [
                  {
                    components: [
                      {
                        text: 'a thing',
                        type: 'TEXT',
                      },
                    ],
                    label: '',
                    link: {
                      text: '',
                      type: 'FINISH',
                    },
                    type: 'NODE',
                  },
                ],
                type: 'ELSE',
              },
            ],
            type: 'IF',
          },
          type: 'NODE',
        },
        {
          components: [],
          label: 'blarg',
          link: {
            block: [
              {
                components: [],
                label: '',
                link: {
                  block: [
                    {
                      components: [
                        {
                          text: 'you are ugly',
                          type: 'TEXT',
                        },
                      ],
                      label: '',
                      link: {
                        text: '',
                        type: 'FINISH',
                      },
                      type: 'NODE',
                    },
                  ],
                  condition: '(ugly)',
                  elses: [],
                  type: 'IF',
                },
                type: 'NODE',
              },
            ],
            condition: 'not (happy)',
            elses: [
              {
                block: [
                  {
                    components: [
                      {
                        text: 'do other things',
                        type: 'TEXT',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'foo',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                condition: 'not (cool)',
                type: 'ELSEIF',
              },
            ],
            type: 'IF',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              text: 'bar',
              type: 'TEXT',
            },
          ],
          label: 'foo',
          link: {
            text: '',
            type: 'ENDING',
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

  it('handles fake choices', () => {
    const cs = 'Mike really does make it sound like Jill has been seeing Ben behind your back.\n\n*fake_choice\n\n    #Mike doesn\'t fool me. He has always been jealous of how much Jill loves me.\n\n      It\'s fairly obvious to you that Mike is just trying to make you dump Jill.\n\n    #Mike seems to say stuff like that a lot. He just likes to cause trouble.\n\n      You simply ignore Mike\'s petty mischief, knowing what he\'s really like.\n\n    #I burst out laughing. The whole idea is ridiculous. I mean . . . Ben?!\n\n      You realize that the whole idea of Jill and Ben together is so ridiculous,\n      it\'s laughable.\n\nNot very surprisingly, Mike seems upset that you don\'t appear to believe him!\n\n*finish';
    const expected = {
      object: [
        {
          components: [
            {
              text: 'Mike really does make it sound like Jill has been seeing Ben behind your back.\n',
              type: 'TEXT',
            },
          ],
          label: '',
          link: {
            choices: [
              {
                block: [
                  {
                    text: 'It\'s fairly obvious to you that Mike is just trying to make you dump Jill.\n',
                    type: 'TEXT',
                  },
                ],
                choice: 'Mike doesn\'t fool me. He has always been jealous of how much Jill loves me.',
                condition: null,
                reuse: null,
                type: 'FAKE_CHOICE_ITEM',
              },
              {
                block: [
                  {
                    text: 'You simply ignore Mike\'s petty mischief, knowing what he\'s really like.\n',
                    type: 'TEXT',
                  },
                ],
                choice: 'Mike seems to say stuff like that a lot. He just likes to cause trouble.',
                condition: null,
                reuse: null,
                type: 'FAKE_CHOICE_ITEM',
              },
              {
                block: [
                  {
                    text: 'You realize that the whole idea of Jill and Ben together is so ridiculous,\nit\'s laughable.\n',
                    type: 'TEXT',
                  },
                ],
                choice: 'I burst out laughing. The whole idea is ridiculous. I mean . . . Ben?!',
                condition: null,
                reuse: null,
                type: 'FAKE_CHOICE_ITEM',
              },
            ],
            nodes: [
              {
                components: [
                  {
                    text: 'Not very surprisingly, Mike seems upset that you don\'t appear to believe him!\n',
                    type: 'TEXT',
                  },
                ],
                label: '',
                link: {
                  text: '',
                  type: 'FINISH',
                },
                type: 'NODE',
              },
            ],
            type: 'FAKE_CHOICE',
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

  it('handles dragon', () => {
    const cs = '*title Choice of the Dragon\n*author Dan Fabulich and Adam Strong-Morse\n\n\n*create name ""\n*create brutality 50\n*create cunning 50\n*create disdain 50\n*create gender "unknown"\n\n*comment I\'ve added wounds and blasphemy to provide hit points of sorts;\n*comment if the PC gets hurt, wounds goes up, with 3 usually meaning death;\n*comment impiety tracks whether the gods have been directly angered\n*create wounds 0\n*create blasphemy 0\n*create infamy 50\n*create wealth 5000\n\n*create encourage 0\n*comment encourage = 1 if you encourage the folk religion\n\n*create victory 0\n\n*create clutchmate_alive false\n*create vermias_killed_axilmeus false\n*create callax_alive true\n*comment Callax_Alive = true if Callax is alive, false if Callax is dead\n*create Callax_With false\n\n\nLet us begin.\n\nA knight charges up the slope at you.  His horse pounds at the ground, carrying the heavily armored warrior as if he were a child\'s doll.  The knight sets his lance to attack you.\n\nHow do you defend yourself, O mighty dragon?\n*choice\n  #I take to the air with a quick beat of my wings.\n    You leap to the air, deftly avoiding the knight\'s thrust.  Now that you are in the air, he hardly poses any threat at allâ€”not that he ever posed much of one to you.  You circle back and knock him off his horse with a swipe of your claw.\n\n    *set brutality %-10\n    *goto Victory\n\n  #I knock the knight from his horse with a slap of my tail.\n    You swing your mighty tail around and knock the knight flying.  While he struggles to stand, you break his horse\'s back and begin devouring it.\n\n    *set cunning %+10\n    *goto Victory\n \n  #I rush into his charge and tear him to pieces with my claws.\n    The knight\'s lance shatters against your nigh-impenetrable hide as you slam into him.  You yank him clean off his horse, slamming him to the ground and ripping his plate armor with your vicious claws.  The fight is over before it has begun. \n\n    *set brutality %+10\n    *goto Victory\n\n  #A puff of my fiery breath should be enough for him.\n    You let loose an inferno of fire.  The knight\'s horse is cooked nicely, and your stomach lets out a deafening rumble as the smell of roast destrier reaches your nostrils.  The knight himself staggers to his feet.  His armor managed to keep him alive, but only barely.\n\n    *set disdain %+10\n    *goto Victory\n  *if (choice_save_allowed) #Restore a saved game.\n    *restore_game\n    *goto purchased\n\n*label Victory\n\nDo you finish him off, victorious dragon?\n*choice\n      #Of course!  How dare he attack me?\n        Your jaws crush him in a single bite.\n\n        That showed him.\n        *set brutality %+10\n        *goto Naming\n\n      #I let him live to warn others of my immense power.\n        "Begone, petty human.  To attack me is to meet your doom," you growl.\n\n        The knight stumbles away as quickly as he can, not even daring to pretend that he could still fight you.\n        *set infamy %+15\n        *goto Naming\n\n      #Eh.  Now that the threat is ended, he is beneath my concern.\n        You leisurely eat the knight\'s horse.  He slinks away as quietly as he can.  (His heavy armor makes a stealthy escape impossible.)  Still, you pay him no mind as he leaves.\n\n        *set infamy %+10\n        *set disdain %+10\n        *goto Naming\n\n*label Naming\n\nYou know, it\'s going to get annoying to keep calling you "great and mighty dragon."  What is your name?\n*choice\n    #Gorthalon.\n        *set name "Gorthalon"\n        *goto gender\n    #Sssetheliss.\n        *set name "Sssetheliss"\n        *goto gender\n    #Calemvir.\n        *set name "Calemvir"\n        *goto gender\n';
    const expected = {
      object: [
        {
          components: [
            {
              text: 'Choice of the Dragon',
              type: 'TITLE',
            },
            {
              text: 'Dan Fabulich and Adam Strong-Morse',
              type: 'AUTHOR',
            },
            {
              text: 'name ""',
              type: 'CREATE',
            },
            {
              text: 'brutality 50',
              type: 'CREATE',
            },
            {
              text: 'cunning 50',
              type: 'CREATE',
            },
            {
              text: 'disdain 50',
              type: 'CREATE',
            },
            {
              text: 'gender "unknown"',
              type: 'CREATE',
            },
            {
              text: 'I\'ve added wounds and blasphemy to provide hit points of sorts;',
              type: 'COMMENT',
            },
            {
              text: 'if the PC gets hurt, wounds goes up, with 3 usually meaning death;',
              type: 'COMMENT',
            },
            {
              text: 'impiety tracks whether the gods have been directly angered',
              type: 'COMMENT',
            },
            {
              text: 'wounds 0',
              type: 'CREATE',
            },
            {
              text: 'blasphemy 0',
              type: 'CREATE',
            },
            {
              text: 'infamy 50',
              type: 'CREATE',
            },
            {
              text: 'wealth 5000',
              type: 'CREATE',
            },
            {
              text: 'encourage 0',
              type: 'CREATE',
            },
            {
              text: 'encourage = 1 if you encourage the folk religion',
              type: 'COMMENT',
            },
            {
              text: 'victory 0',
              type: 'CREATE',
            },
            {
              text: 'clutchmate_alive false',
              type: 'CREATE',
            },
            {
              text: 'vermias_killed_axilmeus false',
              type: 'CREATE',
            },
            {
              text: 'callax_alive true',
              type: 'CREATE',
            },
            {
              text: 'Callax_Alive = true if Callax is alive, false if Callax is dead',
              type: 'COMMENT',
            },
            {
              text: 'Callax_With false',
              type: 'CREATE',
            },
            {
              text: 'Let us begin.\n\nA knight charges up the slope at you.  His horse pounds at the ground, carrying the heavily armored warrior as if he were a child\'s doll.  The knight sets his lance to attack you.\n\nHow do you defend yourself, O mighty dragon?',
              type: 'TEXT',
            },
          ],
          label: '',
          link: {
            choices: [
              {
                choice: 'I take to the air with a quick beat of my wings.',
                condition: null,
                nodes: [
                  {
                    components: [
                      {
                        text: 'You leap to the air, deftly avoiding the knight\'s thrust.  Now that you are in the air, he hardly poses any threat at allâ€”not that he ever posed much of one to you.  You circle back and knock him off his horse with a swipe of your claw.\n',
                        type: 'TEXT',
                      },
                      {
                        text: 'brutality %-10',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'Victory',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                reuse: null,
                type: 'CHOICE_ITEM',
              },
              {
                choice: 'I knock the knight from his horse with a slap of my tail.',
                condition: null,
                nodes: [
                  {
                    components: [
                      {
                        text: 'You swing your mighty tail around and knock the knight flying.  While he struggles to stand, you break his horse\'s back and begin devouring it.\n',
                        type: 'TEXT',
                      },
                      {
                        text: 'cunning %+10',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'Victory',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                reuse: null,
                type: 'CHOICE_ITEM',
              },
              {
                choice: 'I rush into his charge and tear him to pieces with my claws.',
                condition: null,
                nodes: [
                  {
                    components: [
                      {
                        text: 'The knight\'s lance shatters against your nigh-impenetrable hide as you slam into him.  You yank him clean off his horse, slamming him to the ground and ripping his plate armor with your vicious claws.  The fight is over before it has begun. \n',
                        type: 'TEXT',
                      },
                      {
                        text: 'brutality %+10',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'Victory',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                reuse: null,
                type: 'CHOICE_ITEM',
              },
              {
                choice: 'A puff of my fiery breath should be enough for him.',
                condition: null,
                nodes: [
                  {
                    components: [
                      {
                        text: 'You let loose an inferno of fire.  The knight\'s horse is cooked nicely, and your stomach lets out a deafening rumble as the smell of roast destrier reaches your nostrils.  The knight himself staggers to his feet.  His armor managed to keep him alive, but only barely.\n',
                        type: 'TEXT',
                      },
                      {
                        text: 'disdain %+10',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'Victory',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                reuse: null,
                type: 'CHOICE_ITEM',
              },
              {
                choice: 'Restore a saved game.',
                condition: {
                  condition: '(choice_save_allowed) ',
                  type: 'IF',
                },
                nodes: [
                  {
                    components: [
                      {
                        text: '*restore_game',
                        type: 'TEXT',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'purchased',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                reuse: null,
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
              text: 'Do you finish him off, victorious dragon?',
              type: 'TEXT',
            },
          ],
          label: 'Victory',
          link: {
            choices: [
              {
                choice: 'Of course!  How dare he attack me?',
                condition: null,
                nodes: [
                  {
                    components: [
                      {
                        text: 'Your jaws crush him in a single bite.\n\nThat showed him.',
                        type: 'TEXT',
                      },
                      {
                        text: 'brutality %+10',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'Naming',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                reuse: null,
                type: 'CHOICE_ITEM',
              },
              {
                choice: 'I let him live to warn others of my immense power.',
                condition: null,
                nodes: [
                  {
                    components: [
                      {
                        text: '"Begone, petty human.  To attack me is to meet your doom," you growl.\n\nThe knight stumbles away as quickly as he can, not even daring to pretend that he could still fight you.',
                        type: 'TEXT',
                      },
                      {
                        text: 'infamy %+15',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'Naming',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                reuse: null,
                type: 'CHOICE_ITEM',
              },
              {
                choice: 'Eh.  Now that the threat is ended, he is beneath my concern.',
                condition: null,
                nodes: [
                  {
                    components: [
                      {
                        text: 'You leisurely eat the knight\'s horse.  He slinks away as quietly as he can.  (His heavy armor makes a stealthy escape impossible.)  Still, you pay him no mind as he leaves.\n',
                        type: 'TEXT',
                      },
                      {
                        text: 'infamy %+10',
                        type: 'SET',
                      },
                      {
                        text: 'disdain %+10',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'Naming',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                reuse: null,
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
              text: 'You know, it\'s going to get annoying to keep calling you "great and mighty dragon."  What is your name?',
              type: 'TEXT',
            },
          ],
          label: 'Naming',
          link: {
            choices: [
              {
                choice: 'Gorthalon.',
                condition: null,
                nodes: [
                  {
                    components: [
                      {
                        text: 'name "Gorthalon"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'gender',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                reuse: null,
                type: 'CHOICE_ITEM',
              },
              {
                choice: 'Sssetheliss.',
                condition: null,
                nodes: [
                  {
                    components: [
                      {
                        text: 'name "Sssetheliss"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'gender',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                reuse: null,
                type: 'CHOICE_ITEM',
              },
              {
                choice: 'Calemvir.',
                condition: null,
                nodes: [
                  {
                    components: [
                      {
                        text: 'name "Calemvir"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'gender',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                reuse: null,
                type: 'CHOICE_ITEM',
              },
            ],
            type: 'CHOICE',
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
