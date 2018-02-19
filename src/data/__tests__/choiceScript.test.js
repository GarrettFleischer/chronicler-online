import { flattenScenes, parse } from '../choiceScript';
import { removeKeys } from '../utilities';
import { makeScene } from '../datatypes';
import { dragonCS } from './dragon';


describe('ChoiceScript parser', () => {
  it('handles non-nested code', () => {
    const cs = '*create joy 0\n*create fun 0\n\nHello world\n\nAnd all who inhabit it!\n\n*set joy 23\n*goto fun\n\n*label fun\n*set fun %+ 10\n*finish';
    const expected = {
      object: [
        {
          components: [
            {
              text: 'Hello world\n\nAnd all who inhabit it!\n',
              type: 'TEXT',
            },
            {
              isVariable: false,
              op: '',
              type: 'SET',
              value: '23',
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
              isVariable: false,
              op: '%+',
              type: 'SET',
              value: '10',
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
      symbols: [
        {
          name: 'joy',
          type: 'CREATE',
          value: '0',
        },
        {
          name: 'fun',
          type: 'CREATE',
          value: '0',
        },
      ],
    };

    // remove id from nested objects, then error and tokens from top object
    const result = parse(cs);
    const filtered = removeKeys(false, 'scene', 'error', 'tokens', 'indent')(removeKeys(true, 'id', 'variableId')({ ...result }));

    expect(filtered).toEqual(expected);
  });

  it('handles nested choices', () => {
    const cs = '*create happy false\n\nHello World!\n\n*choice\n  *hide_reuse #And all who inhabit it!\n    My, you\'re cheerful\n    *goto cheerful\n\n  *disable_reuse *if (true) #I hate Mondays...\n    Indeed\n    *label hate\n    *set happy false\n    *finish\n\n*label cheerful\n*set happy true\n*finish';
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
                components: [
                  {
                    text: "My, you're cheerful",
                    type: 'TEXT',
                  },
                ],
                condition: null,
                link: {
                  text: 'cheerful',
                  type: 'GOTO',
                },
                reuse: 'HIDE_REUSE',
                text: 'And all who inhabit it!',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    text: 'Indeed',
                    type: 'TEXT',
                  },
                ],
                condition: {
                  condition: '(true)',
                  type: 'IF',
                },
                link: {
                  node: {
                    components: [
                      {
                        isVariable: false,
                        op: '',
                        type: 'SET',
                        value: 'false',
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
              isVariable: false,
              op: '',
              type: 'SET',
              value: 'true',
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
      symbols: [
        {
          name: 'happy',
          type: 'CREATE',
          value: 'false',
        },
      ],
    };

    const result = parse(cs);
    const filtered = removeKeys(false, 'scene', 'error', 'tokens', 'indent')(removeKeys(true, 'id', 'variableId')({ ...result }));

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
            components: [
              {
                text: 'do something',
                type: 'TEXT',
              },
            ],
            condition: '(happy)',
            elses: [
              {
                components: [
                  {
                    text: 'do something else',
                    type: 'TEXT',
                  },
                ],
                condition: '(cool)',
                link: {
                  text: 'blarg',
                  type: 'GOTO',
                },
                type: 'ELSEIF',
              },
              {
                components: [
                  {
                    text: 'its another',
                    type: 'TEXT',
                  },
                ],
                condition: '(other)',
                link: {
                  text: '',
                  type: 'FINISH',
                },
                type: 'ELSEIF',
              },
              {
                components: [
                  {
                    text: 'a thing',
                    type: 'TEXT',
                  },
                ],
                link: {
                  text: '',
                  type: 'FINISH',
                },
                type: 'ELSE',
              },
            ],
            link: {
              text: 'blarg',
              type: 'GOTO',
            },
            type: 'IF',
          },
          type: 'NODE',
        },
        {
          components: [],
          label: 'blarg',
          link: {
            components: [],
            condition: 'not (happy)',
            elses: [
              {
                components: [
                  {
                    text: 'do other things',
                    type: 'TEXT',
                  },
                ],
                condition: 'not (cool)',
                link: {
                  text: 'foo',
                  type: 'GOTO',
                },
                type: 'ELSEIF',
              },
            ],
            link: {
              components: [
                {
                  text: 'you are ugly',
                  type: 'TEXT',
                },
              ],
              condition: '(ugly)',
              elses: [],
              link: {
                text: '',
                type: 'FINISH',
              },
              type: 'IF',
            },
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
              text: "Let us begin.\n\nA knight charges up the slope at you.  His horse pounds at the ground, carrying the heavily armored warrior as if he were a child's doll.  The knight sets his lance to attack you.\n\nHow do you defend yourself, O mighty dragon?",
              type: 'TEXT',
            },
          ],
          label: '',
          link: {
            block: [
              {
                components: [
                  {
                    text: "You leap to the air, deftly avoiding the knight's thrust.  Now that you are in the air, he hardly poses any threat at allâ€”not that he ever posed much of one to you.  You circle back and knock him off his horse with a swipe of your claw.\n",
                    type: 'TEXT',
                  },
                  {
                    isVariable: false,
                    op: '%-',
                    type: 'SET',
                    value: '10',
                  },
                ],
                condition: null,
                link: {
                  text: 'Victory',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'I take to the air with a quick beat of my wings.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    text: "You swing your mighty tail around and knock the knight flying.  While he struggles to stand, you break his horse's back and begin devouring it.\n",
                    type: 'TEXT',
                  },
                  {
                    isVariable: false,
                    op: '%+',
                    type: 'SET',
                    value: '10',
                  },
                ],
                condition: null,
                link: {
                  text: 'Victory',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'I knock the knight from his horse with a slap of my tail.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    text: "The knight's lance shatters against your nigh-impenetrable hide as you slam into him.  You yank him clean off his horse, slamming him to the ground and ripping his plate armor with your vicious claws.  The fight is over before it has begun. \n",
                    type: 'TEXT',
                  },
                  {
                    isVariable: false,
                    op: '%+',
                    type: 'SET',
                    value: '10',
                  },
                ],
                condition: null,
                link: {
                  text: 'Victory',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'I rush into his charge and tear him to pieces with my claws.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    text: "You let loose an inferno of fire.  The knight's horse is cooked nicely, and your stomach lets out a deafening rumble as the smell of roast destrier reaches your nostrils.  The knight himself staggers to his feet.  His armor managed to keep him alive, but only barely.\n",
                    type: 'TEXT',
                  },
                  {
                    isVariable: false,
                    op: '%+',
                    type: 'SET',
                    value: '10',
                  },
                ],
                condition: null,
                link: {
                  text: 'Victory',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'A puff of my fiery breath should be enough for him.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    text: '*restore_game',
                    type: 'TEXT',
                  },
                ],
                condition: {
                  condition: '(choice_save_allowed)',
                  type: 'IF',
                },
                link: {
                  text: 'purchased',
                  type: 'GOTO',
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
                components: [
                  {
                    text: 'Your jaws crush him in a single bite.\n\nThat showed him.',
                    type: 'TEXT',
                  },
                  {
                    isVariable: false,
                    op: '%+',
                    type: 'SET',
                    value: '10',
                  },
                ],
                condition: null,
                link: {
                  text: 'Naming',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'Of course!  How dare he attack me?',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    text: '"Begone, petty human.  To attack me is to meet your doom," you growl.\n\nThe knight stumbles away as quickly as he can, not even daring to pretend that he could still fight you.',
                    type: 'TEXT',
                  },
                  {
                    isVariable: false,
                    op: '%+',
                    type: 'SET',
                    value: '15',
                  },
                ],
                condition: null,
                link: {
                  text: 'Naming',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'I let him live to warn others of my immense power.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    text: "You leisurely eat the knight's horse.  He slinks away as quietly as he can.  (His heavy armor makes a stealthy escape impossible.)  Still, you pay him no mind as he leaves.\n",
                    type: 'TEXT',
                  },
                  {
                    isVariable: false,
                    op: '%+',
                    type: 'SET',
                    value: '10',
                  },
                  {
                    isVariable: false,
                    op: '%+',
                    type: 'SET',
                    value: '10',
                  },
                ],
                condition: null,
                link: {
                  text: 'Naming',
                  type: 'GOTO',
                },
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
              text: "You know, it's going to get annoying to keep calling you \"great and mighty dragon.\"  What is your name?",
              type: 'TEXT',
            },
          ],
          label: 'Naming',
          link: {
            block: [
              {
                components: [
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"Gorthalon"',
                  },
                ],
                condition: null,
                link: {
                  text: 'gender',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'Gorthalon.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"Sssetheliss"',
                  },
                ],
                condition: null,
                link: {
                  text: 'gender',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'Sssetheliss.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"Calemvir"',
                  },
                ],
                condition: null,
                link: {
                  text: 'gender',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'Calemvir.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    text: 'Oh! Please forgive me.',
                    type: 'TEXT',
                  },
                ],
                condition: null,
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
                      components: [
                        {
                          text: 'Your name is $!{name}, is that right?\n',
                          type: 'TEXT',
                        },
                      ],
                      condition: '("${name}" != "$!{name}")',
                      elses: [],
                      link: {
                        block: [
                          {
                            components: [
                              {
                                isVariable: false,
                                op: '',
                                type: 'SET',
                                value: '"$!{name}"',
                              },
                            ],
                            condition: null,
                            link: {
                              text: 'gender',
                              type: 'GOTO',
                            },
                            reuse: null,
                            text: 'Yes.',
                            type: 'CHOICE_ITEM',
                          },
                          {
                            components: [],
                            condition: null,
                            link: {
                              text: 'gender',
                              type: 'GOTO',
                            },
                            reuse: null,
                            text: 'No, my name is ${name}, just as I said.',
                            type: 'CHOICE_ITEM',
                          },
                          {
                            components: [],
                            condition: null,
                            link: {
                              text: 'input_name',
                              type: 'GOTO',
                            },
                            reuse: null,
                            text: 'Er, wait, let me try that again.',
                            type: 'CHOICE_ITEM',
                          },
                        ],
                        type: 'CHOICE',
                      },
                      type: 'IF',
                    },
                    type: 'NODE',
                  },
                  type: 'NODE_LINK',
                },
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
                components: [
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"male"',
                  },
                ],
                condition: null,
                link: {
                  text: 'Princess',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'Male.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"female"',
                  },
                ],
                condition: null,
                link: {
                  text: 'Princess',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'Female.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"neither"',
                  },
                ],
                condition: null,
                link: {
                  text: 'Princess',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'Neither.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"unknown"',
                  },
                ],
                condition: null,
                link: {
                  text: 'Princess',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'Unknown/undetermined.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    isVariable: false,
                    op: '%+',
                    type: 'SET',
                    value: '15',
                  },
                  {
                    text: "I, ah, I mean, yes!  Of course!  How churlish of me.\n\nBut, O mighty ${name}, I feel I should let you know that this game is full of choices; indeed, it is nothing but multiple choice questions that determine the course of your adventures as a dragon.  If you don't enjoy answering questions, this game may not be for you!\n\nDo youâ€¦I mean, if I may, would you like to specify your gender after all?\n",
                    type: 'TEXT',
                  },
                ],
                condition: null,
                link: {
                  block: [
                    {
                      components: [
                        {
                          text: 'Excellent choice!  What gender will you be?\n',
                          type: 'TEXT',
                        },
                      ],
                      condition: null,
                      link: {
                        block: [
                          {
                            components: [
                              {
                                isVariable: false,
                                op: '',
                                type: 'SET',
                                value: '"male"',
                              },
                            ],
                            condition: null,
                            link: {
                              text: 'Princess',
                              type: 'GOTO',
                            },
                            reuse: null,
                            text: 'Male.',
                            type: 'CHOICE_ITEM',
                          },
                          {
                            components: [
                              {
                                isVariable: false,
                                op: '',
                                type: 'SET',
                                value: '"female"',
                              },
                            ],
                            condition: null,
                            link: {
                              text: 'Princess',
                              type: 'GOTO',
                            },
                            reuse: null,
                            text: 'Female.',
                            type: 'CHOICE_ITEM',
                          },
                          {
                            components: [
                              {
                                isVariable: false,
                                op: '',
                                type: 'SET',
                                value: '"neither"',
                              },
                            ],
                            condition: null,
                            link: {
                              text: 'Princess',
                              type: 'GOTO',
                            },
                            reuse: null,
                            text: 'Neither.',
                            type: 'CHOICE_ITEM',
                          },
                          {
                            components: [
                              {
                                isVariable: false,
                                op: '',
                                type: 'SET',
                                value: '"unknown"',
                              },
                            ],
                            condition: null,
                            link: {
                              text: 'Princess',
                              type: 'GOTO',
                            },
                            reuse: null,
                            text: 'Unknown/undetermined.',
                            type: 'CHOICE_ITEM',
                          },
                        ],
                        type: 'CHOICE',
                      },
                      reuse: null,
                      text: 'Very well.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      components: [
                        {
                          isVariable: false,
                          op: '',
                          type: 'SET',
                          value: '"unknown"',
                        },
                        {
                          text: "\nWell, let's just leave it undetermined, then!",
                          type: 'TEXT',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'Princess',
                        type: 'GOTO',
                      },
                      reuse: null,
                      text: 'I said no.',
                      type: 'CHOICE_ITEM',
                    },
                  ],
                  type: 'CHOICE',
                },
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
              text: "As you think about it, the knight's attack was probably inevitable.  After all, you did just kidnap the princess from right out of her tower.  Althoughâ€¦\n\nIsn't it a little sexist to always kidnap princesses?",
              type: 'TEXT',
            },
          ],
          label: 'Princess',
          link: {
            block: [
              {
                components: [
                  {
                    text: "I guess you're right.\n\nAnyway, as you ripped the roof off her tower, the light glistened off yourâ€¦",
                    type: 'TEXT',
                  },
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"princess"',
                  },
                ],
                condition: null,
                link: {
                  text: 'color',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'Maybe, but tradition demands that dragons kidnap princesses, even if that is sexist.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    text: "No, no!  Of course not.  I just wanted toâ€”I meanâ€”What I'm trying to say isâ€¦\n\nLet's just move on.\n\nAnyway, as you ripped the roof off her tower, the light glistened off yourâ€¦",
                    type: 'TEXT',
                  },
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"princess"',
                  },
                ],
                condition: null,
                link: {
                  text: 'color',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'You dare question my actions?',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    text: "Right you are.  As I was saying, the knight's attack was probably inevitable.  After all, you did just kidnap the prince \nfrom right out of his tower.  As you ripped the roof off his tower, the light glistened off yourâ€¦",
                    type: 'TEXT',
                  },
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"prince"',
                  },
                ],
                condition: null,
                link: {
                  text: 'color',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'You know, I never thought about that before.  In fact, I think I kidnapped a prince, just to avoid being sexist.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    text: "Of course.  I'm sorry for questioning you.\n\nAnyway, as you ripped the roof off her tower, the light glistened off yourâ€¦",
                    type: 'TEXT',
                  },
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"princess"',
                  },
                ],
                condition: null,
                link: {
                  text: 'color',
                  type: 'GOTO',
                },
                reuse: null,
                text: "I'll have you know that I make a careful point of alternating between princes and princesses, but it happened to be time for a princess.",
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
            components: [
              {
                isVariable: false,
                op: '',
                type: 'SET',
                value: '"her"',
              },
              {
                isVariable: false,
                op: '',
                type: 'SET',
                value: '"her"',
              },
              {
                isVariable: false,
                op: '',
                type: 'SET',
                value: '"she"',
              },
              {
                isVariable: false,
                op: '',
                type: 'SET',
                value: '"princesses"',
              },
            ],
            condition: '(royal="princess")',
            elses: [
              {
                components: [
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"him"',
                  },
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"his"',
                  },
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"he"',
                  },
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"princes"',
                  },
                ],
                link: {
                  text: 'A',
                  type: 'GOTO',
                },
                type: 'ELSE',
              },
            ],
            link: {
              text: 'A',
              type: 'GOTO',
            },
            type: 'IF',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              text: "Ah, would you like to specify the color of your hide?  I wasn't sure which color to put in that description.\n",
              type: 'TEXT',
            },
          ],
          label: 'A',
          link: {
            block: [
              {
                components: [
                  {
                    isVariable: false,
                    op: '%+',
                    type: 'SET',
                    value: '30',
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
                condition: null,
                link: {
                  text: 'RoyalResolution',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'Can we just get on to the smashing?',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"black"',
                  },
                ],
                condition: null,
                link: {
                  text: 'limbs',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'Black.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"blue"',
                  },
                ],
                condition: null,
                link: {
                  text: 'limbs',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'Blue.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"brown"',
                  },
                ],
                condition: null,
                link: {
                  text: 'limbs',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'Brown.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"golden"',
                  },
                ],
                condition: null,
                link: {
                  text: 'limbs',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'Gold.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"green"',
                  },
                ],
                condition: null,
                link: {
                  text: 'limbs',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'Green.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"iridescent"',
                  },
                ],
                condition: null,
                link: {
                  text: 'limbs',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'Iridescent.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"red"',
                  },
                ],
                condition: null,
                link: {
                  text: 'limbs',
                  type: 'GOTO',
                },
                reuse: null,
                text: 'Red.',
                type: 'CHOICE_ITEM',
              },
              {
                components: [
                  {
                    isVariable: false,
                    op: '',
                    type: 'SET',
                    value: '"white"',
                  },
                ],
                condition: null,
                link: {
                  text: 'limbs',
                  type: 'GOTO',
                },
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
              text: "Wonderful choice.  So the light glistened off your ${color} hide, as you snatched the ${royal} out of ${royal_his} tower.\n\nWhile we're on the subject, let's settle a few other details.  How many limbs will you have, not counting your wings or tail?\n",
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
                      components: [
                        {
                          isVariable: false,
                          op: '',
                          type: 'SET',
                          value: '"ridged"',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'wings',
                        type: 'GOTO',
                      },
                      reuse: null,
                      text: 'Ridged.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      components: [
                        {
                          isVariable: false,
                          op: '',
                          type: 'SET',
                          value: '"smooth"',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'wings',
                        type: 'GOTO',
                      },
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
                      components: [
                        {
                          isVariable: false,
                          op: '',
                          type: 'SET',
                          value: '"feathery"',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'Summary',
                        type: 'GOTO',
                      },
                      reuse: null,
                      text: 'Feathery.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      components: [
                        {
                          isVariable: false,
                          op: '',
                          type: 'SET',
                          value: '"leathery"',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'Summary',
                        type: 'GOTO',
                      },
                      reuse: null,
                      text: 'Leathery.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      components: [
                        {
                          isVariable: false,
                          op: '',
                          type: 'SET',
                          value: '"scaly"',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'Summary',
                        type: 'GOTO',
                      },
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
                          components: [
                            {
                              text: 'Life can be lonely as a dragon, and interesting conversation is at a premium.  The elite upbringing of royalty makes them more suitable for entertaining dragons.\n\nBut what do you do after you tire of ${royal_his} conversation?',
                              type: 'TEXT',
                            },
                          ],
                          condition: null,
                          link: {
                            block: [
                              {
                                components: [
                                  {
                                    text: "The ${royal}'s efforts to entertain you with ${royal_his} stories, harp-playing, and singing become more desperate as your boredom becomes more apparent.  But even ${royal_his} best efforts are not enough, and you devour ${royal_him} without remorse.\n",
                                    type: 'TEXT',
                                  },
                                  {
                                    isVariable: false,
                                    op: '%+',
                                    type: 'SET',
                                    value: '10',
                                  },
                                  {
                                    isVariable: false,
                                    op: '%+',
                                    type: 'SET',
                                    value: '10',
                                  },
                                  {
                                    isVariable: false,
                                    op: '%+',
                                    type: 'SET',
                                    value: '10',
                                  },
                                ],
                                condition: null,
                                link: {
                                  text: 'personality',
                                  type: 'GOTO',
                                },
                                reuse: null,
                                text: "Then it's time for a royal feastâ€”by which I mean I eat ${royal_him}.",
                                type: 'CHOICE_ITEM',
                              },
                              {
                                components: [
                                  {
                                    text: "The ${royal} becomes gradually more fearful as ${royal_his} stories, harp-playing, and singing amuse you less each passing day.  One evening, as you pretend to sleep, ${royal_she} makes a break for it.  You are well aware of ${royal_his} departure and could catch ${royal_him} easily, but you let ${royal_him} go.  $!{Royal_She} made several months more interesting, and that's\nworth sparing ${royal_his} life.",
                                    type: 'TEXT',
                                  },
                                  {
                                    isVariable: false,
                                    op: '%-',
                                    type: 'SET',
                                    value: '10',
                                  },
                                  {
                                    isVariable: false,
                                    op: '%-',
                                    type: 'SET',
                                    value: '10',
                                  },
                                  {
                                    isVariable: false,
                                    op: '%-',
                                    type: 'SET',
                                    value: '10',
                                  },
                                ],
                                condition: null,
                                link: {
                                  text: 'personality',
                                  type: 'GOTO',
                                },
                                reuse: null,
                                text: 'I let ${royal_him} slip away, pretending not to notice ${royal_his} escape plan.',
                                type: 'CHOICE_ITEM',
                              },
                            ],
                            type: 'CHOICE',
                          },
                          reuse: null,
                          text: "It's all about companionship and good conversation.",
                          type: 'CHOICE_ITEM',
                        },
                        {
                          components: [],
                          condition: null,
                          link: {
                            text: 'EatHer',
                            type: 'GOTO',
                          },
                          reuse: null,
                          text: "I'll keep ${royal_him} around for a little while to lure in more knights, but then ${royal_she}'s dinner.  It's a little known fact that ${royals} taste better than most humans.",
                          type: 'CHOICE_ITEM',
                        },
                        {
                          components: [
                            {
                              text: "Indeed.  Within a month, a large chest of gold comes to pay for the ${royal}'s release.",
                              type: 'TEXT',
                            },
                            {
                              isVariable: false,
                              op: '+',
                              type: 'SET',
                              value: '1500',
                            },
                            {
                              text: '\nWhat do you do then?',
                              type: 'TEXT',
                            },
                          ],
                          condition: null,
                          link: {
                            block: [
                              {
                                components: [
                                  {
                                    text: 'Of course.  No sooner have you received the payment than you let the ${royal} go.',
                                    type: 'TEXT',
                                  },
                                  {
                                    isVariable: false,
                                    op: '%-',
                                    type: 'SET',
                                    value: '20',
                                  },
                                  {
                                    isVariable: false,
                                    op: '%-',
                                    type: 'SET',
                                    value: '10',
                                  },
                                  {
                                    isVariable: false,
                                    op: '%-',
                                    type: 'SET',
                                    value: '10',
                                  },
                                ],
                                condition: null,
                                link: {
                                  text: 'personality',
                                  type: 'GOTO',
                                },
                                reuse: null,
                                text: 'Honor demands that I carry out my end of the bargain.',
                                type: 'CHOICE_ITEM',
                              },
                              {
                                components: [
                                  {
                                    text: 'Crunch, munch.  Delicious.\n',
                                    type: 'TEXT',
                                  },
                                  {
                                    isVariable: false,
                                    op: '%+',
                                    type: 'SET',
                                    value: '20',
                                  },
                                  {
                                    isVariable: false,
                                    op: '%+',
                                    type: 'SET',
                                    value: '10',
                                  },
                                  {
                                    isVariable: false,
                                    op: '%+',
                                    type: 'SET',
                                    value: '10',
                                  },
                                ],
                                condition: null,
                                link: {
                                  text: 'personality',
                                  type: 'GOTO',
                                },
                                reuse: null,
                                text: 'Once I have the payment, I have no reason to delay my dinner.',
                                type: 'CHOICE_ITEM',
                              },
                            ],
                            type: 'CHOICE',
                          },
                          reuse: null,
                          text: "It's all about the ransom payments.  Those are a quick and easy way to build a hoard.",
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
                    isVariable: false,
                    op: '%+',
                    type: 'SET',
                    value: '10',
                  },
                  {
                    isVariable: false,
                    op: '%+',
                    type: 'SET',
                    value: '10',
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
                    text: 'brutality is the opposite of finesse; only modify by %+  or %- ',
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
                      components: [
                        {
                          isVariable: false,
                          op: '%+',
                          type: 'SET',
                          value: '70',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'CunningQuestion',
                        type: 'GOTO',
                      },
                      reuse: null,
                      text: 'Brutality: strength and cruelty.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      components: [
                        {
                          isVariable: false,
                          op: '%-',
                          type: 'SET',
                          value: '70',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'CunningQuestion',
                        type: 'GOTO',
                      },
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
                    text: 'cunning is the opposite of honorable; only modified by %+  or %- ',
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
                      components: [
                        {
                          isVariable: false,
                          op: '%+',
                          type: 'SET',
                          value: '70',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'DisdainQuestion',
                        type: 'GOTO',
                      },
                      reuse: null,
                      text: 'Cunning: intelligence and trickery.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      components: [
                        {
                          isVariable: false,
                          op: '%-',
                          type: 'SET',
                          value: '70',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'DisdainQuestion',
                        type: 'GOTO',
                      },
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
                    text: 'disdain is the opposite of vigilant; only modify by %+  or %-',
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
                      components: [
                        {
                          isVariable: false,
                          op: '%+',
                          type: 'SET',
                          value: '70',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'FirstChoice',
                        type: 'GOTO',
                      },
                      reuse: null,
                      text: 'Disdain: patience and scorn.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      components: [
                        {
                          isVariable: false,
                          op: '%-',
                          type: 'SET',
                          value: '70',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'FirstChoice',
                        type: 'GOTO',
                      },
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
                    text: "Now we're going to view some flashbacks to your days as a wyrmling.\n\nAs a young hatchling, you lived with your mother in a cave high up on a mountain.  Your mother had a vast hoard of treasure and a varied hunting range. Some of your siblings chose to spend much of their time reading the rare codices and scrolls your mother had collected.  Other siblings spent their time hunting dangerous game and brawling with each other.  Which pursuit did you prefer?\n",
                    type: 'TEXT',
                  },
                ],
                label: 'FirstChoice',
                link: {
                  block: [
                    {
                      components: [
                        {
                          text: 'A wise choice that made you more Cunning and taught you Finesse.',
                          type: 'TEXT',
                        },
                        {
                          isVariable: false,
                          op: '%+',
                          type: 'SET',
                          value: '20',
                        },
                        {
                          isVariable: false,
                          op: '%-',
                          type: 'SET',
                          value: '20',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'SecondChoice',
                        type: 'GOTO',
                      },
                      reuse: null,
                      text: 'Reading.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      components: [
                        {
                          text: 'You developed your muscles as you gloried in combat and the kill at\nthe end of the hunt.  Your brawls with your siblings also taught you the\nbasics of Honor. \n\nBrutality and Honor increase.',
                          type: 'TEXT',
                        },
                        {
                          isVariable: false,
                          op: '%-',
                          type: 'SET',
                          value: '20',
                        },
                        {
                          isVariable: false,
                          op: '%+',
                          type: 'SET',
                          value: '20',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'SecondChoice',
                        type: 'GOTO',
                      },
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
                    text: "As you reached maturity, you began to threaten your mother's dominance over her territory.  Before you could possibly have bested her in a direct confrontation, she threw you out of her lair and drove you from the lands in which you grew up, leaving you to fend for yourself without any resources beyond your claws, wings, and teeth. \n\nDid you seek revenge on her by turning some of the humans in her lands against her, or did you consider petty revenge beneath you?\n",
                    type: 'TEXT',
                  },
                ],
                label: 'SecondChoice',
                link: {
                  block: [
                    {
                      components: [
                        {
                          text: 'You were unable to truly threaten her, but you forced your mother to\nspend her time suppressing the revolts of human villages.  The dead    \nvillagers also provided her with no tribute, reducing the increase of her\nhoard.  Perhaps something more direct would be better as revenge. Still, a real\ngain nonetheless. \n\nCunning and Vigilance increase.',
                          type: 'TEXT',
                        },
                        {
                          isVariable: false,
                          op: '%+',
                          type: 'SET',
                          value: '20',
                        },
                        {
                          isVariable: false,
                          op: '%-',
                          type: 'SET',
                          value: '20',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'ThirdChoice',
                        type: 'GOTO',
                      },
                      reuse: null,
                      text: 'I sought revenge.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      components: [
                        {
                          text: 'Disdain for petty matters is essential for a dragon, as it avoids the\npointless feuds that weaken you and allow your enemies to achieve great\ngoals. \n\nManipulating peasants is also not the most honorable of activities for a    \nmighty dragon such as yourself. \n\nYour wise choice increases Disdain and Honor.',
                          type: 'TEXT',
                        },
                        {
                          isVariable: false,
                          op: '%-',
                          type: 'SET',
                          value: '20',
                        },
                        {
                          isVariable: false,
                          op: '%+',
                          type: 'SET',
                          value: '20',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'ThirdChoice',
                        type: 'GOTO',
                      },
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
                      components: [
                        {
                          text: "There's no reason you have to do all the dirty work yourself.  A few hours later, the halfling stumbled, crawled for a while, and finally stopped.  You easily plucked the treasure off of his body, saving yourself quite a bit of work.\n\nDisdain and Finesse increase.",
                          type: 'TEXT',
                        },
                        {
                          isVariable: false,
                          op: '%-',
                          type: 'SET',
                          value: '20',
                        },
                        {
                          isVariable: false,
                          op: '%+',
                          type: 'SET',
                          value: '20',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'Axilmeus',
                        type: 'GOTO',
                      },
                      reuse: null,
                      text: 'I waited for him to die.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      components: [
                        {
                          text: "It wasn't easy; the shield protected him from fire and helped him evade your attacks.  Eventually you had to swallow him whole and cough up the shield.  That worked!\n\nBrutality and Vigilance increase.",
                          type: 'TEXT',
                        },
                        {
                          isVariable: false,
                          op: '%+',
                          type: 'SET',
                          value: '20',
                        },
                        {
                          isVariable: false,
                          op: '%-',
                          type: 'SET',
                          value: '20',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'Axilmeus',
                        type: 'GOTO',
                      },
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
                      components: [
                        {
                          isVariable: false,
                          op: '%+',
                          type: 'SET',
                          value: '15',
                        },
                        {
                          text: 'Disdain increases.\n\nAxilmeus took your shield and beat you with it, hard.',
                          type: 'TEXT',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'ResolveAxilmeus',
                        type: 'GOTO',
                      },
                      reuse: null,
                      text: ' I gave him the shield to avoid a fight.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      components: [
                        {
                          isVariable: false,
                          op: '%+',
                          type: 'SET',
                          value: '15',
                        },
                        {
                          isVariable: false,
                          op: '%-',
                          type: 'SET',
                          value: '15',
                        },
                        {
                          text: 'Brutality and Honor increase.\n\nYou fought your hardest, but Axilmeus was a bit stronger than you; he pinned you to the ground and pried the shield out of your claws.',
                          type: 'TEXT',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'ResolveAxilmeus',
                        type: 'GOTO',
                      },
                      reuse: null,
                      text: ' I dueled him for the shield.',
                      type: 'CHOICE_ITEM',
                    },
                    {
                      components: [
                        {
                          isVariable: false,
                          op: '%-',
                          type: 'SET',
                          value: '15',
                        },
                        {
                          isVariable: false,
                          op: '%+',
                          type: 'SET',
                          value: '15',
                        },
                        {
                          text: 'Cunning and Finesse increase.\n\nUnfortunately, Axilmeus is your elder; at this age, he has the advantage in maneuverability.  He caught up to you quickly, pinning you to the ground and prying the shield out of your claws.',
                          type: 'TEXT',
                        },
                      ],
                      condition: null,
                      link: {
                        text: 'ResolveAxilmeus',
                        type: 'GOTO',
                      },
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
          name: 'name',
          type: 'CREATE',
          value: '""',
        },
        {
          name: 'brutality',
          type: 'CREATE',
          value: '50',
        },
        {
          name: 'cunning',
          type: 'CREATE',
          value: '50',
        },
        {
          name: 'disdain',
          type: 'CREATE',
          value: '50',
        },
        {
          name: 'gender',
          type: 'CREATE',
          value: '"unknown"',
        },
        {
          name: 'wounds',
          type: 'CREATE',
          value: '0',
        },
        {
          name: 'blasphemy',
          type: 'CREATE',
          value: '0',
        },
        {
          name: 'infamy',
          type: 'CREATE',
          value: '50',
        },
        {
          name: 'wealth',
          type: 'CREATE',
          value: '5000',
        },
        {
          name: 'encourage',
          type: 'CREATE',
          value: '0',
        },
        {
          name: 'victory',
          type: 'CREATE',
          value: '0',
        },
        {
          name: 'clutchmate_alive',
          type: 'CREATE',
          value: 'false',
        },
        {
          name: 'vermias_killed_axilmeus',
          type: 'CREATE',
          value: 'false',
        },
        {
          name: 'callax_alive',
          type: 'CREATE',
          value: 'true',
        },
        {
          name: 'Callax_With',
          type: 'CREATE',
          value: 'false',
        },
        {
          name: 'royal',
          scene: 'startup',
          type: 'TEMP',
          value: '',
        },
        {
          name: 'royal_him',
          scene: 'startup',
          type: 'TEMP',
          value: '',
        },
        {
          name: 'royal_his',
          scene: 'startup',
          type: 'TEMP',
          value: '',
        },
        {
          name: 'royal_she',
          scene: 'startup',
          type: 'TEMP',
          value: '',
        },
        {
          name: 'royals',
          scene: 'startup',
          type: 'TEMP',
          value: '',
        },
        {
          name: 'color',
          scene: 'startup',
          type: 'TEMP',
          value: '',
        },
        {
          name: 'head',
          scene: 'startup',
          type: 'TEMP',
          value: '',
        },
        {
          name: 'wings',
          scene: 'startup',
          type: 'TEMP',
          value: '',
        },
        {
          name: 'wealth_text',
          scene: 'startup',
          type: 'TEMP',
          value: '"${wealth} gold coins"',
        },
      ],
    };


    const result = parse(cs);
    const filtered = removeKeys(false, 'scene', 'error', 'tokens', 'indent')(removeKeys(true, 'id', 'variableId')({ ...result }));

    expect(filtered).toEqual(expected);
  });

  it('flattens nested nodes', () => {
    const nodes = [
      {
        components: [
          {
            id: 'SJWZChZj-',
            text: 'Hello World!\n',
            type: 'TEXT',
          },
        ],
        id: 'B1YWbC2bjZ',
        label: '',
        link: {
          block: [
            {
              block: [
                {
                  components: [
                    {
                      id: 'SJeZZCnbo-',
                      text: 'My, you\'re cheerful',
                      type: 'TEXT',
                    },
                  ],
                  id: 'H1WZWR3bs-',
                  label: '',
                  link: {
                    text: 'cheerful',
                    type: 'GOTO',
                  },
                  type: 'NODE',
                },
              ],
              condition: null,
              id: 'Syf-bA3-s-',
              reuse: 'HIDE_REUSE',
              text: 'And all who inhabit it!',
              type: 'CHOICE_ITEM',
            },
            {
              block: [
                {
                  components: [
                    {
                      id: 'BymZbRnbiW',
                      text: 'Indeed',
                      type: 'TEXT',
                    },
                  ],
                  id: 'ryUb-R3bj-',
                  label: '',
                  link: {
                    node: {
                      components: [
                        {
                          id: 'S1EWZA2biZ',
                          text: 'happy false',
                          type: 'SET',
                        },
                      ],
                      id: 'BySWW0nbiW',
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
              id: 'rywWWA2bjZ',
              reuse: 'DISABLE_REUSE',
              text: 'I hate Mondays...',
              type: 'CHOICE_ITEM',
            },
          ],
          id: 'HkuZb03WjZ',
          type: 'CHOICE',
        },
        type: 'NODE',
      },
      {
        components: [
          {
            id: 'rkcbZCnWoW',
            text: 'happy true',
            type: 'SET',
          },
        ],
        id: 'B1sZ-ChWib',
        label: 'cheerful',
        link: {
          text: '',
          type: 'FINISH',
        },
        type: 'NODE',
      },
    ];
    const scenes = [makeScene('startup', nodes)];
    const expected = [
      [
        {
          components: [
            {
              id: 'SJWZChZj-',
              text: 'Hello World!\n',
              type: 'TEXT',
            },
          ],
          id: 'B1YWbC2bjZ',
          label: '',
          link: {
            block: [
              {
                condition: null,
                id: 'Syf-bA3-s-',
                link: {
                  node: 'H1WZWR3bs-',
                  type: 'NODE_LINK',
                },
                reuse: 'HIDE_REUSE',
                text: 'And all who inhabit it!',
                type: 'CHOICE_ITEM',
              },
              {
                condition: {
                  condition: '(true)',
                  type: 'IF',
                },
                id: 'rywWWA2bjZ',
                link: {
                  node: 'ryUb-R3bj-',
                  type: 'NODE_LINK',
                },
                reuse: 'DISABLE_REUSE',
                text: 'I hate Mondays...',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'HkuZb03WjZ',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'SJeZZCnbo-',
              text: 'My, you\'re cheerful',
              type: 'TEXT',
            },
          ],
          id: 'H1WZWR3bs-',
          label: '',
          link: {
            node: 'B1sZ-ChWib',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'BymZbRnbiW',
              text: 'Indeed',
              type: 'TEXT',
            },
          ],
          id: 'ryUb-R3bj-',
          label: '',
          link: {
            node: {
              node: 'BySWW0nbiW',
              type: 'NODE_LINK',
            },
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'S1EWZA2biZ',
              text: 'happy false',
              type: 'SET',
            },
          ],
          id: 'BySWW0nbiW',
          label: 'hate',
          link: {
            text: '',
            type: 'FINISH',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'rkcbZCnWoW',
              text: 'happy true',
              type: 'SET',
            },
          ],
          id: 'B1sZ-ChWib',
          label: 'cheerful',
          link: {
            text: '',
            type: 'FINISH',
          },
          type: 'NODE',
        },
      ],
    ];

    const result = flattenScenes(scenes);
    expect(result).toEqual(expected);
  });

  it('successfully flattens dragon', () => {
    const nodes = [
      {
        type: 'NODE',
        id: 'rkcbavH9tiZ',
        label: '',
        components: [{
          type: 'TEXT',
          id: 'ByBgavrqtsZ',
          text: 'Let us begin.\n\nA knight charges up the slope at you.  His horse pounds at the ground, carrying the heavily armored warrior as if he were a child\'s doll.  The knight sets his lance to attack you.\n\nHow do you defend yourself, O mighty dragon?',
        }],
        link: {
          type: 'CHOICE',
          id: 'HkKW6PB9YiZ',
          block: [{
            type: 'CHOICE_ITEM',
            id: 'r1teTDrqFjb',
            reuse: null,
            condition: null,
            text: 'I take to the air with a quick beat of my wings.',
            block: [{
              type: 'NODE',
              id: 'H1_eawSqFiZ',
              label: '',
              components: [{
                type: 'TEXT',
                id: 'HyLgTwSqYib',
                text: 'You leap to the air, deftly avoiding the knight\'s thrust.  Now that you are in the air, he hardly poses any threat at allâ€”not that he ever posed much of one to you.  You circle back and knock him off his horse with a swipe of your claw.\n',
              }, { type: 'SET', id: 'ByPgpDHcYsW', text: 'brutality %-10' }],
              link: { type: 'GOTO', text: 'Victory' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'Hypx6vHqKo-',
            reuse: null,
            condition: null,
            text: 'I knock the knight from his horse with a slap of my tail.',
            block: [{
              type: 'NODE',
              id: 'Hk3gaDSctib',
              label: '',
              components: [{
                type: 'TEXT',
                id: 'S1qe6PBcFiW',
                text: 'You swing your mighty tail around and knock the knight flying.  While he struggles to stand, you break his horse\'s back and begin devouring it.\n',
              }, {
                type: 'SET',
                id: 'HJjxawHqYjb',
                text: 'cunning %+10',
              }],
              link: { type: 'GOTO', text: 'Victory' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'SybWpwr9Ys-',
            reuse: null,
            condition: null,
            text: 'I rush into his charge and tear him to pieces with my claws.',
            block: [{
              type: 'NODE',
              id: 'BklW6Pr9KiW',
              label: '',
              components: [{
                type: 'TEXT',
                id: 'HJClTvB5tj-',
                text: 'The knight\'s lance shatters against your nigh-impenetrable hide as you slam into him.  You yank him clean off his horse, slamming him to the ground and ripping his plate armor with your vicious claws.  The fight is over before it has begun. \n',
              }, { type: 'SET', id: 'BykWTDr5Ki-', text: 'brutality %+10' }],
              link: { type: 'GOTO', text: 'Victory' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'HkS-TDBctoZ',
            reuse: null,
            condition: null,
            text: 'A puff of my fiery breath should be enough for him.',
            block: [{
              type: 'NODE',
              id: 'HyEbTDB5tiZ',
              label: '',
              components: [{
                type: 'TEXT',
                id: 'SyzZ6Pr9Kib',
                text: 'You let loose an inferno of fire.  The knight\'s horse is cooked nicely, and your stomach lets out a deafening rumble as the smell of roast destrier reaches your nostrils.  The knight himself staggers to his feet.  His armor managed to keep him alive, but only barely.\n',
              }, { type: 'SET', id: 'Sy7-pPr5Fj-', text: 'disdain %+10' }],
              link: { type: 'GOTO', text: 'Victory' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'SyuZavH9KsZ',
            reuse: null,
            condition: { type: 'IF', condition: '(choice_save_allowed)' },
            text: 'Restore a saved game.',
            block: [{
              type: 'NODE',
              id: 'HJPWpvHctsZ',
              label: '',
              components: [{ type: 'TEXT', id: 'ByL-TwH5tjW', text: '*restore_game' }],
              link: { type: 'GOTO', text: 'purchased' },
            }],
          }],
        },
      }, {
        type: 'NODE',
        id: 'Bk5G6wS5Fjb',
        label: 'Victory',
        components: [{ type: 'TEXT', id: 'rko-TwrctiW', text: 'Do you finish him off, victorious dragon?' }],
        link: {
          type: 'CHOICE',
          id: 'BkFzTDrcYob',
          block: [{
            type: 'CHOICE_ITEM',
            id: 'S1yGpPB9Fjb',
            reuse: null,
            condition: null,
            text: 'Of course!  How dare he attack me?',
            block: [{
              type: 'NODE',
              id: 'S1RbTvrqFjW',
              label: '',
              components: [{
                type: 'TEXT',
                id: 'HJ3-TDHqFiW',
                text: 'Your jaws crush him in a single bite.\n\nThat showed him.',
              }, { type: 'SET', id: 'BJ6bTwBqKiZ', text: 'brutality %+10' }],
              link: { type: 'GOTO', text: 'Naming' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'Sk7MpvBcYjb',
            reuse: null,
            condition: null,
            text: 'I let him live to warn others of my immense power.',
            block: [{
              type: 'NODE',
              id: 'rkGMaPBqFsW',
              label: '',
              components: [{
                type: 'TEXT',
                id: 'B1xfpvSqKoZ',
                text: '"Begone, petty human.  To attack me is to meet your doom," you growl.\n\nThe knight stumbles away as quickly as he can, not even daring to pretend that he could still fight you.',
              }, { type: 'SET', id: 'BkZzaDHcYi-', text: 'infamy %+15' }],
              link: { type: 'GOTO', text: 'Naming' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'SyOfTwScKo-',
            reuse: null,
            condition: null,
            text: 'Eh.  Now that the threat is ended, he is beneath my concern.',
            block: [{
              type: 'NODE',
              id: 'SywGTPHqFjW',
              label: '',
              components: [{
                type: 'TEXT',
                id: 'r14zpwSqFo-',
                text: 'You leisurely eat the knight\'s horse.  He slinks away as quietly as he can.  (His heavy armor makes a stealthy escape impossible.)  Still, you pay him no mind as he leaves.\n',
              }, { type: 'SET', id: 'BkSzpDScYoZ', text: 'infamy %+10' }, {
                type: 'SET',
                id: 'SyIGawSqYiW',
                text: 'disdain %+10',
              }],
              link: { type: 'GOTO', text: 'Naming' },
            }],
          }],
        },
      }, {
        type: 'NODE',
        id: 'r1_NTDBcFs-',
        label: 'Naming',
        components: [{
          type: 'TEXT',
          id: 'rJjzaDBcFsb',
          text: 'You know, it\'s going to get annoying to keep calling you "great and mighty dragon."  What is your name?',
        }],
        link: {
          type: 'CHOICE',
          id: 'SkwVavBcto-',
          block: [{
            type: 'CHOICE_ITEM',
            id: 'rk0zpPSqKo-',
            reuse: null,
            condition: null,
            text: 'Gorthalon.',
            block: [{
              type: 'NODE',
              id: 'SJazpPBqKsW',
              label: '',
              components: [{ type: 'SET', id: 'r13MTPBcYo-', text: 'name "Gorthalon"' }],
              link: { type: 'GOTO', text: 'gender' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'BJWm6DS9Yj-',
            reuse: null,
            condition: null,
            text: 'Sssetheliss.',
            block: [{
              type: 'NODE',
              id: 'BylQ6Pr9Kib',
              label: '',
              components: [{ type: 'SET', id: 'rkkXawB5tj-', text: 'name "Sssetheliss"' }],
              link: { type: 'GOTO', text: 'gender' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'HJEmaPB5Fjb',
            reuse: null,
            condition: null,
            text: 'Calemvir.',
            block: [{
              type: 'NODE',
              id: 'BJXm6PSqYib',
              label: '',
              components: [{ type: 'SET', id: 'ryzXawScKsZ', text: 'name "Calemvir"' }],
              link: { type: 'GOTO', text: 'gender' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'r1UNpwScts-',
            reuse: null,
            condition: null,
            text: 'These names are all terrible!',
            block: [{
              type: 'NODE',
              id: 'SkH4TDB9tob',
              label: '',
              components: [{ type: 'TEXT', id: 'HJBXTDB9toZ', text: 'Oh! Please forgive me.' }],
              link: {
                type: 'NODE_LINK',
                node: {
                  type: 'NODE',
                  id: 'ByEETvB5KjZ',
                  label: 'input_name',
                  components: [{
                    type: 'TEXT',
                    id: 'rJL76vHqto-',
                    text: 'What name would you prefer?',
                  }, { type: 'INPUT_TEXT', id: 'B1PXpDS9Kj-', text: 'name' }, {
                    type: 'COMMENT',
                    id: 'S1dXTwH5toZ',
                    text: 'check capitalization',
                  }],
                  link: {
                    type: 'IF',
                    id: 'Bk74TDS9KsZ',
                    condition: '("${name}" != "$!{name}")',
                    block: [{
                      type: 'NODE',
                      id: 'rJGVaPr5FiZ',
                      label: '',
                      components: [{
                        type: 'TEXT',
                        id: 'BkFQavHqYo-',
                        text: 'Your name is $!{name}, is that right?\n',
                      }],
                      link: {
                        type: 'CHOICE',
                        id: 'Bk-46Pr9FsW',
                        block: [{
                          type: 'CHOICE_ITEM',
                          id: 'HJn7pwB5Kob',
                          reuse: null,
                          condition: null,
                          text: 'Yes.',
                          block: [{
                            type: 'NODE',
                            id: 'Byj7pwH5Ko-',
                            label: '',
                            components: [{ type: 'SET', id: 'ry97pPHqtjW', text: 'name "$!{name}"' }],
                            link: { type: 'GOTO', text: 'gender' },
                          }],
                        }, {
                          type: 'CHOICE_ITEM',
                          id: 'HyRmpvScFi-',
                          reuse: null,
                          condition: null,
                          text: 'No, my name is ${name}, just as I said.',
                          block: [{
                            type: 'NODE',
                            id: 'HJ676wrqtsb',
                            label: '',
                            components: [],
                            link: { type: 'GOTO', text: 'gender' },
                          }],
                        }, {
                          type: 'CHOICE_ITEM',
                          id: 'ryl46DBqYjb',
                          reuse: null,
                          condition: null,
                          text: 'Er, wait, let me try that again.',
                          block: [{
                            type: 'NODE',
                            id: 'S11VpwSqYib',
                            label: '',
                            components: [],
                            link: { type: 'GOTO', text: 'input_name' },
                          }],
                        }],
                      },
                    }],
                    elses: [],
                  },
                },
              },
            }],
          }],
        },
      }, {
        type: 'NODE',
        id: 'SyxPTvBqKj-',
        label: 'gender',
        components: [{ type: 'TEXT', id: 'Hkt4aPB9KiW', text: 'Will you be male or female?' }],
        link: {
          type: 'CHOICE',
          id: 'HJkwTPr5KiZ',
          block: [{
            type: 'CHOICE_ITEM',
            id: 'HyhVpDSqKj-',
            reuse: null,
            condition: null,
            text: 'Male.',
            block: [{
              type: 'NODE',
              id: 'rJsVpvB9KiZ',
              label: '',
              components: [{ type: 'SET', id: 'BJ54TPB9Ko-', text: 'gender "male"' }],
              link: { type: 'GOTO', text: 'Princess' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'S11B6wS9KjW',
            reuse: null,
            condition: null,
            text: 'Female.',
            block: [{
              type: 'NODE',
              id: 'HJA4awS9KiZ',
              label: '',
              components: [{ type: 'SET', id: 'SyaNTvHcKjZ', text: 'gender "female"' }],
              link: { type: 'GOTO', text: 'Princess' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'HJGBTvSctob',
            reuse: null,
            condition: null,
            text: 'Neither.',
            block: [{
              type: 'NODE',
              id: 'B1-BpwH5YjZ',
              label: '',
              components: [{ type: 'SET', id: 'BylBpPr9Fsb', text: 'gender "neither"' }],
              link: { type: 'GOTO', text: 'Princess' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'SJSSTvr9Fs-',
            reuse: null,
            condition: null,
            text: 'Unknown/undetermined.',
            block: [{
              type: 'NODE',
              id: 'rJVSTPrqFsb',
              label: '',
              components: [{ type: 'SET', id: 'ryXH6PScKjb', text: 'gender "unknown"' }],
              link: { type: 'GOTO', text: 'Princess' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'ryALaPBcKjb',
            reuse: null,
            condition: null,
            text: 'Do not pester me with impudent questions!',
            block: [{
              type: 'NODE',
              id: 'HJpI6PScFsb',
              label: '',
              components: [{ type: 'SET', id: 'HJUHpvrctjW', text: 'brutality %+ 15' }, {
                type: 'TEXT',
                id: 'S1DSTPB5YiZ',
                text: 'I, ah, I mean, yes!  Of course!  How churlish of me.\n\nBut, O mighty ${name}, I feel I should let you know that this game is full of choices; indeed, it is nothing but multiple choice questions that determine the course of your adventures as a dragon.  If you don\'t enjoy answering questions, this game may not be for you!\n\nDo youâ€¦I mean, if I may, would you like to specify your gender after all?\n',
              }],
              link: {
                type: 'CHOICE',
                id: 'SJ2UaDScYob',
                block: [{
                  type: 'CHOICE_ITEM',
                  id: 'Syw8pwScYiZ',
                  reuse: null,
                  condition: null,
                  text: 'Very well.',
                  block: [{
                    type: 'NODE',
                    id: 'r1LL6wSqYsZ',
                    label: '',
                    components: [{
                      type: 'TEXT',
                      id: 'HJdBavB5FsW',
                      text: 'Excellent choice!  What gender will you be?\n',
                    }],
                    link: {
                      type: 'CHOICE',
                      id: 'rJrUpwBqFib',
                      block: [{
                        type: 'CHOICE_ITEM',
                        id: 'S1jBpPS9tsb',
                        reuse: null,
                        condition: null,
                        text: 'Male.',
                        block: [{
                          type: 'NODE',
                          id: 'HkqBpvrqKs-',
                          label: '',
                          components: [{ type: 'SET', id: 'HyKH6DrqFjb', text: 'gender "male"' }],
                          link: { type: 'GOTO', text: 'Princess' },
                        }],
                      }, {
                        type: 'CHOICE_ITEM',
                        id: 'SJRSpDH5Yib',
                        reuse: null,
                        condition: null,
                        text: 'Female.',
                        block: [{
                          type: 'NODE',
                          id: 'HkTS6DrqYjb',
                          label: '',
                          components: [{ type: 'SET', id: 'ry3rpDr9KiW', text: 'gender "female"' }],
                          link: { type: 'GOTO', text: 'Princess' },
                        }],
                      }, {
                        type: 'CHOICE_ITEM',
                        id: 'rJb8TPB9Ys-',
                        reuse: null,
                        condition: null,
                        text: 'Neither.',
                        block: [{
                          type: 'NODE',
                          id: 'SJgL6vH5tsW',
                          label: '',
                          components: [{ type: 'SET', id: 'rkk8avr9Yi-', text: 'gender "neither"' }],
                          link: { type: 'GOTO', text: 'Princess' },
                        }],
                      }, {
                        type: 'CHOICE_ITEM',
                        id: 'rkNLTDHcYib',
                        reuse: null,
                        condition: null,
                        text: 'Unknown/undetermined.',
                        block: [{
                          type: 'NODE',
                          id: 'SyXLpwBqFiZ',
                          label: '',
                          components: [{ type: 'SET', id: 'B1GUaDB9KjZ', text: 'gender "unknown"' }],
                          link: { type: 'GOTO', text: 'Princess' },
                        }],
                      }],
                    },
                  }],
                }, {
                  type: 'CHOICE_ITEM',
                  id: 'B1jUTDScKoW',
                  reuse: null,
                  condition: null,
                  text: 'I said no.',
                  block: [{
                    type: 'NODE',
                    id: 'S198TDr5YoZ',
                    label: '',
                    components: [{ type: 'SET', id: 'HydIavrcFoZ', text: 'gender "unknown"' }, {
                      type: 'TEXT',
                      id: 'HkF8pDH9YiW',
                      text: 'Well, let\'s just leave it undetermined, then!',
                    }],
                    link: { type: 'GOTO', text: 'Princess' },
                  }],
                }],
              },
            }],
          }],
        },
      }, {
        type: 'NODE',
        id: 'HkrOavr9Fi-',
        label: 'Princess',
        components: [{
          type: 'TEXT',
          id: 'SyZvpvSqKsb',
          text: 'As you think about it, the knight\'s attack was probably inevitable.  After all, you did just kidnap the princess from right out of her tower.  Althoughâ€¦\n\nIsn\'t it a little sexist to always kidnap princesses?',
        }],
        link: {
          type: 'CHOICE',
          id: 'rkN_pvBcFiW',
          block: [{
            type: 'CHOICE_ITEM',
            id: 'HJDP6DH9tsW',
            reuse: null,
            condition: null,
            text: 'Maybe, but tradition demands that dragons kidnap princesses, even if that is sexist.',
            block: [{
              type: 'NODE',
              id: 'rkIvaDBcKsZ',
              label: '',
              components: [{
                type: 'TEXT',
                id: 'ryEwTDrqKoW',
                text: 'I guess you\'re right.\n\nAnyway, as you ripped the roof off her tower, the light glistened off yourâ€¦',
              }, { type: 'SET', id: 'HJSDTvSqKoW', text: 'royal "princess"' }],
              link: { type: 'GOTO', text: 'color' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'S1sDaPHqFib',
            reuse: null,
            condition: null,
            text: 'You dare question my actions?',
            block: [{
              type: 'NODE',
              id: 'B19PawScKiW',
              label: '',
              components: [{
                type: 'TEXT',
                id: 'S1uPTvr5Fob',
                text: 'No, no!  Of course not.  I just wanted toâ€”I meanâ€”What I\'m trying to say isâ€¦\n\nLet\'s just move on.\n\nAnyway, as you ripped the roof off her tower, the light glistened off yourâ€¦',
              }, { type: 'SET', id: 'rkYwavr9Kob', text: 'royal "princess"' }],
              link: { type: 'GOTO', text: 'color' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'B1ydTDr5tjb',
            reuse: null,
            condition: null,
            text: 'You know, I never thought about that before.  In fact, I think I kidnapped a prince, just to avoid being sexist.',
            block: [{
              type: 'NODE',
              id: 'Sy0DTwH5tsW',
              label: '',
              components: [{
                type: 'TEXT',
                id: 'S1hDTPrcKjb',
                text: 'Right you are.  As I was saying, the knight\'s attack was probably inevitable.  After all, you did just kidnap the prince \nfrom right out of his tower.  As you ripped the roof off his tower, the light glistened off yourâ€¦',
              }, { type: 'SET', id: 'Sk6PTDS5Ko-', text: 'royal "prince"' }],
              link: { type: 'GOTO', text: 'color' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'H17OpDrqYsZ',
            reuse: null,
            condition: null,
            text: 'I\'ll have you know that I make a careful point of alternating between princes and princesses, but it happened to be time for a princess.',
            block: [{
              type: 'NODE',
              id: 'rJzOavHqKob',
              label: '',
              components: [{
                type: 'TEXT',
                id: 'B1ed6PB9tsb',
                text: 'Of course.  I\'m sorry for questioning you.\n\nAnyway, as you ripped the roof off her tower, the light glistened off yourâ€¦',
              }, {
                type: 'SET',
                id: 'rJbOawSqYob',
                text: 'royal "princess"',
              }],
              link: { type: 'GOTO', text: 'color' },
            }],
          }],
        },
      }, {
        type: 'NODE',
        id: 'r1LKpvrqtiZ',
        label: 'color',
        components: [],
        link: {
          type: 'IF',
          id: 'SySYawBcKjb',
          condition: '(royal="princess")',
          block: [{
            type: 'NODE',
            id: 'HkAO6DrctiZ',
            label: '',
            components: [{ type: 'SET', id: 'Skc_6PHcYib', text: 'royal_him "her"' }, {
              type: 'SET',
              id: 'rJsdTPSqtib',
              text: 'royal_his "her"',
            }, { type: 'SET', id: 'Hkh_awB9Yo-', text: 'royal_she "she"' }, {
              type: 'SET',
              id: 'Hy6uavrqFsW',
              text: 'royals "princesses"',
            }],
            link: { type: 'GOTO', text: 'A' },
          }],
          elses: [{
            type: 'ELSE',
            id: 'HJEKTvrqKi-',
            block: [{
              type: 'NODE',
              id: 'S1mtavSqFib',
              label: '',
              components: [{ type: 'SET', id: 'rJ1tpwB5Ys-', text: 'royal_him "him"' }, {
                type: 'SET',
                id: 'SJlFaDB5to-',
                text: 'royal_his "his"',
              }, { type: 'SET', id: 'HkbF6wH5tjW', text: 'royal_she "he"' }, {
                type: 'SET',
                id: 'SJMY6wS5Fjb',
                text: 'royals "princes"',
              }],
              link: { type: 'GOTO', text: 'A' },
            }],
          }],
        },
      }, {
        type: 'NODE',
        id: 'S1do6vH9KoW',
        label: 'A',
        components: [{
          type: 'TEXT',
          id: 'BkDF6DS9Kob',
          text: 'Ah, would you like to specify the color of your hide?  I wasn\'t sure which color to put in that description.\n',
        }],
        link: {
          type: 'CHOICE',
          id: 'HkDiaPB9Yjb',
          block: [{
            type: 'CHOICE_ITEM',
            id: 'HkCF6PBcYib',
            reuse: null,
            condition: null,
            text: 'Can we just get on to the smashing?',
            block: [{
              type: 'NODE',
              id: 'HkpKaPrqKsZ',
              label: '',
              components: [{ type: 'SET', id: 'SJ9t6PH5Kj-', text: 'brutality %+ 30' }, {
                type: 'TEXT',
                id: 'SJiK6vH5tjb',
                text: 'yes, of course!  Your wish is my command.\n\nOn with the show!\n',
              }, {
                type: 'PAGE_BREAK',
                id: 'rJ3FTwB5Yob',
                text: '',
              }],
              link: { type: 'GOTO', text: 'RoyalResolution' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'Sybc6vH9Yi-',
            reuse: null,
            condition: null,
            text: 'Black.',
            block: [{
              type: 'NODE',
              id: 'HJlqaDScYsZ',
              label: '',
              components: [{ type: 'SET', id: 'B1yqTPHctib', text: 'color "black"' }],
              link: { type: 'GOTO', text: 'limbs' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'ByNcavB9Yo-',
            reuse: null,
            condition: null,
            text: 'Blue.',
            block: [{
              type: 'NODE',
              id: 'H1Q96DH9YsW',
              label: '',
              components: [{ type: 'SET', id: 'SJz5avBqtib', text: 'color "blue"' }],
              link: { type: 'GOTO', text: 'limbs' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'SyDcTDH9Ysb',
            reuse: null,
            condition: null,
            text: 'Brown.',
            block: [{
              type: 'NODE',
              id: 'SkI9avBctib',
              label: '',
              components: [{ type: 'SET', id: 'SJrcawS9ti-', text: 'color "brown"' }],
              link: { type: 'GOTO', text: 'limbs' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'ryc96wB5KjZ',
            reuse: null,
            condition: null,
            text: 'Gold.',
            block: [{
              type: 'NODE',
              id: 'ryKcawr9Fjb',
              label: '',
              components: [{ type: 'SET', id: 'SJO9pPS5Yj-', text: 'color "golden"' }],
              link: { type: 'GOTO', text: 'limbs' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'HJaq6vHctsW',
            reuse: null,
            condition: null,
            text: 'Green.',
            block: [{
              type: 'NODE',
              id: 'H1ncavSqFs-',
              label: '',
              components: [{ type: 'SET', id: 'S1iqaPH5to-', text: 'color "green"' }],
              link: { type: 'GOTO', text: 'limbs' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'BJgi6Dr9Fo-',
            reuse: null,
            condition: null,
            text: 'Iridescent.',
            block: [{
              type: 'NODE',
              id: 'HyJoTwrqKsb',
              label: '',
              components: [{ type: 'SET', id: 'rJ0qpPr9Fsb', text: 'color "iridescent"' }],
              link: { type: 'GOTO', text: 'limbs' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'rkmoawB9FiW',
            reuse: null,
            condition: null,
            text: 'Red.',
            block: [{
              type: 'NODE',
              id: 'rJzo6vrcYiZ',
              label: '',
              components: [{ type: 'SET', id: 'SJboavrqYjb', text: 'color "red"' }],
              link: { type: 'GOTO', text: 'limbs' },
            }],
          }, {
            type: 'CHOICE_ITEM',
            id: 'BkLsTDr9tj-',
            reuse: null,
            condition: null,
            text: 'White.',
            block: [{
              type: 'NODE',
              id: 'SkSo6Pr9Fj-',
              label: '',
              components: [{ type: 'SET', id: 'S14oaPH5tsZ', text: 'color "white"' }],
              link: { type: 'GOTO', text: 'limbs' },
            }],
          }],
        },
      }, {
        type: 'NODE',
        id: 'BJrDe6wBqFoZ',
        label: 'limbs',
        components: [{
          type: 'TEXT',
          id: 'rytopvSqYsb',
          text: 'Wonderful choice.  So the light glistened off your ${color} hide, as you snatched the ${royal} out of ${royal_his} tower.\n\nWhile we\'re on the subject, let\'s settle a few other details.  How many limbs will you have, not counting your wings or tail?\n',
        }],
        link: {
          type: 'FAKE_CHOICE',
          id: 'SkNwxTPHcKjW',
          choices: [{
            type: 'FAKE_CHOICE_ITEM',
            id: 'S19sTPBcFsZ',
            reuse: null,
            condition: null,
            text: 'Four.',
            block: null,
          }, {
            type: 'FAKE_CHOICE_ITEM',
            id: 'r1ijavB5Ys-',
            reuse: null,
            condition: null,
            text: 'Five.',
            block: null,
          }, {
            type: 'FAKE_CHOICE_ITEM',
            id: 'By3j6wScKjb',
            reuse: null,
            condition: null,
            text: 'Six.',
            block: null,
          }, {
            type: 'FAKE_CHOICE_ITEM',
            id: 'r16s6PHqto-',
            reuse: null,
            condition: null,
            text: 'Eight.',
            block: null,
          }],
          link: [{
            type: 'NODE',
            id: 'Sk_3avSqtsW',
            label: '',
            components: [{ type: 'TEXT', id: 'rk0o6DBqFo-', text: 'Hmm.  Is the top of your head ridged or smooth?' }],
            link: {
              type: 'CHOICE',
              id: 'H1w3avH5YiZ',
              block: [{
                type: 'CHOICE_ITEM',
                id: 'HJX3avB5KjZ',
                reuse: null,
                condition: null,
                text: 'Ridged.',
                block: [{
                  type: 'NODE',
                  id: 'BkGhaDB9Fs-',
                  label: '',
                  components: [{ type: 'SET', id: 'rJZhTDBqKi-', text: 'head "ridged"' }],
                  link: { type: 'GOTO', text: 'wings' },
                }],
              }, {
                type: 'CHOICE_ITEM',
                id: 'S18naDr9YjZ',
                reuse: null,
                condition: null,
                text: 'Smooth.',
                block: [{
                  type: 'NODE',
                  id: 'r1SnaDSqYiZ',
                  label: '',
                  components: [{ type: 'SET', id: 'Hk43TPS5KoW', text: 'head "smooth"' }],
                  link: { type: 'GOTO', text: 'wings' },
                }],
              }],
            },
          }, {
            type: 'NODE',
            id: 'r1ITTDH5KsZ',
            label: 'wings',
            components: [{
              type: 'TEXT',
              id: 'HktnaDHqKoZ',
              text: 'I see.  And your wingsâ€”feathery, leathery, or scaly?\n',
            }],
            link: {
              type: 'CHOICE',
              id: 'B1rp6DSqYoZ',
              block: [{
                type: 'CHOICE_ITEM',
                id: 'Hy02pwS5tj-',
                reuse: null,
                condition: null,
                text: 'Feathery.',
                block: [{
                  type: 'NODE',
                  id: 'S1pn6vB5Ks-',
                  label: '',
                  components: [{ type: 'SET', id: 'Sy23aDS5Yo-', text: 'wings "feathery"' }],
                  link: { type: 'GOTO', text: 'Summary' },
                }],
              }, {
                type: 'CHOICE_ITEM',
                id: 'Sk-66DrqKsb',
                reuse: null,
                condition: null,
                text: 'Leathery.',
                block: [{
                  type: 'NODE',
                  id: 'Syl66vr9ti-',
                  label: '',
                  components: [{ type: 'SET', id: 'S1yapwSqFiZ', text: 'wings "leathery"' }],
                  link: { type: 'GOTO', text: 'Summary' },
                }],
              }, {
                type: 'CHOICE_ITEM',
                id: 'ry466vBqtsb',
                reuse: null,
                condition: null,
                text: 'Scaly.',
                block: [{
                  type: 'NODE',
                  id: 'BkXT6wSqKib',
                  label: '',
                  components: [{ type: 'SET', id: 'HyGapwSqYsW', text: 'wings "scaly"' }],
                  link: { type: 'GOTO', text: 'Summary' },
                }],
              }],
            },
          }, {
            type: 'NODE',
            id: 'HJylg6vHqKi-',
            label: 'Summary',
            components: [{
              type: 'TEXT',
              id: 'B1wp6PBqtob',
              text: 'As you kidnapped the ${royal}, you beat your ${wings} ${color} wings and flew off into the night, as ${royal_she} clutched tightly to your ${head} scalp to avoid plummeting to ${royal_his} doom.\n',
            }],
            link: {
              type: 'NODE_LINK',
              node: {
                type: 'NODE',
                id: 'r1RkgaPScKiZ',
                label: 'RoyalResolution',
                components: [{
                  type: 'TEXT',
                  id: 'BJOT6vBcFob',
                  text: 'What are you planning on doing with the ${royal}, anyway?',
                }],
                link: {
                  type: 'CHOICE',
                  id: 'BkpygTPS5KoW',
                  block: [{
                    type: 'CHOICE_ITEM',
                    id: 'B1_CpwH5Yob',
                    reuse: null,
                    condition: null,
                    text: 'It\'s all about companionship and good conversation.',
                    block: [{
                      type: 'NODE',
                      id: 'rkP0avS5to-',
                      label: '',
                      components: [{
                        type: 'TEXT',
                        id: 'rytaawHcKiZ',
                        text: 'Life can be lonely as a dragon, and interesting conversation is at a premium.  The elite upbringing of royalty makes them more suitable for entertaining dragons.\n\nBut what do you do after you tire of ${royal_his} conversation?',
                      }],
                      link: {
                        type: 'CHOICE',
                        id: 'B1LATwS5tsZ',
                        block: [{
                          type: 'CHOICE_ITEM',
                          id: 'SkkRpDrcKo-',
                          reuse: null,
                          condition: null,
                          text: 'Then it\'s time for a royal feastâ€”by which I mean I eat ${royal_him}.',
                          block: [{
                            type: 'NODE',
                            id: 'ryRppvB9YjZ',
                            label: '',
                            components: [{
                              type: 'TEXT',
                              id: 'HJ9ppDB9Fib',
                              text: 'The ${royal}\'s efforts to entertain you with ${royal_his} stories, harp-playing, and singing become more desperate as your boredom becomes more apparent.  But even ${royal_his} best efforts are not enough, and you devour ${royal_him} without remorse.\n',
                            }, { type: 'SET', id: 'SJoppDr5ts-', text: 'brutality %+10' }, {
                              type: 'SET',
                              id: 'HJhpaPSqFjZ',
                              text: 'cunning %+10',
                            }, { type: 'SET', id: 'H1TaTDr9KoZ', text: 'infamy %+10' }],
                            link: { type: 'GOTO', text: 'personality' },
                          }],
                        }, {
                          type: 'CHOICE_ITEM',
                          id: 'HJr0pPrqtiZ',
                          reuse: null,
                          condition: null,
                          text: 'I let ${royal_him} slip away, pretending not to notice ${royal_his} escape plan.',
                          block: [{
                            type: 'NODE',
                            id: 'ByVCpvrqFo-',
                            label: '',
                            components: [{
                              type: 'TEXT',
                              id: 'BkeRpvSqYoW',
                              text: 'The ${royal} becomes gradually more fearful as ${royal_his} stories, harp-playing, and singing amuse you less each passing day.  One evening, as you pretend to sleep, ${royal_she} makes a break for it.  You are well aware of ${royal_his} departure and could catch ${royal_him} easily, but you let ${royal_him} go.  $!{Royal_She} made several months more interesting, and that\'s\nworth sparing ${royal_his} life.',
                            }, { type: 'SET', id: 'SyWA6wH5Ys-', text: 'brutality %-10' }, {
                              type: 'SET',
                              id: 'BkMRTvHcFob',
                              text: 'cunning %-10',
                            }, { type: 'SET', id: 'SkXApvB5KiZ', text: 'infamy %-10' }],
                            link: { type: 'GOTO', text: 'personality' },
                          }],
                        }],
                      },
                    }],
                  }, {
                    type: 'CHOICE_ITEM',
                    id: 'H150pwBqFsb',
                    reuse: null,
                    condition: null,
                    text: 'I\'ll keep ${royal_him} around for a little while to lure in more knights, but then ${royal_she}\'s dinner.  It\'s a little known fact that ${royals} taste better than most humans.',
                    block: [{
                      type: 'NODE',
                      id: 'r1FCpvHqKjb',
                      label: '',
                      components: [],
                      link: { type: 'GOTO', text: 'EatHer' },
                    }],
                  }, {
                    type: 'CHOICE_ITEM',
                    id: 'rynklTvBqts-',
                    reuse: null,
                    condition: null,
                    text: 'It\'s all about the ransom payments.  Those are a quick and easy way to build a hoard.',
                    block: [{
                      type: 'NODE',
                      id: 'ByoJxawr5Ks-',
                      label: '',
                      components: [{
                        type: 'TEXT',
                        id: 'B1iCawB5Ysb',
                        text: 'Indeed.  Within a month, a large chest of gold comes to pay for the ${royal}\'s release.',
                      }, { type: 'SET', id: 'rk20pPBcKjW', text: 'wealth +1500' }, {
                        type: 'TEXT',
                        id: 'Syp0avBqKj-',
                        text: 'What do you do then?',
                      }],
                      link: {
                        type: 'CHOICE',
                        id: 'H15yeTwHqKs-',
                        block: [{
                          type: 'CHOICE_ITEM',
                          id: 'SkmyxawrcKsW',
                          reuse: null,
                          condition: null,
                          text: 'Honor demands that I carry out my end of the bargain.',
                          block: [{
                            type: 'NODE',
                            id: 'BJfJlpvrcti-',
                            label: '',
                            components: [{
                              type: 'TEXT',
                              id: 'BkACTDB9Fi-',
                              text: 'Of course.  No sooner have you received the payment than you let the ${royal} go.',
                            }, { type: 'SET', id: 'S1ykgTvBcFoZ', text: 'cunning %-20' }, {
                              type: 'SET',
                              id: 'S1x1gpvB9YoZ',
                              text: 'brutality %-10',
                            }, { type: 'SET', id: 'BJZ1x6wr5YiW', text: 'infamy %-10' }],
                            link: { type: 'GOTO', text: 'personality' },
                          }],
                        }, {
                          type: 'CHOICE_ITEM',
                          id: 'S1Ykg6DBqtob',
                          reuse: null,
                          condition: null,
                          text: 'Once I have the payment, I have no reason to delay my dinner.',
                          block: [{
                            type: 'NODE',
                            id: 'rkO1x6vrcKob',
                            label: '',
                            components: [{
                              type: 'TEXT',
                              id: 'BkNJeTvScYoZ',
                              text: 'Crunch, munch.  Delicious.\n',
                            }, { type: 'SET', id: 'ByrJlTDS9KoZ', text: 'cunning %+20' }, {
                              type: 'SET',
                              id: 'ryLye6DHqKoZ',
                              text: 'brutality %+10',
                            }, { type: 'SET', id: 'HJDJeTPSqYj-', text: 'infamy %+10' }],
                            link: { type: 'GOTO', text: 'personality' },
                          }],
                        }],
                      },
                    }],
                  }],
                },
              },
            },
          }, {
            type: 'NODE',
            id: 'Sk7llTDBctsW',
            label: 'EatHer',
            components: [{
              type: 'TEXT',
              id: 'r1egx6DHqFjW',
              text: 'It must be the diet.  In any event, you have a delightful dinner of roast ${royal}.',
            }, { type: 'SET', id: 'Sy-egpDHqFo-', text: 'brutality %+10' }, {
              type: 'SET',
              id: 'ByMgg6vrcYib',
              text: 'infamy %+10',
            }],
            link: { type: 'GOTO', text: 'personality' },
          }, {
            type: 'NODE',
            id: 'HkeZeavH5tob',
            label: 'personality',
            components: [{ type: 'PAGE_BREAK', id: 'S1VlgpDH5Fob', text: '' }, {
              type: 'TEXT',
              id: 'rkBllpvBqtsb',
              text: 'This would be a good time to talk a little more about your personality.\n\nAll dragons can be described in terms of a handful of characteristics, each in opposed pairs:  Brutality and Finesse, Cunning and Honor, Disdain and Vigilance.\n',
            }, {
              type: 'COMMENT',
              id: 'SyIlgavrqtj-',
              text: 'We start with the basic dichotomies between the paired attributes',
            }, {
              type: 'COMMENT',
              id: 'rywll6Dr9Kib',
              text: 'brutality is the opposite of finesse; only modify by %+ or %-',
            }, { type: 'TEXT', id: 'rkdglpDrqtsb', text: 'Are you more notable for your Brutality or your Finesse?' }],
            link: {
              type: 'CHOICE',
              id: 'HJ1-gTPH5YiZ',
              block: [{
                type: 'CHOICE_ITEM',
                id: 'ryslgaDScYob',
                reuse: null,
                condition: null,
                text: 'Brutality: strength and cruelty.',
                block: [{
                  type: 'NODE',
                  id: 'H19xgavHctob',
                  label: '',
                  components: [{ type: 'SET', id: 'B1Kee6wS5Ks-', text: 'brutality %+70' }],
                  link: { type: 'GOTO', text: 'CunningQuestion' },
                }],
              }, {
                type: 'CHOICE_ITEM',
                id: 'BkCelTDHqFsb',
                reuse: null,
                condition: null,
                text: 'Finesse: precision and aerial maneuverability.',
                block: [{
                  type: 'NODE',
                  id: 'SkpxgpDB9KoW',
                  label: '',
                  components: [{ type: 'SET', id: 'SyhxeTPSqtib', text: 'brutality %-70' }],
                  link: { type: 'GOTO', text: 'CunningQuestion' },
                }],
              }],
            },
          }, {
            type: 'NODE',
            id: 'rk5ZlpwHqYoW',
            label: 'CunningQuestion',
            components: [{
              type: 'COMMENT',
              id: 'H1-ZepPr9YsZ',
              text: 'cunning is the opposite of honorable; only modified by %+ or %-',
            }, { type: 'TEXT', id: 'BJzZl6PrqYib', text: 'Do you have more Cunning or Honor?' }],
            link: {
              type: 'CHOICE',
              id: 'S1KbgavScFoZ',
              block: [{
                type: 'CHOICE_ITEM',
                id: 'HkS-xTwr9tj-',
                reuse: null,
                condition: null,
                text: 'Cunning: intelligence and trickery.',
                block: [{
                  type: 'NODE',
                  id: 'H1Vbl6DHqKoZ',
                  label: '',
                  components: [{ type: 'SET', id: 'BJQ-xTvrcFs-', text: 'cunning %+70' }],
                  link: { type: 'GOTO', text: 'DisdainQuestion' },
                }],
              }, {
                type: 'CHOICE_ITEM',
                id: 'Hy_beTDScYoW',
                reuse: null,
                condition: null,
                text: 'Honor: honesty and trustworthiness.',
                block: [{
                  type: 'NODE',
                  id: 'rkv-xTDH5YiW',
                  label: '',
                  components: [{ type: 'SET', id: 'HyUWe6wr9KjZ', text: 'cunning %-70' }],
                  link: { type: 'GOTO', text: 'DisdainQuestion' },
                }],
              }],
            },
          }, {
            type: 'NODE',
            id: 'HyEMeawH9toZ',
            label: 'DisdainQuestion',
            components: [{
              type: 'COMMENT',
              id: 'rJiblTDHqYiW',
              text: 'disdain is the opposite of vigilant; only modify by %+ or %-',
            }, {
              type: 'TEXT',
              id: 'HynZeTPBctoZ',
              text: 'Do you disdain threats and insults that are beneath you, or are you vigilant\nagainst any slight or transgression?',
            }],
            link: {
              type: 'CHOICE',
              id: 'B1mfgTDr5tjW',
              block: [{
                type: 'CHOICE_ITEM',
                id: 'rk1fepvH9Fib',
                reuse: null,
                condition: null,
                text: 'Disdain: patience and scorn.',
                block: [{
                  type: 'NODE',
                  id: 'Hk0-eTwS5tjZ',
                  label: '',
                  components: [{ type: 'SET', id: 'r1pZl6wH5to-', text: 'disdain %+70' }],
                  link: { type: 'GOTO', text: 'FirstChoice' },
                }],
              }, {
                type: 'CHOICE_ITEM',
                id: 'ryzMlpPSqKsW',
                reuse: null,
                condition: null,
                text: 'Vigilance: attention and impulsiveness.',
                block: [{
                  type: 'NODE',
                  id: 'r1-MeaDrqtjW',
                  label: '',
                  components: [{ type: 'SET', id: 'BkxMx6DBctiW', text: 'disdain %-70' }],
                  link: { type: 'GOTO', text: 'FirstChoice' },
                }],
              }],
            },
          }, {
            type: 'NODE',
            id: 'BJmXgTvHcYs-',
            label: 'FirstChoice',
            components: [{
              type: 'COMMENT',
              id: 'rJSGgTwHqFjZ',
              text: 'Now we face some real choices to finish chargen and establish setting',
            }, {
              type: 'COMMENT',
              id: 'By8Gx6Dr9tjb',
              text: 'First choice trades off cunning vs. brutality',
            }, {
              type: 'TEXT',
              id: 'BkDGgpvr5Fs-',
              text: 'Now we\'re going to view some flashbacks to your days as a wyrmling.\n\nAs a young hatchling, you lived with your mother in a cave high up on a mountain.  Your mother had a vast hoard of treasure and a varied hunting range. Some of your siblings chose to spend much of their time reading the rare codices and scrolls your mother had collected.  Other siblings spent their time hunting dangerous game and brawling with each other.  Which pursuit did you prefer?\n',
            }],
            link: {
              type: 'CHOICE',
              id: 'SkGmx6DB5YiZ',
              block: [{
                type: 'CHOICE_ITEM',
                id: 'By3zx6wr5FjW',
                reuse: null,
                condition: null,
                text: 'Reading.',
                block: [{
                  type: 'NODE',
                  id: 'B1jMl6PHqFsZ',
                  label: '',
                  components: [{
                    type: 'TEXT',
                    id: 'BkdfxpDHcFsZ',
                    text: 'A wise choice that made you more Cunning and taught you Finesse.',
                  }, { type: 'SET', id: 'HyYMlaDS9KoW', text: 'cunning %+20' }, {
                    type: 'SET',
                    id: 'B1cGe6DrqYob',
                    text: 'brutality %-20',
                  }],
                  link: { type: 'GOTO', text: 'SecondChoice' },
                }],
              }, {
                type: 'CHOICE_ITEM',
                id: 'HJ-me6PrcYo-',
                reuse: null,
                condition: null,
                text: 'Hunting.',
                block: [{
                  type: 'NODE',
                  id: 'rJg7eaDSqFjb',
                  label: '',
                  components: [{
                    type: 'TEXT',
                    id: 'r16fg6vrcFjW',
                    text: 'You developed your muscles as you gloried in combat and the kill at\nthe end of the hunt.  Your brawls with your siblings also taught you the\nbasics of Honor. \n\nBrutality and Honor increase.',
                  }, { type: 'SET', id: 'rkAzlawHcKsb', text: 'cunning %-20' }, {
                    type: 'SET',
                    id: 'rkkQgTvHctjb',
                    text: 'brutality %+20',
                  }],
                  link: { type: 'GOTO', text: 'SecondChoice' },
                }],
              }],
            },
          }, {
            type: 'NODE',
            id: 'BJbVxavHqKi-',
            label: 'SecondChoice',
            components: [{
              type: 'COMMENT',
              id: 'r1EXl6wr5tsb',
              text: 'Second choice trades off cunning vs. disdain',
            }, {
              type: 'TEXT',
              id: 'rJHXxTDSqKob',
              text: 'As you reached maturity, you began to threaten your mother\'s dominance over her territory.  Before you could possibly have bested her in a direct confrontation, she threw you out of her lair and drove you from the lands in which you grew up, leaving you to fend for yourself without any resources beyond your claws, wings, and teeth. \n\nDid you seek revenge on her by turning some of the humans in her lands against her, or did you consider petty revenge beneath you?\n',
            }],
            link: {
              type: 'CHOICE',
              id: 'Bke4e6PS9KjW',
              block: [{
                type: 'CHOICE_ITEM',
                id: 'SkcQg6vS9KoW',
                reuse: null,
                condition: null,
                text: 'I sought revenge.',
                block: [{
                  type: 'NODE',
                  id: 'rJKXgTwHqYiZ',
                  label: '',
                  components: [{
                    type: 'TEXT',
                    id: 'S1LXgavrcKs-',
                    text: 'You were unable to truly threaten her, but you forced your mother to\nspend her time suppressing the revolts of human villages.  The dead    \nvillagers also provided her with no tribute, reducing the increase of her\nhoard.  Perhaps something more direct would be better as revenge. Still, a real\ngain nonetheless. \n\nCunning and Vigilance increase.',
                  }, { type: 'SET', id: 'SyPXgaDrqYob', text: 'cunning %+20' }, {
                    type: 'SET',
                    id: 'Skumlpwr9Ki-',
                    text: 'disdain %-20',
                  }],
                  link: { type: 'GOTO', text: 'ThirdChoice' },
                }],
              }, {
                type: 'CHOICE_ITEM',
                id: 'Hkk4g6wrcts-',
                reuse: null,
                condition: null,
                text: 'Revenge is beneath my dignity.',
                block: [{
                  type: 'NODE',
                  id: 'ryRmx6DSqYiW',
                  label: '',
                  components: [{
                    type: 'TEXT',
                    id: 'H1jmgaPB5Fob',
                    text: 'Disdain for petty matters is essential for a dragon, as it avoids the\npointless feuds that weaken you and allow your enemies to achieve great\ngoals. \n\nManipulating peasants is also not the most honorable of activities for a    \nmighty dragon such as yourself. \n\nYour wise choice increases Disdain and Honor.',
                  }, { type: 'SET', id: 'rknXe6vSqYib', text: 'cunning %-20' }, {
                    type: 'SET',
                    id: 'BJT7x6wSqKj-',
                    text: 'disdain %+20',
                  }],
                  link: { type: 'GOTO', text: 'ThirdChoice' },
                }],
              }],
            },
          }, {
            type: 'NODE',
            id: 'BJJSx6wB9Fsb',
            label: 'ThirdChoice',
            components: [{ type: 'COMMENT', id: 'HkfNlpDBcYjW', text: 'Trades off Disdain versus Brutality' }, {
              type: 'TEXT',
              id: 'SkQEl6vHqKib',
              text: 'After several days of flight, you came across a tiny halfling travelling through the desert.  Even from afar, your keen eyes detected the glint of gold and the sparkle of magic.  This halfling has some sort of magic golden shield strapped to his tiny back.\n\nYou knew immediately that this treasure must be yours.\n\nThe halfling was far from civilization and would almost surely die soon of thirst and starvation.  For the moment, he seemed to be protected by the power of the shield.\n\nDid you kill him on the spot, ignoring his magical protections, or did you hover nearby and wait for the halfling to die, knowing that you might lose the treasure?\n',
            }],
            link: {
              type: 'CHOICE',
              id: 'B10VxTvrctob',
              block: [{
                type: 'CHOICE_ITEM',
                id: 'ryd4xpwrqKiW',
                reuse: null,
                condition: null,
                text: 'I waited for him to die.',
                block: [{
                  type: 'NODE',
                  id: 'S1DElawHctiW',
                  label: '',
                  components: [{
                    type: 'TEXT',
                    id: 'BJ44laDSqto-',
                    text: 'There\'s no reason you have to do all the dirty work yourself.  A few hours later, the halfling stumbled, crawled for a while, and finally stopped.  You easily plucked the treasure off of his body, saving yourself quite a bit of work.\n\nDisdain and Finesse increase.',
                  }, { type: 'SET', id: 'S1rVe6wr9Kjb', text: 'brutality %-20' }, {
                    type: 'SET',
                    id: 'r18NlTPB9tjW',
                    text: 'disdain %+20',
                  }],
                  link: { type: 'GOTO', text: 'Axilmeus' },
                }],
              }, {
                type: 'CHOICE_ITEM',
                id: 'By6VgTvH5tiW',
                reuse: null,
                condition: null,
                text: 'I killed him on the spot.',
                block: [{
                  type: 'NODE',
                  id: 'HkhElaPS5KjZ',
                  label: '',
                  components: [{
                    type: 'TEXT',
                    id: 'HyK4g6vSqYib',
                    text: 'It wasn\'t easy; the shield protected him from fire and helped him evade your attacks.  Eventually you had to swallow him whole and cough up the shield.  That worked!\n\nBrutality and Vigilance increase.',
                  }, { type: 'SET', id: 'B154gpPr5Kjb', text: 'brutality %+20' }, {
                    type: 'SET',
                    id: 'ByjExTDBqFj-',
                    text: 'disdain %-20',
                  }],
                  link: { type: 'GOTO', text: 'Axilmeus' },
                }],
              }],
            },
          }, {
            type: 'NODE',
            id: 'B1bLlaDH9KsW',
            label: 'Axilmeus',
            components: [{ type: 'PAGE_BREAK', id: 'BygHx6vS9FsZ', text: '' }, {
              type: 'TEXT',
              id: 'Bk-BlaDH9KoW',
              text: 'One of your elder clutchmates was an overbearing brute named Axilmeus.  Axilmeus loved to torment the others, always seeking to seize what did not belong to him.\n\n"${name}," he said with a menacing grin, "give me that golden shield, or I will beat you within an inch of your life."\n',
            }],
            link: {
              type: 'CHOICE',
              id: 'rJl8gavr9Kib',
              block: [{
                type: 'CHOICE_ITEM',
                id: 'HkBSx6vB9KiZ',
                reuse: null,
                condition: null,
                text: ' I gave him the shield to avoid a fight.',
                block: [{
                  type: 'NODE',
                  id: 'HJNrgTDB9KiZ',
                  label: '',
                  components: [{ type: 'SET', id: 'HJGHxTDrqYsZ', text: 'disdain %+ 15' }, {
                    type: 'TEXT',
                    id: 'rymSeTwBqKjb',
                    text: 'Disdain increases.\n\nAxilmeus took your shield and beat you with it, hard.',
                  }],
                  link: { type: 'GOTO', text: 'ResolveAxilmeus' },
                }],
              }, {
                type: 'CHOICE_ITEM',
                id: 'ByqBepPS5YiW',
                reuse: null,
                condition: null,
                text: ' I dueled him for the shield.',
                block: [{
                  type: 'NODE',
                  id: 'rkKBlTwHctsb',
                  label: '',
                  components: [{ type: 'SET', id: 'Sy8Sg6DBqFib', text: 'brutality %+ 15' }, {
                    type: 'SET',
                    id: 'H1wrgpwBqFiZ',
                    text: 'cunning %- 15',
                  }, {
                    type: 'TEXT',
                    id: 'HkOHlTPH5Fj-',
                    text: 'Brutality and Honor increase.\n\nYou fought your hardest, but Axilmeus was a bit stronger than you; he pinned you to the ground and pried the shield out of your claws.',
                  }],
                  link: { type: 'GOTO', text: 'ResolveAxilmeus' },
                }],
              }, {
                type: 'CHOICE_ITEM',
                id: 'By1Lxawrcts-',
                reuse: null,
                condition: null,
                text: ' I evaded him and hid the shield.',
                block: [{
                  type: 'NODE',
                  id: 'rJABxawH5KoZ',
                  label: '',
                  components: [{ type: 'SET', id: 'Sksrl6wSqts-', text: 'brutality %- 15' }, {
                    type: 'SET',
                    id: 'Sk2Bg6Pr9KjZ',
                    text: 'cunning %+ 15',
                  }, {
                    type: 'TEXT',
                    id: 'BJpSxavSctsW',
                    text: 'Cunning and Finesse increase.\n\nUnfortunately, Axilmeus is your elder; at this age, he has the advantage in maneuverability.  He caught up to you quickly, pinning you to the ground and prying the shield out of your claws.',
                  }],
                  link: { type: 'GOTO', text: 'ResolveAxilmeus' },
                }],
              }],
            },
          }, {
            type: 'NODE',
            id: 'HJ7veavS5Fib',
            label: 'ResolveAxilmeus',
            components: [{
              type: 'TEXT',
              id: 'SkMUepvrqtiZ',
              text: 'Then he crushed the shield in his jaws, wasting the magical energies imbued within it, and spat it out at your feet.  He laughed with a great roar as he flew away.\n',
            }],
            link: {
              type: 'NODE_LINK',
              node: {
                type: 'NODE',
                id: 'HJfDeawS9Fsb',
                label: 'Wrapup',
                components: [{
                  type: 'COMMENT',
                  id: 'rJQUgTDr9tob',
                  text: '[We need to generate a starting Wealth somehow.  My current thought is',
                }, {
                  type: 'COMMENT',
                  id: 'HJ4UxaDrqtsb',
                  text: 'that we use a random number increased up by low Brutality, low Disdain,',
                }, { type: 'COMMENT', id: 'rJHUlaPHcKsW', text: 'and high Cunning. ' }, {
                  type: 'COMMENT',
                  id: 'SkULlpDH9to-',
                  text: 'But we could also tie it more specifically to the choices, or just go',
                }, {
                  type: 'COMMENT',
                  id: 'HJDUgpwHqYjb',
                  text: 'random, or whatever.]',
                }, { type: 'PAGE_BREAK', id: 'HJO8l6DH9ts-', text: '' }, {
                  type: 'TEXT',
                  id: 'BytLgTwH5Ys-',
                  text: 'You have the following stats:\n',
                }, {
                  type: 'STAT_CHART',
                  id: 'SJxwg6wH5Yob',
                  stats: [{
                    type: 'STAT_OPPOSED',
                    id: 'BJi8xpDH9Fib',
                    stat: 'Brutality',
                    name: 'Brutality',
                    opposed: 'Finesse',
                  }, {
                    type: 'STAT_OPPOSED',
                    id: 'rJnLx6wBqti-',
                    stat: 'Cunning',
                    name: 'Cunning',
                    opposed: 'Honor',
                  }, {
                    type: 'STAT_OPPOSED',
                    id: 'rJpUxTvr9Fs-',
                    stat: 'Disdain',
                    name: 'Disdain',
                    opposed: 'Vigilance',
                  }, { type: 'STAT_PERCENT', id: 'SyRUgpwB9Fob', text: 'Infamy' }, {
                    type: 'STAT_TEXT',
                    id: 'BJkwxTwH9FiW',
                    text: 'wealth_text Wealth',
                  }],
                }, { type: 'TEXT', id: 'HyWPx6PS9tob', text: '' }],
                link: { type: 'FINISH', text: 'Begin the Adventure' },
              },
            },
          }],
        },
      }];
    // const filtered = removeKeys(false, 'scene', 'error', 'tokens', 'indent')(removeKeys(true, 'id')({ ...parseResult }));
    const expected = [
      [
        {
          components: [
            {
              id: 'ByBgavrqtsZ',
              text: 'Let us begin.\n\nA knight charges up the slope at you.  His horse pounds at the ground, carrying the heavily armored warrior as if he were a child\'s doll.  The knight sets his lance to attack you.\n\nHow do you defend yourself, O mighty dragon?',
              type: 'TEXT',
            },
          ],
          id: 'rkcbavH9tiZ',
          label: '',
          link: {
            block: [
              {
                condition: null,
                id: 'r1teTDrqFjb',
                link: {
                  node: 'H1_eawSqFiZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'I take to the air with a quick beat of my wings.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'Hypx6vHqKo-',
                link: {
                  node: 'Hk3gaDSctib',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'I knock the knight from his horse with a slap of my tail.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'SybWpwr9Ys-',
                link: {
                  node: 'BklW6Pr9KiW',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'I rush into his charge and tear him to pieces with my claws.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'HkS-TDBctoZ',
                link: {
                  node: 'HyEbTDB5tiZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'A puff of my fiery breath should be enough for him.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: {
                  condition: '(choice_save_allowed)',
                  type: 'IF',
                },
                id: 'SyuZavH9KsZ',
                link: {
                  node: 'HJPWpvHctsZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Restore a saved game.',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'HkKW6PB9YiZ',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'HyLgTwSqYib',
              text: 'You leap to the air, deftly avoiding the knight\'s thrust.  Now that you are in the air, he hardly poses any threat at allâ€”not that he ever posed much of one to you.  You circle back and knock him off his horse with a swipe of your claw.\n',
              type: 'TEXT',
            },
            {
              id: 'ByPgpDHcYsW',
              text: 'brutality %-10',
              type: 'SET',
            },
          ],
          id: 'H1_eawSqFiZ',
          label: '',
          link: {
            node: 'Bk5G6wS5Fjb',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'S1qe6PBcFiW',
              text: 'You swing your mighty tail around and knock the knight flying.  While he struggles to stand, you break his horse\'s back and begin devouring it.\n',
              type: 'TEXT',
            },
            {
              id: 'HJjxawHqYjb',
              text: 'cunning %+10',
              type: 'SET',
            },
          ],
          id: 'Hk3gaDSctib',
          label: '',
          link: {
            node: 'Bk5G6wS5Fjb',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'HJClTvB5tj-',
              text: 'The knight\'s lance shatters against your nigh-impenetrable hide as you slam into him.  You yank him clean off his horse, slamming him to the ground and ripping his plate armor with your vicious claws.  The fight is over before it has begun. \n',
              type: 'TEXT',
            },
            {
              id: 'BykWTDr5Ki-',
              text: 'brutality %+10',
              type: 'SET',
            },
          ],
          id: 'BklW6Pr9KiW',
          label: '',
          link: {
            node: 'Bk5G6wS5Fjb',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'SyzZ6Pr9Kib',
              text: 'You let loose an inferno of fire.  The knight\'s horse is cooked nicely, and your stomach lets out a deafening rumble as the smell of roast destrier reaches your nostrils.  The knight himself staggers to his feet.  His armor managed to keep him alive, but only barely.\n',
              type: 'TEXT',
            },
            {
              id: 'Sy7-pPr5Fj-',
              text: 'disdain %+10',
              type: 'SET',
            },
          ],
          id: 'HyEbTDB5tiZ',
          label: '',
          link: {
            node: 'Bk5G6wS5Fjb',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'ByL-TwH5tjW',
              text: '*restore_game',
              type: 'TEXT',
            },
          ],
          id: 'HJPWpvHctsZ',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'rko-TwrctiW',
              text: 'Do you finish him off, victorious dragon?',
              type: 'TEXT',
            },
          ],
          id: 'Bk5G6wS5Fjb',
          label: 'Victory',
          link: {
            block: [
              {
                condition: null,
                id: 'S1yGpPB9Fjb',
                link: {
                  node: 'S1RbTvrqFjW',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Of course!  How dare he attack me?',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'Sk7MpvBcYjb',
                link: {
                  node: 'rkGMaPBqFsW',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'I let him live to warn others of my immense power.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'SyOfTwScKo-',
                link: {
                  node: 'SywGTPHqFjW',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Eh.  Now that the threat is ended, he is beneath my concern.',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'BkFzTDrcYob',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'HJ3-TDHqFiW',
              text: 'Your jaws crush him in a single bite.\n\nThat showed him.',
              type: 'TEXT',
            },
            {
              id: 'BJ6bTwBqKiZ',
              text: 'brutality %+10',
              type: 'SET',
            },
          ],
          id: 'S1RbTvrqFjW',
          label: '',
          link: {
            node: 'r1_NTDBcFs-',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'B1xfpvSqKoZ',
              text: '"Begone, petty human.  To attack me is to meet your doom," you growl.\n\nThe knight stumbles away as quickly as he can, not even daring to pretend that he could still fight you.',
              type: 'TEXT',
            },
            {
              id: 'BkZzaDHcYi-',
              text: 'infamy %+15',
              type: 'SET',
            },
          ],
          id: 'rkGMaPBqFsW',
          label: '',
          link: {
            node: 'r1_NTDBcFs-',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'r14zpwSqFo-',
              text: 'You leisurely eat the knight\'s horse.  He slinks away as quietly as he can.  (His heavy armor makes a stealthy escape impossible.)  Still, you pay him no mind as he leaves.\n',
              type: 'TEXT',
            },
            {
              id: 'BkSzpDScYoZ',
              text: 'infamy %+10',
              type: 'SET',
            },
            {
              id: 'SyIGawSqYiW',
              text: 'disdain %+10',
              type: 'SET',
            },
          ],
          id: 'SywGTPHqFjW',
          label: '',
          link: {
            node: 'r1_NTDBcFs-',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'rJjzaDBcFsb',
              text: 'You know, it\'s going to get annoying to keep calling you "great and mighty dragon."  What is your name?',
              type: 'TEXT',
            },
          ],
          id: 'r1_NTDBcFs-',
          label: 'Naming',
          link: {
            block: [
              {
                condition: null,
                id: 'rk0zpPSqKo-',
                link: {
                  node: 'SJazpPBqKsW',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Gorthalon.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'BJWm6DS9Yj-',
                link: {
                  node: 'BylQ6Pr9Kib',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Sssetheliss.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'HJEmaPB5Fjb',
                link: {
                  node: 'BJXm6PSqYib',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Calemvir.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'r1UNpwScts-',
                link: {
                  node: 'SkH4TDB9tob',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'These names are all terrible!',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'SkwVavBcto-',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'r13MTPBcYo-',
              text: 'name "Gorthalon"',
              type: 'SET',
            },
          ],
          id: 'SJazpPBqKsW',
          label: '',
          link: {
            node: 'SyxPTvBqKj-',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'rkkXawB5tj-',
              text: 'name "Sssetheliss"',
              type: 'SET',
            },
          ],
          id: 'BylQ6Pr9Kib',
          label: '',
          link: {
            node: 'SyxPTvBqKj-',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'ryzXawScKsZ',
              text: 'name "Calemvir"',
              type: 'SET',
            },
          ],
          id: 'BJXm6PSqYib',
          label: '',
          link: {
            node: 'SyxPTvBqKj-',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'HJBXTDB9toZ',
              text: 'Oh! Please forgive me.',
              type: 'TEXT',
            },
          ],
          id: 'SkH4TDB9tob',
          label: '',
          link: {
            node: {
              node: 'ByEETvB5KjZ',
              type: 'NODE_LINK',
            },
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'rJL76vHqto-',
              text: 'What name would you prefer?',
              type: 'TEXT',
            },
            {
              id: 'B1PXpDS9Kj-',
              text: 'name',
              type: 'INPUT_TEXT',
            },
            {
              id: 'S1dXTwH5toZ',
              text: 'check capitalization',
              type: 'COMMENT',
            },
          ],
          id: 'ByEETvB5KjZ',
          label: 'input_name',
          link: {
            condition: '("${name}" != "$!{name}")',
            elses: [],
            id: 'Bk74TDS9KsZ',
            link: {
              node: 'rJGVaPr5FiZ',
              type: 'NODE_LINK',
            },
            type: 'IF',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'BkFQavHqYo-',
              text: 'Your name is $!{name}, is that right?\n',
              type: 'TEXT',
            },
          ],
          id: 'rJGVaPr5FiZ',
          label: '',
          link: {
            block: [
              {
                condition: null,
                id: 'HJn7pwB5Kob',
                link: {
                  node: 'Byj7pwH5Ko-',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Yes.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'HyRmpvScFi-',
                link: {
                  node: 'HJ676wrqtsb',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'No, my name is ${name}, just as I said.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'ryl46DBqYjb',
                link: {
                  node: 'S11VpwSqYib',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Er, wait, let me try that again.',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'Bk-46Pr9FsW',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'ry97pPHqtjW',
              text: 'name "$!{name}"',
              type: 'SET',
            },
          ],
          id: 'Byj7pwH5Ko-',
          label: '',
          link: {
            node: 'SyxPTvBqKj-',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [],
          id: 'HJ676wrqtsb',
          label: '',
          link: {
            node: 'SyxPTvBqKj-',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [],
          id: 'S11VpwSqYib',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'Hkt4aPB9KiW',
              text: 'Will you be male or female?',
              type: 'TEXT',
            },
          ],
          id: 'SyxPTvBqKj-',
          label: 'gender',
          link: {
            block: [
              {
                condition: null,
                id: 'HyhVpDSqKj-',
                link: {
                  node: 'rJsVpvB9KiZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Male.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'S11B6wS9KjW',
                link: {
                  node: 'HJA4awS9KiZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Female.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'HJGBTvSctob',
                link: {
                  node: 'B1-BpwH5YjZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Neither.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'SJSSTvr9Fs-',
                link: {
                  node: 'rJVSTPrqFsb',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Unknown/undetermined.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'ryALaPBcKjb',
                link: {
                  node: 'HJpI6PScFsb',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Do not pester me with impudent questions!',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'HJkwTPr5KiZ',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'BJ54TPB9Ko-',
              text: 'gender "male"',
              type: 'SET',
            },
          ],
          id: 'rJsVpvB9KiZ',
          label: '',
          link: {
            node: 'HkrOavr9Fi-',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'SyaNTvHcKjZ',
              text: 'gender "female"',
              type: 'SET',
            },
          ],
          id: 'HJA4awS9KiZ',
          label: '',
          link: {
            node: 'HkrOavr9Fi-',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'BylBpPr9Fsb',
              text: 'gender "neither"',
              type: 'SET',
            },
          ],
          id: 'B1-BpwH5YjZ',
          label: '',
          link: {
            node: 'HkrOavr9Fi-',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'ryXH6PScKjb',
              text: 'gender "unknown"',
              type: 'SET',
            },
          ],
          id: 'rJVSTPrqFsb',
          label: '',
          link: {
            node: 'HkrOavr9Fi-',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'HJUHpvrctjW',
              text: 'brutality %+ 15',
              type: 'SET',
            },
            {
              id: 'S1DSTPB5YiZ',
              text: 'I, ah, I mean, yes!  Of course!  How churlish of me.\n\nBut, O mighty ${name}, I feel I should let you know that this game is full of choices; indeed, it is nothing but multiple choice questions that determine the course of your adventures as a dragon.  If you don\'t enjoy answering questions, this game may not be for you!\n\nDo youâ€¦I mean, if I may, would you like to specify your gender after all?\n',
              type: 'TEXT',
            },
          ],
          id: 'HJpI6PScFsb',
          label: '',
          link: {
            block: [
              {
                condition: null,
                id: 'Syw8pwScYiZ',
                link: {
                  node: 'r1LL6wSqYsZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Very well.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'B1jUTDScKoW',
                link: {
                  node: 'S198TDr5YoZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'I said no.',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'SJ2UaDScYob',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'HJdBavB5FsW',
              text: 'Excellent choice!  What gender will you be?\n',
              type: 'TEXT',
            },
          ],
          id: 'r1LL6wSqYsZ',
          label: '',
          link: {
            block: [
              {
                condition: null,
                id: 'S1jBpPS9tsb',
                link: {
                  node: 'HkqBpvrqKs-',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Male.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'SJRSpDH5Yib',
                link: {
                  node: 'HkTS6DrqYjb',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Female.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'rJb8TPB9Ys-',
                link: {
                  node: 'SJgL6vH5tsW',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Neither.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'rkNLTDHcYib',
                link: {
                  node: 'SyXLpwBqFiZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Unknown/undetermined.',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'rJrUpwBqFib',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'HyKH6DrqFjb',
              text: 'gender "male"',
              type: 'SET',
            },
          ],
          id: 'HkqBpvrqKs-',
          label: '',
          link: {
            node: 'HkrOavr9Fi-',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'ry3rpDr9KiW',
              text: 'gender "female"',
              type: 'SET',
            },
          ],
          id: 'HkTS6DrqYjb',
          label: '',
          link: {
            node: 'HkrOavr9Fi-',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'rkk8avr9Yi-',
              text: 'gender "neither"',
              type: 'SET',
            },
          ],
          id: 'SJgL6vH5tsW',
          label: '',
          link: {
            node: 'HkrOavr9Fi-',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'B1GUaDB9KjZ',
              text: 'gender "unknown"',
              type: 'SET',
            },
          ],
          id: 'SyXLpwBqFiZ',
          label: '',
          link: {
            node: 'HkrOavr9Fi-',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'HydIavrcFoZ',
              text: 'gender "unknown"',
              type: 'SET',
            },
            {
              id: 'HkF8pDH9YiW',
              text: 'Well, let\'s just leave it undetermined, then!',
              type: 'TEXT',
            },
          ],
          id: 'S198TDr5YoZ',
          label: '',
          link: {
            node: 'HkrOavr9Fi-',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'SyZvpvSqKsb',
              text: 'As you think about it, the knight\'s attack was probably inevitable.  After all, you did just kidnap the princess from right out of her tower.  Althoughâ€¦\n\nIsn\'t it a little sexist to always kidnap princesses?',
              type: 'TEXT',
            },
          ],
          id: 'HkrOavr9Fi-',
          label: 'Princess',
          link: {
            block: [
              {
                condition: null,
                id: 'HJDP6DH9tsW',
                link: {
                  node: 'rkIvaDBcKsZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Maybe, but tradition demands that dragons kidnap princesses, even if that is sexist.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'S1sDaPHqFib',
                link: {
                  node: 'B19PawScKiW',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'You dare question my actions?',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'B1ydTDr5tjb',
                link: {
                  node: 'Sy0DTwH5tsW',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'You know, I never thought about that before.  In fact, I think I kidnapped a prince, just to avoid being sexist.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'H17OpDrqYsZ',
                link: {
                  node: 'rJzOavHqKob',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'I\'ll have you know that I make a careful point of alternating between princes and princesses, but it happened to be time for a princess.',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'rkN_pvBcFiW',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'ryEwTDrqKoW',
              text: 'I guess you\'re right.\n\nAnyway, as you ripped the roof off her tower, the light glistened off yourâ€¦',
              type: 'TEXT',
            },
            {
              id: 'HJSDTvSqKoW',
              text: 'royal "princess"',
              type: 'SET',
            },
          ],
          id: 'rkIvaDBcKsZ',
          label: '',
          link: {
            node: 'r1LKpvrqtiZ',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'S1uPTvr5Fob',
              text: 'No, no!  Of course not.  I just wanted toâ€”I meanâ€”What I\'m trying to say isâ€¦\n\nLet\'s just move on.\n\nAnyway, as you ripped the roof off her tower, the light glistened off yourâ€¦',
              type: 'TEXT',
            },
            {
              id: 'rkYwavr9Kob',
              text: 'royal "princess"',
              type: 'SET',
            },
          ],
          id: 'B19PawScKiW',
          label: '',
          link: {
            node: 'r1LKpvrqtiZ',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'S1hDTPrcKjb',
              text: 'Right you are.  As I was saying, the knight\'s attack was probably inevitable.  After all, you did just kidnap the prince \nfrom right out of his tower.  As you ripped the roof off his tower, the light glistened off yourâ€¦',
              type: 'TEXT',
            },
            {
              id: 'Sk6PTDS5Ko-',
              text: 'royal "prince"',
              type: 'SET',
            },
          ],
          id: 'Sy0DTwH5tsW',
          label: '',
          link: {
            node: 'r1LKpvrqtiZ',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'B1ed6PB9tsb',
              text: 'Of course.  I\'m sorry for questioning you.\n\nAnyway, as you ripped the roof off her tower, the light glistened off yourâ€¦',
              type: 'TEXT',
            },
            {
              id: 'rJbOawSqYob',
              text: 'royal "princess"',
              type: 'SET',
            },
          ],
          id: 'rJzOavHqKob',
          label: '',
          link: {
            node: 'r1LKpvrqtiZ',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [],
          id: 'r1LKpvrqtiZ',
          label: 'color',
          link: {
            condition: '(royal="princess")',
            elses: [
              {
                link: {
                  id: 'HJEKTvrqKi-',
                  link: {
                    node: 'S1mtavSqFib',
                    type: 'NODE_LINK',
                  },
                  type: 'ELSE',
                },
                nodes: [
                  {
                    components: [
                      {
                        id: 'rJ1tpwB5Ys-',
                        text: 'royal_him "him"',
                        type: 'SET',
                      },
                      {
                        id: 'SJlFaDB5to-',
                        text: 'royal_his "his"',
                        type: 'SET',
                      },
                      {
                        id: 'HkbF6wH5tjW',
                        text: 'royal_she "he"',
                        type: 'SET',
                      },
                      {
                        id: 'SJMY6wS5Fjb',
                        text: 'royals "princes"',
                        type: 'SET',
                      },
                    ],
                    id: 'S1mtavSqFib',
                    label: '',
                    link: {
                      text: 'A',
                      type: 'GOTO',
                    },
                    type: 'NODE',
                  },
                ],
              },
            ],
            id: 'SySYawBcKjb',
            link: {
              node: 'HkAO6DrctiZ',
              type: 'NODE_LINK',
            },
            type: 'IF',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'Skc_6PHcYib',
              text: 'royal_him "her"',
              type: 'SET',
            },
            {
              id: 'rJsdTPSqtib',
              text: 'royal_his "her"',
              type: 'SET',
            },
            {
              id: 'Hkh_awB9Yo-',
              text: 'royal_she "she"',
              type: 'SET',
            },
            {
              id: 'Hy6uavrqFsW',
              text: 'royals "princesses"',
              type: 'SET',
            },
          ],
          id: 'HkAO6DrctiZ',
          label: '',
          link: {
            node: 'S1do6vH9KoW',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'BkDF6DS9Kob',
              text: 'Ah, would you like to specify the color of your hide?  I wasn\'t sure which color to put in that description.\n',
              type: 'TEXT',
            },
          ],
          id: 'S1do6vH9KoW',
          label: 'A',
          link: {
            block: [
              {
                condition: null,
                id: 'HkCF6PBcYib',
                link: {
                  node: 'HkpKaPrqKsZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Can we just get on to the smashing?',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'Sybc6vH9Yi-',
                link: {
                  node: 'HJlqaDScYsZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Black.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'ByNcavB9Yo-',
                link: {
                  node: 'H1Q96DH9YsW',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Blue.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'SyDcTDH9Ysb',
                link: {
                  node: 'SkI9avBctib',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Brown.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'ryc96wB5KjZ',
                link: {
                  node: 'ryKcawr9Fjb',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Gold.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'HJaq6vHctsW',
                link: {
                  node: 'H1ncavSqFs-',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Green.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'BJgi6Dr9Fo-',
                link: {
                  node: 'HyJoTwrqKsb',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Iridescent.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'rkmoawB9FiW',
                link: {
                  node: 'rJzo6vrcYiZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Red.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'BkLsTDr9tj-',
                link: {
                  node: 'SkSo6Pr9Fj-',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'White.',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'HkDiaPB9Yjb',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'SJ9t6PH5Kj-',
              text: 'brutality %+ 30',
              type: 'SET',
            },
            {
              id: 'SJiK6vH5tjb',
              text: 'yes, of course!  Your wish is my command.\n\nOn with the show!\n',
              type: 'TEXT',
            },
            {
              id: 'rJ3FTwB5Yob',
              text: '',
              type: 'PAGE_BREAK',
            },
          ],
          id: 'HkpKaPrqKsZ',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'B1yqTPHctib',
              text: 'color "black"',
              type: 'SET',
            },
          ],
          id: 'HJlqaDScYsZ',
          label: '',
          link: {
            node: 'BJrDe6wBqFoZ',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'SJz5avBqtib',
              text: 'color "blue"',
              type: 'SET',
            },
          ],
          id: 'H1Q96DH9YsW',
          label: '',
          link: {
            node: 'BJrDe6wBqFoZ',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'SJrcawS9ti-',
              text: 'color "brown"',
              type: 'SET',
            },
          ],
          id: 'SkI9avBctib',
          label: '',
          link: {
            node: 'BJrDe6wBqFoZ',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'SJO9pPS5Yj-',
              text: 'color "golden"',
              type: 'SET',
            },
          ],
          id: 'ryKcawr9Fjb',
          label: '',
          link: {
            node: 'BJrDe6wBqFoZ',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'S1iqaPH5to-',
              text: 'color "green"',
              type: 'SET',
            },
          ],
          id: 'H1ncavSqFs-',
          label: '',
          link: {
            node: 'BJrDe6wBqFoZ',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'rJ0qpPr9Fsb',
              text: 'color "iridescent"',
              type: 'SET',
            },
          ],
          id: 'HyJoTwrqKsb',
          label: '',
          link: {
            node: 'BJrDe6wBqFoZ',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'SJboavrqYjb',
              text: 'color "red"',
              type: 'SET',
            },
          ],
          id: 'rJzo6vrcYiZ',
          label: '',
          link: {
            node: 'BJrDe6wBqFoZ',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'S14oaPH5tsZ',
              text: 'color "white"',
              type: 'SET',
            },
          ],
          id: 'SkSo6Pr9Fj-',
          label: '',
          link: {
            node: 'BJrDe6wBqFoZ',
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'rytopvSqYsb',
              text: 'Wonderful choice.  So the light glistened off your ${color} hide, as you snatched the ${royal} out of ${royal_his} tower.\n\nWhile we\'re on the subject, let\'s settle a few other details.  How many limbs will you have, not counting your wings or tail?\n',
              type: 'TEXT',
            },
          ],
          id: 'BJrDe6wBqFoZ',
          label: 'limbs',
          link: {
            choices: [
              {
                block: null,
                condition: null,
                id: 'S19sTPBcFsZ',
                reuse: null,
                text: 'Four.',
                type: 'FAKE_CHOICE_ITEM',
              },
              {
                block: null,
                condition: null,
                id: 'r1ijavB5Ys-',
                reuse: null,
                text: 'Five.',
                type: 'FAKE_CHOICE_ITEM',
              },
              {
                block: null,
                condition: null,
                id: 'By3j6wScKjb',
                reuse: null,
                text: 'Six.',
                type: 'FAKE_CHOICE_ITEM',
              },
              {
                block: null,
                condition: null,
                id: 'r16s6PHqto-',
                reuse: null,
                text: 'Eight.',
                type: 'FAKE_CHOICE_ITEM',
              },
            ],
            id: 'SkNwxTPHcKjW',
            link: {
              type: 'NODE_LINK',
            },
            type: 'FAKE_CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'rk0o6DBqFo-',
              text: 'Hmm.  Is the top of your head ridged or smooth?',
              type: 'TEXT',
            },
          ],
          id: 'Sk_3avSqtsW',
          label: '',
          link: {
            block: [
              {
                condition: null,
                id: 'HJX3avB5KjZ',
                link: {
                  node: 'BkGhaDB9Fs-',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Ridged.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'S18naDr9YjZ',
                link: {
                  node: 'r1SnaDSqYiZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Smooth.',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'H1w3avH5YiZ',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'rJZhTDBqKi-',
              text: 'head "ridged"',
              type: 'SET',
            },
          ],
          id: 'BkGhaDB9Fs-',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'Hk43TPS5KoW',
              text: 'head "smooth"',
              type: 'SET',
            },
          ],
          id: 'r1SnaDSqYiZ',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'HktnaDHqKoZ',
              text: 'I see.  And your wingsâ€”feathery, leathery, or scaly?\n',
              type: 'TEXT',
            },
          ],
          id: 'r1ITTDH5KsZ',
          label: 'wings',
          link: {
            block: [
              {
                condition: null,
                id: 'Hy02pwS5tj-',
                link: {
                  node: 'S1pn6vB5Ks-',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Feathery.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'Sk-66DrqKsb',
                link: {
                  node: 'Syl66vr9ti-',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Leathery.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'ry466vBqtsb',
                link: {
                  node: 'BkXT6wSqKib',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Scaly.',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'B1rp6DSqYoZ',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'Sy23aDS5Yo-',
              text: 'wings "feathery"',
              type: 'SET',
            },
          ],
          id: 'S1pn6vB5Ks-',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'S1yapwSqFiZ',
              text: 'wings "leathery"',
              type: 'SET',
            },
          ],
          id: 'Syl66vr9ti-',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'HyGapwSqYsW',
              text: 'wings "scaly"',
              type: 'SET',
            },
          ],
          id: 'BkXT6wSqKib',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'B1wp6PBqtob',
              text: 'As you kidnapped the ${royal}, you beat your ${wings} ${color} wings and flew off into the night, as ${royal_she} clutched tightly to your ${head} scalp to avoid plummeting to ${royal_his} doom.\n',
              type: 'TEXT',
            },
          ],
          id: 'HJylg6vHqKi-',
          label: 'Summary',
          link: {
            node: {
              node: 'r1RkgaPScKiZ',
              type: 'NODE_LINK',
            },
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'BJOT6vBcFob',
              text: 'What are you planning on doing with the ${royal}, anyway?',
              type: 'TEXT',
            },
          ],
          id: 'r1RkgaPScKiZ',
          label: 'RoyalResolution',
          link: {
            block: [
              {
                condition: null,
                id: 'B1_CpwH5Yob',
                link: {
                  node: 'rkP0avS5to-',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'It\'s all about companionship and good conversation.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'H150pwBqFsb',
                link: {
                  node: 'r1FCpvHqKjb',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'I\'ll keep ${royal_him} around for a little while to lure in more knights, but then ${royal_she}\'s dinner.  It\'s a little known fact that ${royals} taste better than most humans.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'rynklTvBqts-',
                link: {
                  node: 'ByoJxawr5Ks-',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'It\'s all about the ransom payments.  Those are a quick and easy way to build a hoard.',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'BkpygTPS5KoW',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'rytaawHcKiZ',
              text: 'Life can be lonely as a dragon, and interesting conversation is at a premium.  The elite upbringing of royalty makes them more suitable for entertaining dragons.\n\nBut what do you do after you tire of ${royal_his} conversation?',
              type: 'TEXT',
            },
          ],
          id: 'rkP0avS5to-',
          label: '',
          link: {
            block: [
              {
                condition: null,
                id: 'SkkRpDrcKo-',
                link: {
                  node: 'ryRppvB9YjZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Then it\'s time for a royal feastâ€”by which I mean I eat ${royal_him}.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'HJr0pPrqtiZ',
                link: {
                  node: 'ByVCpvrqFo-',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'I let ${royal_him} slip away, pretending not to notice ${royal_his} escape plan.',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'B1LATwS5tsZ',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'HJ9ppDB9Fib',
              text: 'The ${royal}\'s efforts to entertain you with ${royal_his} stories, harp-playing, and singing become more desperate as your boredom becomes more apparent.  But even ${royal_his} best efforts are not enough, and you devour ${royal_him} without remorse.\n',
              type: 'TEXT',
            },
            {
              id: 'SJoppDr5ts-',
              text: 'brutality %+10',
              type: 'SET',
            },
            {
              id: 'HJhpaPSqFjZ',
              text: 'cunning %+10',
              type: 'SET',
            },
            {
              id: 'H1TaTDr9KoZ',
              text: 'infamy %+10',
              type: 'SET',
            },
          ],
          id: 'ryRppvB9YjZ',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'BkeRpvSqYoW',
              text: 'The ${royal} becomes gradually more fearful as ${royal_his} stories, harp-playing, and singing amuse you less each passing day.  One evening, as you pretend to sleep, ${royal_she} makes a break for it.  You are well aware of ${royal_his} departure and could catch ${royal_him} easily, but you let ${royal_him} go.  $!{Royal_She} made several months more interesting, and that\'s\nworth sparing ${royal_his} life.',
              type: 'TEXT',
            },
            {
              id: 'SyWA6wH5Ys-',
              text: 'brutality %-10',
              type: 'SET',
            },
            {
              id: 'BkMRTvHcFob',
              text: 'cunning %-10',
              type: 'SET',
            },
            {
              id: 'SkXApvB5KiZ',
              text: 'infamy %-10',
              type: 'SET',
            },
          ],
          id: 'ByVCpvrqFo-',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [],
          id: 'r1FCpvHqKjb',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'B1iCawB5Ysb',
              text: 'Indeed.  Within a month, a large chest of gold comes to pay for the ${royal}\'s release.',
              type: 'TEXT',
            },
            {
              id: 'rk20pPBcKjW',
              text: 'wealth +1500',
              type: 'SET',
            },
            {
              id: 'Syp0avBqKj-',
              text: 'What do you do then?',
              type: 'TEXT',
            },
          ],
          id: 'ByoJxawr5Ks-',
          label: '',
          link: {
            block: [
              {
                condition: null,
                id: 'SkmyxawrcKsW',
                link: {
                  node: 'BJfJlpvrcti-',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Honor demands that I carry out my end of the bargain.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'S1Ykg6DBqtob',
                link: {
                  node: 'rkO1x6vrcKob',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Once I have the payment, I have no reason to delay my dinner.',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'H15yeTwHqKs-',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'BkACTDB9Fi-',
              text: 'Of course.  No sooner have you received the payment than you let the ${royal} go.',
              type: 'TEXT',
            },
            {
              id: 'S1ykgTvBcFoZ',
              text: 'cunning %-20',
              type: 'SET',
            },
            {
              id: 'S1x1gpvB9YoZ',
              text: 'brutality %-10',
              type: 'SET',
            },
            {
              id: 'BJZ1x6wr5YiW',
              text: 'infamy %-10',
              type: 'SET',
            },
          ],
          id: 'BJfJlpvrcti-',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'BkNJeTvScYoZ',
              text: 'Crunch, munch.  Delicious.\n',
              type: 'TEXT',
            },
            {
              id: 'ByrJlTDS9KoZ',
              text: 'cunning %+20',
              type: 'SET',
            },
            {
              id: 'ryLye6DHqKoZ',
              text: 'brutality %+10',
              type: 'SET',
            },
            {
              id: 'HJDJeTPSqYj-',
              text: 'infamy %+10',
              type: 'SET',
            },
          ],
          id: 'rkO1x6vrcKob',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'r1egx6DHqFjW',
              text: 'It must be the diet.  In any event, you have a delightful dinner of roast ${royal}.',
              type: 'TEXT',
            },
            {
              id: 'Sy-egpDHqFo-',
              text: 'brutality %+10',
              type: 'SET',
            },
            {
              id: 'ByMgg6vrcYib',
              text: 'infamy %+10',
              type: 'SET',
            },
          ],
          id: 'Sk7llTDBctsW',
          label: 'EatHer',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'S1VlgpDH5Fob',
              text: '',
              type: 'PAGE_BREAK',
            },
            {
              id: 'rkBllpvBqtsb',
              text: 'This would be a good time to talk a little more about your personality.\n\nAll dragons can be described in terms of a handful of characteristics, each in opposed pairs:  Brutality and Finesse, Cunning and Honor, Disdain and Vigilance.\n',
              type: 'TEXT',
            },
            {
              id: 'SyIlgavrqtj-',
              text: 'We start with the basic dichotomies between the paired attributes',
              type: 'COMMENT',
            },
            {
              id: 'rywll6Dr9Kib',
              text: 'brutality is the opposite of finesse; only modify by %+ or %-',
              type: 'COMMENT',
            },
            {
              id: 'rkdglpDrqtsb',
              text: 'Are you more notable for your Brutality or your Finesse?',
              type: 'TEXT',
            },
          ],
          id: 'HkeZeavH5tob',
          label: 'personality',
          link: {
            block: [
              {
                condition: null,
                id: 'ryslgaDScYob',
                link: {
                  node: 'H19xgavHctob',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Brutality: strength and cruelty.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'BkCelTDHqFsb',
                link: {
                  node: 'SkpxgpDB9KoW',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Finesse: precision and aerial maneuverability.',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'HJ1-gTPH5YiZ',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'B1Kee6wS5Ks-',
              text: 'brutality %+70',
              type: 'SET',
            },
          ],
          id: 'H19xgavHctob',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'SyhxeTPSqtib',
              text: 'brutality %-70',
              type: 'SET',
            },
          ],
          id: 'SkpxgpDB9KoW',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'H1-ZepPr9YsZ',
              text: 'cunning is the opposite of honorable; only modified by %+ or %-',
              type: 'COMMENT',
            },
            {
              id: 'BJzZl6PrqYib',
              text: 'Do you have more Cunning or Honor?',
              type: 'TEXT',
            },
          ],
          id: 'rk5ZlpwHqYoW',
          label: 'CunningQuestion',
          link: {
            block: [
              {
                condition: null,
                id: 'HkS-xTwr9tj-',
                link: {
                  node: 'H1Vbl6DHqKoZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Cunning: intelligence and trickery.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'Hy_beTDScYoW',
                link: {
                  node: 'rkv-xTDH5YiW',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Honor: honesty and trustworthiness.',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'S1KbgavScFoZ',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'BJQ-xTvrcFs-',
              text: 'cunning %+70',
              type: 'SET',
            },
          ],
          id: 'H1Vbl6DHqKoZ',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'HyUWe6wr9KjZ',
              text: 'cunning %-70',
              type: 'SET',
            },
          ],
          id: 'rkv-xTDH5YiW',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'rJiblTDHqYiW',
              text: 'disdain is the opposite of vigilant; only modify by %+ or %-',
              type: 'COMMENT',
            },
            {
              id: 'HynZeTPBctoZ',
              text: 'Do you disdain threats and insults that are beneath you, or are you vigilant\nagainst any slight or transgression?',
              type: 'TEXT',
            },
          ],
          id: 'HyEMeawH9toZ',
          label: 'DisdainQuestion',
          link: {
            block: [
              {
                condition: null,
                id: 'rk1fepvH9Fib',
                link: {
                  node: 'Hk0-eTwS5tjZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Disdain: patience and scorn.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'ryzMlpPSqKsW',
                link: {
                  node: 'r1-MeaDrqtjW',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Vigilance: attention and impulsiveness.',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'B1mfgTDr5tjW',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'r1pZl6wH5to-',
              text: 'disdain %+70',
              type: 'SET',
            },
          ],
          id: 'Hk0-eTwS5tjZ',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'BkxMx6DBctiW',
              text: 'disdain %-70',
              type: 'SET',
            },
          ],
          id: 'r1-MeaDrqtjW',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'rJSGgTwHqFjZ',
              text: 'Now we face some real choices to finish chargen and establish setting',
              type: 'COMMENT',
            },
            {
              id: 'By8Gx6Dr9tjb',
              text: 'First choice trades off cunning vs. brutality',
              type: 'COMMENT',
            },
            {
              id: 'BkDGgpvr5Fs-',
              text: 'Now we\'re going to view some flashbacks to your days as a wyrmling.\n\nAs a young hatchling, you lived with your mother in a cave high up on a mountain.  Your mother had a vast hoard of treasure and a varied hunting range. Some of your siblings chose to spend much of their time reading the rare codices and scrolls your mother had collected.  Other siblings spent their time hunting dangerous game and brawling with each other.  Which pursuit did you prefer?\n',
              type: 'TEXT',
            },
          ],
          id: 'BJmXgTvHcYs-',
          label: 'FirstChoice',
          link: {
            block: [
              {
                condition: null,
                id: 'By3zx6wr5FjW',
                link: {
                  node: 'B1jMl6PHqFsZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Reading.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'HJ-me6PrcYo-',
                link: {
                  node: 'rJg7eaDSqFjb',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Hunting.',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'SkGmx6DB5YiZ',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'BkdfxpDHcFsZ',
              text: 'A wise choice that made you more Cunning and taught you Finesse.',
              type: 'TEXT',
            },
            {
              id: 'HyYMlaDS9KoW',
              text: 'cunning %+20',
              type: 'SET',
            },
            {
              id: 'B1cGe6DrqYob',
              text: 'brutality %-20',
              type: 'SET',
            },
          ],
          id: 'B1jMl6PHqFsZ',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'r16fg6vrcFjW',
              text: 'You developed your muscles as you gloried in combat and the kill at\nthe end of the hunt.  Your brawls with your siblings also taught you the\nbasics of Honor. \n\nBrutality and Honor increase.',
              type: 'TEXT',
            },
            {
              id: 'rkAzlawHcKsb',
              text: 'cunning %-20',
              type: 'SET',
            },
            {
              id: 'rkkQgTvHctjb',
              text: 'brutality %+20',
              type: 'SET',
            },
          ],
          id: 'rJg7eaDSqFjb',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'r1EXl6wr5tsb',
              text: 'Second choice trades off cunning vs. disdain',
              type: 'COMMENT',
            },
            {
              id: 'rJHXxTDSqKob',
              text: 'As you reached maturity, you began to threaten your mother\'s dominance over her territory.  Before you could possibly have bested her in a direct confrontation, she threw you out of her lair and drove you from the lands in which you grew up, leaving you to fend for yourself without any resources beyond your claws, wings, and teeth. \n\nDid you seek revenge on her by turning some of the humans in her lands against her, or did you consider petty revenge beneath you?\n',
              type: 'TEXT',
            },
          ],
          id: 'BJbVxavHqKi-',
          label: 'SecondChoice',
          link: {
            block: [
              {
                condition: null,
                id: 'SkcQg6vS9KoW',
                link: {
                  node: 'rJKXgTwHqYiZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'I sought revenge.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'Hkk4g6wrcts-',
                link: {
                  node: 'ryRmx6DSqYiW',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'Revenge is beneath my dignity.',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'Bke4e6PS9KjW',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'S1LXgavrcKs-',
              text: 'You were unable to truly threaten her, but you forced your mother to\nspend her time suppressing the revolts of human villages.  The dead    \nvillagers also provided her with no tribute, reducing the increase of her\nhoard.  Perhaps something more direct would be better as revenge. Still, a real\ngain nonetheless. \n\nCunning and Vigilance increase.',
              type: 'TEXT',
            },
            {
              id: 'SyPXgaDrqYob',
              text: 'cunning %+20',
              type: 'SET',
            },
            {
              id: 'Skumlpwr9Ki-',
              text: 'disdain %-20',
              type: 'SET',
            },
          ],
          id: 'rJKXgTwHqYiZ',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'H1jmgaPB5Fob',
              text: 'Disdain for petty matters is essential for a dragon, as it avoids the\npointless feuds that weaken you and allow your enemies to achieve great\ngoals. \n\nManipulating peasants is also not the most honorable of activities for a    \nmighty dragon such as yourself. \n\nYour wise choice increases Disdain and Honor.',
              type: 'TEXT',
            },
            {
              id: 'rknXe6vSqYib',
              text: 'cunning %-20',
              type: 'SET',
            },
            {
              id: 'BJT7x6wSqKj-',
              text: 'disdain %+20',
              type: 'SET',
            },
          ],
          id: 'ryRmx6DSqYiW',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'HkfNlpDBcYjW',
              text: 'Trades off Disdain versus Brutality',
              type: 'COMMENT',
            },
            {
              id: 'SkQEl6vHqKib',
              text: 'After several days of flight, you came across a tiny halfling travelling through the desert.  Even from afar, your keen eyes detected the glint of gold and the sparkle of magic.  This halfling has some sort of magic golden shield strapped to his tiny back.\n\nYou knew immediately that this treasure must be yours.\n\nThe halfling was far from civilization and would almost surely die soon of thirst and starvation.  For the moment, he seemed to be protected by the power of the shield.\n\nDid you kill him on the spot, ignoring his magical protections, or did you hover nearby and wait for the halfling to die, knowing that you might lose the treasure?\n',
              type: 'TEXT',
            },
          ],
          id: 'BJJSx6wB9Fsb',
          label: 'ThirdChoice',
          link: {
            block: [
              {
                condition: null,
                id: 'ryd4xpwrqKiW',
                link: {
                  node: 'S1DElawHctiW',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'I waited for him to die.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'By6VgTvH5tiW',
                link: {
                  node: 'HkhElaPS5KjZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: 'I killed him on the spot.',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'B10VxTvrctob',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'BJ44laDSqto-',
              text: 'There\'s no reason you have to do all the dirty work yourself.  A few hours later, the halfling stumbled, crawled for a while, and finally stopped.  You easily plucked the treasure off of his body, saving yourself quite a bit of work.\n\nDisdain and Finesse increase.',
              type: 'TEXT',
            },
            {
              id: 'S1rVe6wr9Kjb',
              text: 'brutality %-20',
              type: 'SET',
            },
            {
              id: 'r18NlTPB9tjW',
              text: 'disdain %+20',
              type: 'SET',
            },
          ],
          id: 'S1DElawHctiW',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'HyK4g6vSqYib',
              text: 'It wasn\'t easy; the shield protected him from fire and helped him evade your attacks.  Eventually you had to swallow him whole and cough up the shield.  That worked!\n\nBrutality and Vigilance increase.',
              type: 'TEXT',
            },
            {
              id: 'B154gpPr5Kjb',
              text: 'brutality %+20',
              type: 'SET',
            },
            {
              id: 'ByjExTDBqFj-',
              text: 'disdain %-20',
              type: 'SET',
            },
          ],
          id: 'HkhElaPS5KjZ',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'BygHx6vS9FsZ',
              text: '',
              type: 'PAGE_BREAK',
            },
            {
              id: 'Bk-BlaDH9KoW',
              text: 'One of your elder clutchmates was an overbearing brute named Axilmeus.  Axilmeus loved to torment the others, always seeking to seize what did not belong to him.\n\n"${name}," he said with a menacing grin, "give me that golden shield, or I will beat you within an inch of your life."\n',
              type: 'TEXT',
            },
          ],
          id: 'B1bLlaDH9KsW',
          label: 'Axilmeus',
          link: {
            block: [
              {
                condition: null,
                id: 'HkBSx6vB9KiZ',
                link: {
                  node: 'HJNrgTDB9KiZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: ' I gave him the shield to avoid a fight.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'ByqBepPS5YiW',
                link: {
                  node: 'rkKBlTwHctsb',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: ' I dueled him for the shield.',
                type: 'CHOICE_ITEM',
              },
              {
                condition: null,
                id: 'By1Lxawrcts-',
                link: {
                  node: 'rJABxawH5KoZ',
                  type: 'NODE_LINK',
                },
                reuse: null,
                text: ' I evaded him and hid the shield.',
                type: 'CHOICE_ITEM',
              },
            ],
            id: 'rJl8gavr9Kib',
            type: 'CHOICE',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'HJGHxTDrqYsZ',
              text: 'disdain %+ 15',
              type: 'SET',
            },
            {
              id: 'rymSeTwBqKjb',
              text: 'Disdain increases.\n\nAxilmeus took your shield and beat you with it, hard.',
              type: 'TEXT',
            },
          ],
          id: 'HJNrgTDB9KiZ',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'Sy8Sg6DBqFib',
              text: 'brutality %+ 15',
              type: 'SET',
            },
            {
              id: 'H1wrgpwBqFiZ',
              text: 'cunning %- 15',
              type: 'SET',
            },
            {
              id: 'HkOHlTPH5Fj-',
              text: 'Brutality and Honor increase.\n\nYou fought your hardest, but Axilmeus was a bit stronger than you; he pinned you to the ground and pried the shield out of your claws.',
              type: 'TEXT',
            },
          ],
          id: 'rkKBlTwHctsb',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'Sksrl6wSqts-',
              text: 'brutality %- 15',
              type: 'SET',
            },
            {
              id: 'Sk2Bg6Pr9KjZ',
              text: 'cunning %+ 15',
              type: 'SET',
            },
            {
              id: 'BJpSxavSctsW',
              text: 'Cunning and Finesse increase.\n\nUnfortunately, Axilmeus is your elder; at this age, he has the advantage in maneuverability.  He caught up to you quickly, pinning you to the ground and prying the shield out of your claws.',
              type: 'TEXT',
            },
          ],
          id: 'rJABxawH5KoZ',
          label: '',
          link: {
            node: null,
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'SkMUepvrqtiZ',
              text: 'Then he crushed the shield in his jaws, wasting the magical energies imbued within it, and spat it out at your feet.  He laughed with a great roar as he flew away.\n',
              type: 'TEXT',
            },
          ],
          id: 'HJ7veavS5Fib',
          label: 'ResolveAxilmeus',
          link: {
            node: {
              node: 'HJfDeawS9Fsb',
              type: 'NODE_LINK',
            },
            type: 'NODE_LINK',
          },
          type: 'NODE',
        },
        {
          components: [
            {
              id: 'rJQUgTDr9tob',
              text: '[We need to generate a starting Wealth somehow.  My current thought is',
              type: 'COMMENT',
            },
            {
              id: 'HJ4UxaDrqtsb',
              text: 'that we use a random number increased up by low Brutality, low Disdain,',
              type: 'COMMENT',
            },
            {
              id: 'rJHUlaPHcKsW',
              text: 'and high Cunning. ',
              type: 'COMMENT',
            },
            {
              id: 'SkULlpDH9to-',
              text: 'But we could also tie it more specifically to the choices, or just go',
              type: 'COMMENT',
            },
            {
              id: 'HJDUgpwHqYjb',
              text: 'random, or whatever.]',
              type: 'COMMENT',
            },
            {
              id: 'HJO8l6DH9ts-',
              text: '',
              type: 'PAGE_BREAK',
            },
            {
              id: 'BytLgTwH5Ys-',
              text: 'You have the following stats:\n',
              type: 'TEXT',
            },
            {
              id: 'SJxwg6wH5Yob',
              stats: [
                {
                  id: 'BJi8xpDH9Fib',
                  name: 'Brutality',
                  opposed: 'Finesse',
                  stat: 'Brutality',
                  type: 'STAT_OPPOSED',
                },
                {
                  id: 'rJnLx6wBqti-',
                  name: 'Cunning',
                  opposed: 'Honor',
                  stat: 'Cunning',
                  type: 'STAT_OPPOSED',
                },
                {
                  id: 'rJpUxTvr9Fs-',
                  name: 'Disdain',
                  opposed: 'Vigilance',
                  stat: 'Disdain',
                  type: 'STAT_OPPOSED',
                },
                {
                  id: 'SyRUgpwB9Fob',
                  text: 'Infamy',
                  type: 'STAT_PERCENT',
                },
                {
                  id: 'BJkwxTwH9FiW',
                  text: 'wealth_text Wealth',
                  type: 'STAT_TEXT',
                },
              ],
              type: 'STAT_CHART',
            },
            {
              id: 'HyWPx6PS9tob',
              text: '',
              type: 'TEXT',
            },
          ],
          id: 'HJfDeawS9Fsb',
          label: 'Wrapup',
          link: {
            text: 'Begin the Adventure',
            type: 'FINISH',
          },
          type: 'NODE',
        },
      ],
    ];

    const result = flattenScenes([makeScene('startup', nodes)]);

    expect(result).toEqual(expected);
  });
});
