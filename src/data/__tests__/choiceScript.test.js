import { parse } from '../choiceScript';
import { dragonCS } from './dragon';


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
      symbols: [],
    };

    // remove id from nested objects, then error and tokens from top object
    const result = parse(cs);
    const filtered = removeKeys(false, 'scene', 'error', 'tokens', 'indent')(removeKeys(true, 'id')({ ...result }));

    expect(filtered).toEqual(expected);
  });

  it('handles nested choices', () => {
    const cs = 'Hello World!\n\n*choice\n  *hide_reuse #And all who inhabit it!\n    My, you\'re cheerful\n    *goto cheerful\n\n  *disable_reuse *if (true) #I hate Mondays...\n    Indeed\n    *label hate\n    *set happy false\n    *finish\n\n*label cheerful\n*set happy true\n*finish';
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
            block: [
              {
                block: [
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
                condition: null,
                reuse: 'HIDE_REUSE',
                text: 'And all who inhabit it!',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
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
                      type: 'NODE_LINK',
                    },
                    type: 'NODE',
                  },
                ],
                condition: {
                  condition: '(true)',
                  type: 'IF',
                },
                reuse: 'DISABLE_REUSE',
                text: 'I hate Mondays...',
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
      symbols: [],
    };

    const result = parse(cs);
    const filtered = removeKeys(false, 'scene', 'error', 'tokens', 'indent')(removeKeys(true, 'id')({ ...result }));

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
      symbols: [],
    };

    const result = parse(cs);
    const filtered = removeKeys(false, 'scene', 'error', 'tokens', 'indent')(removeKeys(true, 'id')({ ...result }));

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
                condition: null,
                reuse: null,
                text: 'Mike doesn\'t fool me. He has always been jealous of how much Jill loves me.',
                type: 'FAKE_CHOICE_ITEM',
              },
              {
                block: [
                  {
                    text: 'You simply ignore Mike\'s petty mischief, knowing what he\'s really like.\n',
                    type: 'TEXT',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'Mike seems to say stuff like that a lot. He just likes to cause trouble.',
                type: 'FAKE_CHOICE_ITEM',
              },
              {
                block: [
                  {
                    text: 'You realize that the whole idea of Jill and Ben together is so ridiculous,\nit\'s laughable.\n',
                    type: 'TEXT',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'I burst out laughing. The whole idea is ridiculous. I mean . . . Ben?!',
                type: 'FAKE_CHOICE_ITEM',
              },
            ],
            link: [
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
      symbols: [],
    };

    const result = parse(cs);
    const filtered = removeKeys(false, 'scene', 'error', 'tokens', 'indent')(removeKeys(true, 'id')({ ...result }));

    expect(filtered).toEqual(expected);
  });

  it('successfully parses dragon', () => {
    const cs = dragonCS;
    const expected = {
      object: [
        {
          components: [
            {
              text: 'Let us begin.\n\nA knight charges up the slope at you.  His horse pounds at the ground, carrying the heavily armored warrior as if he were a child\'s doll.  The knight sets his lance to attack you.\n\nHow do you defend yourself, O mighty dragon?',
              type: 'TEXT',
            },
          ],
          label: '',
          link: {
            block: [
              {
                block: [
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
                condition: null,
                reuse: null,
                text: 'I take to the air with a quick beat of my wings.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
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
                condition: null,
                reuse: null,
                text: 'I knock the knight from his horse with a slap of my tail.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
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
                condition: null,
                reuse: null,
                text: 'I rush into his charge and tear him to pieces with my claws.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
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
                condition: null,
                reuse: null,
                text: 'A puff of my fiery breath should be enough for him.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
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
                condition: {
                  condition: '(choice_save_allowed)',
                  type: 'IF',
                },
                reuse: null,
                text: 'Restore a saved game.',
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
            block: [
              {
                block: [
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
                condition: null,
                reuse: null,
                text: 'Of course!  How dare he attack me?',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
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
                condition: null,
                reuse: null,
                text: 'I let him live to warn others of my immense power.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
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
                condition: null,
                reuse: null,
                text: 'Eh.  Now that the threat is ended, he is beneath my concern.',
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
            block: [
              {
                block: [
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
                condition: null,
                reuse: null,
                text: 'Gorthalon.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
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
                condition: null,
                reuse: null,
                text: 'Sssetheliss.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
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
                condition: null,
                reuse: null,
                text: 'Calemvir.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
                  {
                    components: [
                      {
                        text: 'Oh! Please forgive me.',
                        type: 'TEXT',
                      },
                    ],
                    label: '',
                    link: {
                      node: {
                        components: [
                          {
                            text: 'What name would you prefer?',
                            type: 'TEXT',
                          },
                          {
                            text: 'name',
                            type: 'INPUT_TEXT',
                          },
                          {
                            text: 'check capitalization',
                            type: 'COMMENT',
                          },
                        ],
                        label: 'input_name',
                        link: {
                          block: [
                            {
                              components: [
                                {
                                  text: 'Your name is $!{name}, is that right?\n',
                                  type: 'TEXT',
                                },
                              ],
                              label: '',
                              link: {
                                block: [
                                  {
                                    block: [
                                      {
                                        components: [
                                          {
                                            text: 'name "$!{name}"',
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
                                    condition: null,
                                    reuse: null,
                                    text: 'Yes.',
                                    type: 'CHOICE_ITEM',
                                  },
                                  {
                                    block: [
                                      {
                                        components: [],
                                        label: '',
                                        link: {
                                          text: 'gender',
                                          type: 'GOTO',
                                        },
                                        type: 'NODE',
                                      },
                                    ],
                                    condition: null,
                                    reuse: null,
                                    text: 'No, my name is ${name}, just as I said.',
                                    type: 'CHOICE_ITEM',
                                  },
                                  {
                                    block: [
                                      {
                                        components: [],
                                        label: '',
                                        link: {
                                          text: 'input_name',
                                          type: 'GOTO',
                                        },
                                        type: 'NODE',
                                      },
                                    ],
                                    condition: null,
                                    reuse: null,
                                    text: 'Er, wait, let me try that again.',
                                    type: 'CHOICE_ITEM',
                                  },
                                ],
                                type: 'CHOICE',
                              },
                              type: 'NODE',
                            },
                          ],
                          condition: '("${name}" != "$!{name}")',
                          elses: [],
                          type: 'IF',
                        },
                        type: 'NODE',
                      },
                      type: 'NODE_LINK',
                    },
                    type: 'NODE',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'These names are all terrible!',
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
              text: 'Will you be male or female?',
              type: 'TEXT',
            },
          ],
          label: 'gender',
          link: {
            block: [
              {
                block: [
                  {
                    components: [
                      {
                        text: 'gender "male"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'Princess',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'Male.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
                  {
                    components: [
                      {
                        text: 'gender "female"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'Princess',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'Female.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
                  {
                    components: [
                      {
                        text: 'gender "neither"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'Princess',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'Neither.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
                  {
                    components: [
                      {
                        text: 'gender "unknown"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'Princess',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'Unknown/undetermined.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
                  {
                    components: [
                      {
                        text: 'brutality %+ 15',
                        type: 'SET',
                      },
                      {
                        text: 'I, ah, I mean, yes!  Of course!  How churlish of me.\n\nBut, O mighty ${name}, I feel I should let you know that this game is full of choices; indeed, it is nothing but multiple choice questions that determine the course of your adventures as a dragon.  If you don\'t enjoy answering questions, this game may not be for you!\n\nDo youâ€¦I mean, if I may, would you like to specify your gender after all?\n',
                        type: 'TEXT',
                      },
                    ],
                    label: '',
                    link: {
                      block: [
                        {
                          block: [
                            {
                              components: [
                                {
                                  text: 'Excellent choice!  What gender will you be?\n',
                                  type: 'TEXT',
                                },
                              ],
                              label: '',
                              link: {
                                block: [
                                  {
                                    block: [
                                      {
                                        components: [
                                          {
                                            text: 'gender "male"',
                                            type: 'SET',
                                          },
                                        ],
                                        label: '',
                                        link: {
                                          text: 'Princess',
                                          type: 'GOTO',
                                        },
                                        type: 'NODE',
                                      },
                                    ],
                                    condition: null,
                                    reuse: null,
                                    text: 'Male.',
                                    type: 'CHOICE_ITEM',
                                  },
                                  {
                                    block: [
                                      {
                                        components: [
                                          {
                                            text: 'gender "female"',
                                            type: 'SET',
                                          },
                                        ],
                                        label: '',
                                        link: {
                                          text: 'Princess',
                                          type: 'GOTO',
                                        },
                                        type: 'NODE',
                                      },
                                    ],
                                    condition: null,
                                    reuse: null,
                                    text: 'Female.',
                                    type: 'CHOICE_ITEM',
                                  },
                                  {
                                    block: [
                                      {
                                        components: [
                                          {
                                            text: 'gender "neither"',
                                            type: 'SET',
                                          },
                                        ],
                                        label: '',
                                        link: {
                                          text: 'Princess',
                                          type: 'GOTO',
                                        },
                                        type: 'NODE',
                                      },
                                    ],
                                    condition: null,
                                    reuse: null,
                                    text: 'Neither.',
                                    type: 'CHOICE_ITEM',
                                  },
                                  {
                                    block: [
                                      {
                                        components: [
                                          {
                                            text: 'gender "unknown"',
                                            type: 'SET',
                                          },
                                        ],
                                        label: '',
                                        link: {
                                          text: 'Princess',
                                          type: 'GOTO',
                                        },
                                        type: 'NODE',
                                      },
                                    ],
                                    condition: null,
                                    reuse: null,
                                    text: 'Unknown/undetermined.',
                                    type: 'CHOICE_ITEM',
                                  },
                                ],
                                type: 'CHOICE',
                              },
                              type: 'NODE',
                            },
                          ],
                          condition: null,
                          reuse: null,
                          text: 'Very well.',
                          type: 'CHOICE_ITEM',
                        },
                        {
                          block: [
                            {
                              components: [
                                {
                                  text: 'gender "unknown"',
                                  type: 'SET',
                                },
                                {
                                  text: 'Well, let\'s just leave it undetermined, then!',
                                  type: 'TEXT',
                                },
                              ],
                              label: '',
                              link: {
                                text: 'Princess',
                                type: 'GOTO',
                              },
                              type: 'NODE',
                            },
                          ],
                          condition: null,
                          reuse: null,
                          text: 'I said no.',
                          type: 'CHOICE_ITEM',
                        },
                      ],
                      type: 'CHOICE',
                    },
                    type: 'NODE',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'Do not pester me with impudent questions!',
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
              text: 'As you think about it, the knight\'s attack was probably inevitable.  After all, you did just kidnap the princess from right out of her tower.  Althoughâ€¦\n\nIsn\'t it a little sexist to always kidnap princesses?',
              type: 'TEXT',
            },
          ],
          label: 'Princess',
          link: {
            block: [
              {
                block: [
                  {
                    components: [
                      {
                        text: 'I guess you\'re right.\n\nAnyway, as you ripped the roof off her tower, the light glistened off yourâ€¦',
                        type: 'TEXT',
                      },
                      {
                        text: 'royal "princess"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'color',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'Maybe, but tradition demands that dragons kidnap princesses, even if that is sexist.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
                  {
                    components: [
                      {
                        text: 'No, no!  Of course not.  I just wanted toâ€”I meanâ€”What I\'m trying to say isâ€¦\n\nLet\'s just move on.\n\nAnyway, as you ripped the roof off her tower, the light glistened off yourâ€¦',
                        type: 'TEXT',
                      },
                      {
                        text: 'royal "princess"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'color',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'You dare question my actions?',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
                  {
                    components: [
                      {
                        text: 'Right you are.  As I was saying, the knight\'s attack was probably inevitable.  After all, you did just kidnap the prince \nfrom right out of his tower.  As you ripped the roof off his tower, the light glistened off yourâ€¦',
                        type: 'TEXT',
                      },
                      {
                        text: 'royal "prince"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'color',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'You know, I never thought about that before.  In fact, I think I kidnapped a prince, just to avoid being sexist.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
                  {
                    components: [
                      {
                        text: 'Of course.  I\'m sorry for questioning you.\n\nAnyway, as you ripped the roof off her tower, the light glistened off yourâ€¦',
                        type: 'TEXT',
                      },
                      {
                        text: 'royal "princess"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'color',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'I\'ll have you know that I make a careful point of alternating between princes and princesses, but it happened to be time for a princess.',
                type: 'CHOICE_ITEM',
              },
            ],
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [],
          label: 'color',
          link: {
            block: [
              {
                components: [
                  {
                    text: 'royal_him "her"',
                    type: 'SET',
                  },
                  {
                    text: 'royal_his "her"',
                    type: 'SET',
                  },
                  {
                    text: 'royal_she "she"',
                    type: 'SET',
                  },
                  {
                    text: 'royals "princesses"',
                    type: 'SET',
                  },
                ],
                label: '',
                link: {
                  text: 'A',
                  type: 'GOTO',
                },
                type: 'NODE',
              },
            ],
            condition: '(royal="princess")',
            elses: [
              {
                block: [
                  {
                    components: [
                      {
                        text: 'royal_him "him"',
                        type: 'SET',
                      },
                      {
                        text: 'royal_his "his"',
                        type: 'SET',
                      },
                      {
                        text: 'royal_she "he"',
                        type: 'SET',
                      },
                      {
                        text: 'royals "princes"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'A',
                      type: 'GOTO',
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
          components: [
            {
              text: 'Ah, would you like to specify the color of your hide?  I wasn\'t sure which color to put in that description.\n',
              type: 'TEXT',
            },
          ],
          label: 'A',
          link: {
            block: [
              {
                block: [
                  {
                    components: [
                      {
                        text: 'brutality %+ 30',
                        type: 'SET',
                      },
                      {
                        text: 'yes, of course!  Your wish is my command.\n\nOn with the show!\n',
                        type: 'TEXT',
                      },
                      {
                        text: '',
                        type: 'PAGE_BREAK',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'RoyalResolution',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'Can we just get on to the smashing?',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
                  {
                    components: [
                      {
                        text: 'color "black"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'limbs',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'Black.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
                  {
                    components: [
                      {
                        text: 'color "blue"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'limbs',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'Blue.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
                  {
                    components: [
                      {
                        text: 'color "brown"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'limbs',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'Brown.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
                  {
                    components: [
                      {
                        text: 'color "golden"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'limbs',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'Gold.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
                  {
                    components: [
                      {
                        text: 'color "green"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'limbs',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'Green.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
                  {
                    components: [
                      {
                        text: 'color "iridescent"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'limbs',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'Iridescent.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
                  {
                    components: [
                      {
                        text: 'color "red"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'limbs',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'Red.',
                type: 'CHOICE_ITEM',
              },
              {
                block: [
                  {
                    components: [
                      {
                        text: 'color "white"',
                        type: 'SET',
                      },
                    ],
                    label: '',
                    link: {
                      text: 'limbs',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
                condition: null,
                reuse: null,
                text: 'White.',
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
              text: 'Wonderful choice.  So the light glistened off your ${color} hide, as you snatched the ${royal} out of ${royal_his} tower.\n\nWhile we\'re on the subject, let\'s settle a few other details.  How many limbs will you have, not counting your wings or tail?\n',
              type: 'TEXT',
            },
          ],
          label: 'limbs',
          link: {
            choices: [
              {
                block: null,
                condition: null,
                reuse: null,
                text: 'Four.',
                type: 'FAKE_CHOICE_ITEM',
              },
              {
                block: null,
                condition: null,
                reuse: null,
                text: 'Five.',
                type: 'FAKE_CHOICE_ITEM',
              },
              {
                block: null,
                condition: null,
                reuse: null,
                text: 'Six.',
                type: 'FAKE_CHOICE_ITEM',
              },
              {
                block: null,
                condition: null,
                reuse: null,
                text: 'Eight.',
                type: 'FAKE_CHOICE_ITEM',
              },
            ],
            link: [
              {
                components: [
                  {
                    text: 'Hmm.  Is the top of your head ridged or smooth?',
                    type: 'TEXT',
                  },
                ],
                label: '',
                link: {
                  block: [
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'head "ridged"',
                              type: 'SET',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'wings',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: 'Ridged.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'head "smooth"',
                              type: 'SET',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'wings',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: 'Smooth.',
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
                    text: 'I see.  And your wingsâ€”feathery, leathery, or scaly?\n',
                    type: 'TEXT',
                  },
                ],
                label: 'wings',
                link: {
                  block: [
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'wings "feathery"',
                              type: 'SET',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'Summary',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: 'Feathery.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'wings "leathery"',
                              type: 'SET',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'Summary',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: 'Leathery.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'wings "scaly"',
                              type: 'SET',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'Summary',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: 'Scaly.',
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
                    text: 'As you kidnapped the ${royal}, you beat your ${wings} ${color} wings and flew off into the night, as ${royal_she} clutched tightly to your ${head} scalp to avoid plummeting to ${royal_his} doom.\n',
                    type: 'TEXT',
                  },
                ],
                label: 'Summary',
                link: {
                  node: {
                    components: [
                      {
                        text: 'What are you planning on doing with the ${royal}, anyway?',
                        type: 'TEXT',
                      },
                    ],
                    label: 'RoyalResolution',
                    link: {
                      block: [
                        {
                          block: [
                            {
                              components: [
                                {
                                  text: 'Life can be lonely as a dragon, and interesting conversation is at a premium.  The elite upbringing of royalty makes them more suitable for entertaining dragons.\n\nBut what do you do after you tire of ${royal_his} conversation?',
                                  type: 'TEXT',
                                },
                              ],
                              label: '',
                              link: {
                                block: [
                                  {
                                    block: [
                                      {
                                        components: [
                                          {
                                            text: 'The ${royal}\'s efforts to entertain you with ${royal_his} stories, harp-playing, and singing become more desperate as your boredom becomes more apparent.  But even ${royal_his} best efforts are not enough, and you devour ${royal_him} without remorse.\n',
                                            type: 'TEXT',
                                          },
                                          {
                                            text: 'brutality %+10',
                                            type: 'SET',
                                          },
                                          {
                                            text: 'cunning %+10',
                                            type: 'SET',
                                          },
                                          {
                                            text: 'infamy %+10',
                                            type: 'SET',
                                          },
                                        ],
                                        label: '',
                                        link: {
                                          text: 'personality',
                                          type: 'GOTO',
                                        },
                                        type: 'NODE',
                                      },
                                    ],
                                    condition: null,
                                    reuse: null,
                                    text: 'Then it\'s time for a royal feastâ€”by which I mean I eat ${royal_him}.',
                                    type: 'CHOICE_ITEM',
                                  },
                                  {
                                    block: [
                                      {
                                        components: [
                                          {
                                            text: 'The ${royal} becomes gradually more fearful as ${royal_his} stories, harp-playing, and singing amuse you less each passing day.  One evening, as you pretend to sleep, ${royal_she} makes a break for it.  You are well aware of ${royal_his} departure and could catch ${royal_him} easily, but you let ${royal_him} go.  $!{Royal_She} made several months more interesting, and that\'s\nworth sparing ${royal_his} life.',
                                            type: 'TEXT',
                                          },
                                          {
                                            text: 'brutality %-10',
                                            type: 'SET',
                                          },
                                          {
                                            text: 'cunning %-10',
                                            type: 'SET',
                                          },
                                          {
                                            text: 'infamy %-10',
                                            type: 'SET',
                                          },
                                        ],
                                        label: '',
                                        link: {
                                          text: 'personality',
                                          type: 'GOTO',
                                        },
                                        type: 'NODE',
                                      },
                                    ],
                                    condition: null,
                                    reuse: null,
                                    text: 'I let ${royal_him} slip away, pretending not to notice ${royal_his} escape plan.',
                                    type: 'CHOICE_ITEM',
                                  },
                                ],
                                type: 'CHOICE',
                              },
                              type: 'NODE',
                            },
                          ],
                          condition: null,
                          reuse: null,
                          text: 'It\'s all about companionship and good conversation.',
                          type: 'CHOICE_ITEM',
                        },
                        {
                          block: [
                            {
                              components: [],
                              label: '',
                              link: {
                                text: 'EatHer',
                                type: 'GOTO',
                              },
                              type: 'NODE',
                            },
                          ],
                          condition: null,
                          reuse: null,
                          text: 'I\'ll keep ${royal_him} around for a little while to lure in more knights, but then ${royal_she}\'s dinner.  It\'s a little known fact that ${royals} taste better than most humans.',
                          type: 'CHOICE_ITEM',
                        },
                        {
                          block: [
                            {
                              components: [
                                {
                                  text: 'Indeed.  Within a month, a large chest of gold comes to pay for the ${royal}\'s release.',
                                  type: 'TEXT',
                                },
                                {
                                  text: 'wealth +1500',
                                  type: 'SET',
                                },
                                {
                                  text: 'What do you do then?',
                                  type: 'TEXT',
                                },
                              ],
                              label: '',
                              link: {
                                block: [
                                  {
                                    block: [
                                      {
                                        components: [
                                          {
                                            text: 'Of course.  No sooner have you received the payment than you let the ${royal} go.',
                                            type: 'TEXT',
                                          },
                                          {
                                            text: 'cunning %-20',
                                            type: 'SET',
                                          },
                                          {
                                            text: 'brutality %-10',
                                            type: 'SET',
                                          },
                                          {
                                            text: 'infamy %-10',
                                            type: 'SET',
                                          },
                                        ],
                                        label: '',
                                        link: {
                                          text: 'personality',
                                          type: 'GOTO',
                                        },
                                        type: 'NODE',
                                      },
                                    ],
                                    condition: null,
                                    reuse: null,
                                    text: 'Honor demands that I carry out my end of the bargain.',
                                    type: 'CHOICE_ITEM',
                                  },
                                  {
                                    block: [
                                      {
                                        components: [
                                          {
                                            text: 'Crunch, munch.  Delicious.\n',
                                            type: 'TEXT',
                                          },
                                          {
                                            text: 'cunning %+20',
                                            type: 'SET',
                                          },
                                          {
                                            text: 'brutality %+10',
                                            type: 'SET',
                                          },
                                          {
                                            text: 'infamy %+10',
                                            type: 'SET',
                                          },
                                        ],
                                        label: '',
                                        link: {
                                          text: 'personality',
                                          type: 'GOTO',
                                        },
                                        type: 'NODE',
                                      },
                                    ],
                                    condition: null,
                                    reuse: null,
                                    text: 'Once I have the payment, I have no reason to delay my dinner.',
                                    type: 'CHOICE_ITEM',
                                  },
                                ],
                                type: 'CHOICE',
                              },
                              type: 'NODE',
                            },
                          ],
                          condition: null,
                          reuse: null,
                          text: 'It\'s all about the ransom payments.  Those are a quick and easy way to build a hoard.',
                          type: 'CHOICE_ITEM',
                        },
                      ],
                      type: 'CHOICE',
                    },
                    type: 'NODE',
                  },
                  type: 'NODE_LINK',
                },
                type: 'NODE',
              },
              {
                components: [
                  {
                    text: 'It must be the diet.  In any event, you have a delightful dinner of roast ${royal}.',
                    type: 'TEXT',
                  },
                  {
                    text: 'brutality %+10',
                    type: 'SET',
                  },
                  {
                    text: 'infamy %+10',
                    type: 'SET',
                  },
                ],
                label: 'EatHer',
                link: {
                  text: 'personality',
                  type: 'GOTO',
                },
                type: 'NODE',
              },
              {
                components: [
                  {
                    text: '',
                    type: 'PAGE_BREAK',
                  },
                  {
                    text: 'This would be a good time to talk a little more about your personality.\n\nAll dragons can be described in terms of a handful of characteristics, each in opposed pairs:  Brutality and Finesse, Cunning and Honor, Disdain and Vigilance.\n',
                    type: 'TEXT',
                  },
                  {
                    text: 'We start with the basic dichotomies between the paired attributes',
                    type: 'COMMENT',
                  },
                  {
                    text: 'brutality is the opposite of finesse; only modify by %+ or %-',
                    type: 'COMMENT',
                  },
                  {
                    text: 'Are you more notable for your Brutality or your Finesse?',
                    type: 'TEXT',
                  },
                ],
                label: 'personality',
                link: {
                  block: [
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'brutality %+70',
                              type: 'SET',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'CunningQuestion',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: 'Brutality: strength and cruelty.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'brutality %-70',
                              type: 'SET',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'CunningQuestion',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: 'Finesse: precision and aerial maneuverability.',
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
                    text: 'cunning is the opposite of honorable; only modified by %+ or %-',
                    type: 'COMMENT',
                  },
                  {
                    text: 'Do you have more Cunning or Honor?',
                    type: 'TEXT',
                  },
                ],
                label: 'CunningQuestion',
                link: {
                  block: [
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'cunning %+70',
                              type: 'SET',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'DisdainQuestion',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: 'Cunning: intelligence and trickery.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'cunning %-70',
                              type: 'SET',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'DisdainQuestion',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: 'Honor: honesty and trustworthiness.',
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
                    text: 'disdain is the opposite of vigilant; only modify by %+ or %-',
                    type: 'COMMENT',
                  },
                  {
                    text: 'Do you disdain threats and insults that are beneath you, or are you vigilant\nagainst any slight or transgression?',
                    type: 'TEXT',
                  },
                ],
                label: 'DisdainQuestion',
                link: {
                  block: [
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'disdain %+70',
                              type: 'SET',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'FirstChoice',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: 'Disdain: patience and scorn.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'disdain %-70',
                              type: 'SET',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'FirstChoice',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: 'Vigilance: attention and impulsiveness.',
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
                    text: 'Now we face some real choices to finish chargen and establish setting',
                    type: 'COMMENT',
                  },
                  {
                    text: 'First choice trades off cunning vs. brutality',
                    type: 'COMMENT',
                  },
                  {
                    text: 'Now we\'re going to view some flashbacks to your days as a wyrmling.\n\nAs a young hatchling, you lived with your mother in a cave high up on a mountain.  Your mother had a vast hoard of treasure and a varied hunting range. Some of your siblings chose to spend much of their time reading the rare codices and scrolls your mother had collected.  Other siblings spent their time hunting dangerous game and brawling with each other.  Which pursuit did you prefer?\n',
                    type: 'TEXT',
                  },
                ],
                label: 'FirstChoice',
                link: {
                  block: [
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'A wise choice that made you more Cunning and taught you Finesse.',
                              type: 'TEXT',
                            },
                            {
                              text: 'cunning %+20',
                              type: 'SET',
                            },
                            {
                              text: 'brutality %-20',
                              type: 'SET',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'SecondChoice',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: 'Reading.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'You developed your muscles as you gloried in combat and the kill at\nthe end of the hunt.  Your brawls with your siblings also taught you the\nbasics of Honor. \n\nBrutality and Honor increase.',
                              type: 'TEXT',
                            },
                            {
                              text: 'cunning %-20',
                              type: 'SET',
                            },
                            {
                              text: 'brutality %+20',
                              type: 'SET',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'SecondChoice',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: 'Hunting.',
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
                    text: 'Second choice trades off cunning vs. disdain',
                    type: 'COMMENT',
                  },
                  {
                    text: 'As you reached maturity, you began to threaten your mother\'s dominance over her territory.  Before you could possibly have bested her in a direct confrontation, she threw you out of her lair and drove you from the lands in which you grew up, leaving you to fend for yourself without any resources beyond your claws, wings, and teeth. \n\nDid you seek revenge on her by turning some of the humans in her lands against her, or did you consider petty revenge beneath you?\n',
                    type: 'TEXT',
                  },
                ],
                label: 'SecondChoice',
                link: {
                  block: [
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'You were unable to truly threaten her, but you forced your mother to\nspend her time suppressing the revolts of human villages.  The dead    \nvillagers also provided her with no tribute, reducing the increase of her\nhoard.  Perhaps something more direct would be better as revenge. Still, a real\ngain nonetheless. \n\nCunning and Vigilance increase.',
                              type: 'TEXT',
                            },
                            {
                              text: 'cunning %+20',
                              type: 'SET',
                            },
                            {
                              text: 'disdain %-20',
                              type: 'SET',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'ThirdChoice',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: 'I sought revenge.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'Disdain for petty matters is essential for a dragon, as it avoids the\npointless feuds that weaken you and allow your enemies to achieve great\ngoals. \n\nManipulating peasants is also not the most honorable of activities for a    \nmighty dragon such as yourself. \n\nYour wise choice increases Disdain and Honor.',
                              type: 'TEXT',
                            },
                            {
                              text: 'cunning %-20',
                              type: 'SET',
                            },
                            {
                              text: 'disdain %+20',
                              type: 'SET',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'ThirdChoice',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: 'Revenge is beneath my dignity.',
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
                    text: 'Trades off Disdain versus Brutality',
                    type: 'COMMENT',
                  },
                  {
                    text: 'After several days of flight, you came across a tiny halfling travelling through the desert.  Even from afar, your keen eyes detected the glint of gold and the sparkle of magic.  This halfling has some sort of magic golden shield strapped to his tiny back.\n\nYou knew immediately that this treasure must be yours.\n\nThe halfling was far from civilization and would almost surely die soon of thirst and starvation.  For the moment, he seemed to be protected by the power of the shield.\n\nDid you kill him on the spot, ignoring his magical protections, or did you hover nearby and wait for the halfling to die, knowing that you might lose the treasure?\n',
                    type: 'TEXT',
                  },
                ],
                label: 'ThirdChoice',
                link: {
                  block: [
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'There\'s no reason you have to do all the dirty work yourself.  A few hours later, the halfling stumbled, crawled for a while, and finally stopped.  You easily plucked the treasure off of his body, saving yourself quite a bit of work.\n\nDisdain and Finesse increase.',
                              type: 'TEXT',
                            },
                            {
                              text: 'brutality %-20',
                              type: 'SET',
                            },
                            {
                              text: 'disdain %+20',
                              type: 'SET',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'Axilmeus',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: 'I waited for him to die.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'It wasn\'t easy; the shield protected him from fire and helped him evade your attacks.  Eventually you had to swallow him whole and cough up the shield.  That worked!\n\nBrutality and Vigilance increase.',
                              type: 'TEXT',
                            },
                            {
                              text: 'brutality %+20',
                              type: 'SET',
                            },
                            {
                              text: 'disdain %-20',
                              type: 'SET',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'Axilmeus',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: 'I killed him on the spot.',
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
                    text: '',
                    type: 'PAGE_BREAK',
                  },
                  {
                    text: 'One of your elder clutchmates was an overbearing brute named Axilmeus.  Axilmeus loved to torment the others, always seeking to seize what did not belong to him.\n\n"${name}," he said with a menacing grin, "give me that golden shield, or I will beat you within an inch of your life."\n',
                    type: 'TEXT',
                  },
                ],
                label: 'Axilmeus',
                link: {
                  block: [
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'disdain %+ 15',
                              type: 'SET',
                            },
                            {
                              text: 'Disdain increases.\n\nAxilmeus took your shield and beat you with it, hard.',
                              type: 'TEXT',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'ResolveAxilmeus',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: ' I gave him the shield to avoid a fight.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'brutality %+ 15',
                              type: 'SET',
                            },
                            {
                              text: 'cunning %- 15',
                              type: 'SET',
                            },
                            {
                              text: 'Brutality and Honor increase.\n\nYou fought your hardest, but Axilmeus was a bit stronger than you; he pinned you to the ground and pried the shield out of your claws.',
                              type: 'TEXT',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'ResolveAxilmeus',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: ' I dueled him for the shield.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      block: [
                        {
                          components: [
                            {
                              text: 'brutality %- 15',
                              type: 'SET',
                            },
                            {
                              text: 'cunning %+ 15',
                              type: 'SET',
                            },
                            {
                              text: 'Cunning and Finesse increase.\n\nUnfortunately, Axilmeus is your elder; at this age, he has the advantage in maneuverability.  He caught up to you quickly, pinning you to the ground and prying the shield out of your claws.',
                              type: 'TEXT',
                            },
                          ],
                          label: '',
                          link: {
                            text: 'ResolveAxilmeus',
                            type: 'GOTO',
                          },
                          type: 'NODE',
                        },
                      ],
                      condition: null,
                      reuse: null,
                      text: ' I evaded him and hid the shield.',
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
                    text: 'Then he crushed the shield in his jaws, wasting the magical energies imbued within it, and spat it out at your feet.  He laughed with a great roar as he flew away.\n',
                    type: 'TEXT',
                  },
                ],
                label: 'ResolveAxilmeus',
                link: {
                  node: {
                    components: [
                      {
                        text: '[We need to generate a starting Wealth somehow.  My current thought is',
                        type: 'COMMENT',
                      },
                      {
                        text: 'that we use a random number increased up by low Brutality, low Disdain,',
                        type: 'COMMENT',
                      },
                      {
                        text: 'and high Cunning. ',
                        type: 'COMMENT',
                      },
                      {
                        text: 'But we could also tie it more specifically to the choices, or just go',
                        type: 'COMMENT',
                      },
                      {
                        text: 'random, or whatever.]',
                        type: 'COMMENT',
                      },
                      {
                        text: '',
                        type: 'PAGE_BREAK',
                      },
                      {
                        text: 'You have the following stats:\n',
                        type: 'TEXT',
                      },
                      {
                        stats: [
                          {
                            name: 'Brutality',
                            opposed: 'Finesse',
                            stat: 'Brutality',
                            type: 'STAT_OPPOSED',
                          },
                          {
                            name: 'Cunning',
                            opposed: 'Honor',
                            stat: 'Cunning',
                            type: 'STAT_OPPOSED',
                          },
                          {
                            name: 'Disdain',
                            opposed: 'Vigilance',
                            stat: 'Disdain',
                            type: 'STAT_OPPOSED',
                          },
                          {
                            text: 'Infamy',
                            type: 'STAT_PERCENT',
                          },
                          {
                            text: 'wealth_text Wealth',
                            type: 'STAT_TEXT',
                          },
                        ],
                        type: 'STAT_CHART',
                      },
                      {
                        text: '',
                        type: 'TEXT',
                      },
                    ],
                    label: 'Wrapup',
                    link: {
                      text: 'Begin the Adventure',
                      type: 'FINISH',
                    },
                    type: 'NODE',
                  },
                  type: 'NODE_LINK',
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
      symbols: [
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
          text: 'Callax_With false',
          type: 'CREATE',
        },
        {
          scene: 'startup',
          text: 'royal',
          type: 'TEMP',
        },
        {
          scene: 'startup',
          text: 'royal_him',
          type: 'TEMP',
        },
        {
          scene: 'startup',
          text: 'royal_his',
          type: 'TEMP',
        },
        {
          scene: 'startup',
          text: 'royal_she',
          type: 'TEMP',
        },
        {
          scene: 'startup',
          text: 'royals',
          type: 'TEMP',
        },
        {
          scene: 'startup',
          text: 'color',
          type: 'TEMP',
        },
        {
          scene: 'startup',
          text: 'head',
          type: 'TEMP',
        },
        {
          scene: 'startup',
          text: 'wings',
          type: 'TEMP',
        },
        {
          scene: 'startup',
          text: 'wealth_text "${wealth} gold coins"',
          type: 'TEMP',
        },
      ],
    };

    const result = parse(cs);
    const filtered = removeKeys(false, 'scene', 'error', 'tokens', 'indent')(removeKeys(true, 'id')({ ...result }));

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
