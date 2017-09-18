import { generate as getID } from 'shortid';

import { anyNumberOf, atLeastOne, choose, dedent, endingIn, indent, inOrder, makeParseResult, match, maybe, optional, sameDent, test } from './parser';
import {
  ACHIEVE,
  BUG,
  CHECK_ACHIEVEMENTS, CHOICE, CHOICE_ITEM, COMMENT,
  DISABLE_REUSE,
  ELSE, ELSEIF, ENDING, EOF,
  FINISH,
  GOSUB, GOSUB_SCENE, GOTO, GOTO_RANDOM_SCENE, GOTO_REF, GOTO_SCENE,
  HIDE_REUSE,
  IF, IMAGE, INPUT_NUMBER, INPUT_TEXT,
  LABEL, LINE_BREAK, LINK,
  MORE_GAMES,
  PRINT,
  RAND,
  SCENE_LIST, SCRIPT, SELECTABLE_IF, SET, SET_REF, SHARE, SHOW_PASSWORD, SOUND,
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
const makeChoiceItem = (reuse, condition, choice, nodes) => ({ type: CHOICE_ITEM, id: getID(), reuse, condition, choice, nodes });
const makeIf = (condition, block, link) => ({ type: IF, id: getID(), condition, block, link });
const makeElseIf = (condition, block, link) => ({ type: ELSEIF, id: getID(), condition, block, link });
const makeElse = (block) => ({ type: ELSE, id: getID(), block });

export function parse(cs) {
  const tokens = tokenize(cs);
  const result = endingIn(Node, match(EOF))(makeParseResult(tokens));
  if (!result.success)
    return { ...result, object: `line: ${result.error.line + 1} - expected ${result.error.expected}, but found ${result.error.found}` };


  return { ...result, object: result.object.objects };
}


function Node(parseResult) {
  const result = sameDent(inOrder(optional(match(LABEL)), anyNumberOf(Text, Action), Link))(parseResult);
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
  return choose(SingleLink, Choice, NodeLink, If)(parseResult);
}

function SingleLink(parseResult) {
  const result = sameDent(match(ENDING, FINISH, GOTO, GOTO_REF, GOTO_RANDOM_SCENE, GOTO_SCENE, GOSUB, GOSUB_SCENE))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeLink(result.object) };
}

function NodeLink(parseResult) {
  const result = sameDent(maybe(match(LABEL), Node))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeNodeLink(result.object) };
}


function Choice(parseResult) {
  const result = sameDent(inOrder(match(CHOICE), Block(atLeastOne(ChoiceItem))))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeChoice(result.object[1]) };
}


function ChoiceItem(parseResult) {
  const result = sameDent(inOrder(Reuse, ChoiceItemCondition, match(CHOICE_ITEM), Block(atLeastOne(Node))))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeChoiceItem(result.object[0], result.object[1], result.object[2].text, result.object[3]) };
}

function Reuse(parseResult) {
  const result = optional(match(HIDE_REUSE, DISABLE_REUSE))(parseResult);

  return { ...result, object: result.object === null ? null : result.object.type };
}

function ChoiceItemCondition(parseResult) {
  const result = optional(match(SELECTABLE_IF, IF))(parseResult);

  return { ...result, object: result.object === null ? null : { type: result.object.type, condition: result.object.text } };
}


function If(parseResult) {
  const result = sameDent(inOrder(match(IF), Block(atLeastOne(Node)), optional(choose(ElseIf, Else))))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeIf(result.object[0].text, result.object[1], result.object[2]) };
}


function ElseIf(parseResult) {
  const result = sameDent(inOrder(match(ELSEIF), Block(atLeastOne(Node)), optional(choose(ElseIf, Else))))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeElseIf(result.object[0].text, result.object[1], result.object[2]) };
}


function Else(parseResult) {
  const result = sameDent(inOrder(match(ELSE), Block(atLeastOne(Node))))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeElse(result.object[1]) };
}


function Block(parser) {
  return (parseResult) => {
    const result = inOrder(indent, parser, dedent)(parseResult);
    if (!result.success) return result;

    return { ...result, object: result.object[1] };
  };
}
