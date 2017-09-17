import { generate as getID } from 'shortid';

import { anyNumberOf, atLeastOne, choose, dedent, endingIn, indent, inOrder, makeParseResult, match, maybe, optional, sameDent, test } from './parser';
import {
  ACHIEVE,
  BUG,
  CHECK_ACHIEVEMENTS, CHOICE, CHOICE_ITEM,
  COMMENT,
  EOF,
  FINISH,
  GOSUB,
  GOSUB_SCENE,
  GOTO,
  GOTO_RANDOM_SCENE,
  GOTO_REF,
  GOTO_SCENE,
  IMAGE,
  INPUT_NUMBER,
  INPUT_TEXT,
  LABEL,
  LINE_BREAK,
  LINK,
  MORE_GAMES,
  PRINT,
  RAND,
  SCENE_LIST,
  SCRIPT,
  SELECTABLE_IF,
  SET,
  SET_REF,
  SHARE,
  SHOW_PASSWORD,
  SOUND,
  TEXT,
  tokenize,
} from './tokenizer';


export const NODE = 'NODE';

const makeText = (text) => ({ type: TEXT, id: getID(), text });
const makeAction = (line) => ({ type: line.type, id: getID(), text: line.text });
const makeLink = (line) => ({ type: line.type, text: line.text });
const makeNodeLink = (node) => ({ type: GOTO, node });
const makeNode = (label, components, link) => ({ type: NODE, id: getID(), label, components, link });
const makeChoice = (choices) => ({ type: CHOICE, id: getID(), choices });
const makeChoiceItem = (choice, nodes) => ({ type: CHOICE_ITEM, id: getID(), choice, nodes });


export function parse(cs) {
  const tokens = tokenize(cs);
  const result = endingIn(Node, match(EOF))(makeParseResult(tokens));
  if (!result.success)
    return { ...result, object: `expected ${result.error.expected}, but found ${result.error.found}` };


  return { ...result, object: result.object.objects };
}


function Node(parseResult) {
  const result = inOrder(optional(sameDent(match(LABEL))), anyNumberOf(Text, Action), Link)(parseResult);
  if (!result.success) return result;

  const label = result.object[0] === null ? '' : result.object[0].text;
  return { ...result, object: makeNode(label, result.object[1], result.object[2]) };
}


function Text(parseResult) {
  const result = atLeastOne(sameDent(match(TEXT)))(parseResult);
  if (!result.success) return result;

  let text = '';
  result.object.forEach((token, i) => {
    text += `${i > 0 ? '\n' : ''}${token.text}`;
  });

  return { ...result, object: makeText(text) };
}


function Action(parseResult) {
  const result = sameDent(match(ACHIEVE, BUG, CHECK_ACHIEVEMENTS, COMMENT, IMAGE,
    INPUT_NUMBER, INPUT_TEXT, LINE_BREAK, LINK, MORE_GAMES, PRINT, RAND, SET_REF, SCENE_LIST,
    SCRIPT, SELECTABLE_IF, SET, SHARE, SHOW_PASSWORD, SOUND))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeAction(result.object) };
}


function Link(parseResult) {
  // TODO handle if
  const result = sameDent(choose(match(FINISH, GOTO, GOTO_REF, GOTO_RANDOM_SCENE, GOTO_SCENE, GOSUB, GOSUB_SCENE), Choice, maybe(match(LABEL), Node)))(parseResult);
  if (!result.success) return result;

  if (result.object.type === CHOICE)
    return result;

  if (result.object.type === NODE)
    return { ...result, object: makeNodeLink(result.object) };

  return { ...result, object: makeLink(result.object) };
}

function Choice(parseResult) {
  const result = inOrder(sameDent(match(CHOICE)), indent, atLeastOne(ChoiceItem), dedent)(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeChoice(result.object[2]) };
}

function ChoiceItem(parseResult) {
  const result = inOrder(sameDent(match(CHOICE_ITEM)), indent, atLeastOne(Node), dedent)(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeChoiceItem(result.object[0].text, result.object[2]) };
}
