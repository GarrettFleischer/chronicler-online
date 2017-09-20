import { generate as getID } from 'shortid';

import { anyNumberOf, atLeastOne, choose, dedent, endingIn, ignore, indent, inOrder, makeParseResult, match, maybe, optional, sameDent } from './parser';
import {
  ACHIEVE,
  ACHIEVEMENT,
  AUTHOR,
  BUG,
  CHECK_ACHIEVEMENTS,
  CHOICE,
  CHOICE_ITEM,
  COMMENT,
  CREATE,
  DISABLE_REUSE,
  ELSE,
  ELSEIF,
  ENDING,
  EOF,
  FAKE_CHOICE,
  FINISH,
  GOSUB,
  GOSUB_SCENE,
  GOTO,
  GOTO_RANDOM_SCENE,
  GOTO_REF,
  GOTO_SCENE,
  HIDE_REUSE,
  IF,
  IMAGE,
  INPUT_NUMBER,
  INPUT_TEXT,
  LABEL,
  LINE_BREAK,
  LINK,
  MORE_GAMES,
  PAGE_BREAK,
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
  TEMP,
  TEXT,
  TITLE,
  tokenize,
} from './tokenizer';


export const NODE = 'NODE';
export const FAKE_CHOICE_ITEM = 'FAKE_CHOICE_ITEM';

// symbols
const makeTitle = (text) => ({ type: TITLE, id: getID(), text });
const makeAuthor = (text) => ({ type: AUTHOR, id: getID(), text });
const makeCreate = (text) => ({ type: CREATE, id: getID(), text });
const makeTemp = (text, scene) => ({ type: TEMP, id: getID(), text, scene });
const makeAchievement = (text, pre, post) => ({ type: ACHIEVEMENT, id: getID(), text, pre, post });
const makeSceneList = (scenes) => ({ type: SCENE_LIST, id: getID(), scenes });
const makeImage = (path, options) => ({ type: IMAGE, id: getID(), path, options });
const makeSound = (path) => ({ type: SOUND, id: getID(), path });

// nodes and components
const makeText = (text) => ({ type: TEXT, id: getID(), text });
const makeAction = (line) => ({ type: line.type, id: getID(), text: line.text });
const makeLink = (type, text) => ({ type, text });
const makeNodeLink = (node) => ({ type: GOTO, node });
const makeNode = (label, components, link) => ({ type: NODE, id: getID(), label, components, link });
const makeChoice = (choices) => ({ type: CHOICE, id: getID(), choices });
const makeChoiceItem = (reuse, condition, choice, nodes) => ({ type: CHOICE_ITEM, id: getID(), reuse, condition, choice, nodes });
const makeIf = (condition, block, elses) => ({ type: IF, id: getID(), condition, block, elses });
const makeElseIf = (condition, block) => ({ type: ELSEIF, id: getID(), condition, block });
const makeElse = (block) => ({ type: ELSE, id: getID(), block });
const makeFakeChoice = (choices, nodes) => ({ type: FAKE_CHOICE, id: getID(), choices, nodes });
const makeFakeChoiceItem = (reuse, condition, choice, block) => ({ type: FAKE_CHOICE_ITEM, id: getID(), reuse, condition, choice, block });


export function parse(cs) {
  const tokens = tokenize(cs);
  const parseResult = makeParseResult(tokens);
  const result = inOrder(anyNumberOf(Symbol), endingIn(Node, match(EOF)))(parseResult);
  if (!result.success)
    return { ...result, object: `line: ${result.error.line + 1} - expected ${result.error.expected}, but found ${result.error.found}` };

  return { ...result, object: result.object[1].objects };
}


function addSymbol(parseResult, symbol) {
  // ignore duplicate images and sounds
  if (symbol.type === IMAGE && parseResult.symbols.filter((other) => other.type === IMAGE && other.path === symbol.path).length > 0)
    return parseResult;

  if (symbol.type === SOUND && parseResult.symbols.filter((other) => other.type === SOUND && other.path === symbol.path).length > 0)
    return parseResult;

  return { ...parseResult, symbols: [...parseResult.symbols, symbol], object: symbol };
}


function Symbol(parseResult) {
  return sameDent(choose(Comment, Title, Author, Create, Temp, Achievement, SceneList))(parseResult);
}


function Title(parseResult) {
  const result = sameDent(match(TITLE))(parseResult);
  if (!result.success) return result;

  return addSymbol(result, makeTitle(result.object.text));
}


function Author(parseResult) {
  const result = sameDent(match(AUTHOR))(parseResult);
  if (!result.success) return result;

  return addSymbol(result, makeAuthor(result.object.text));
}


function Create(parseResult) {
  const result = sameDent(match(CREATE))(parseResult);
  if (!result.success) return result;

  return addSymbol(result, makeCreate(result.object.text));
}


function Temp(parseResult) {
  const result = sameDent(match(TEMP))(parseResult);
  if (!result.success) return result;

  return addSymbol(result, makeTemp(result.object.text));
}


function Image(parseResult) {
  const result = sameDent(match(IMAGE))(parseResult);
  if (!result.success) return result;

  const name = result.object.text.split(' ')[0];
  const options = result.object.text.split(' ').slice(1).join(' ');
  const symbol = makeImage(name, options);
  return { ...addSymbol(result, symbol), object: symbol };
}


function Comment(parseResult) {
  const result = sameDent(match(COMMENT))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeAction(result.object) };
}


function Sound(parseResult) {
  const result = sameDent(match(SOUND))(parseResult);
  if (!result.success) return result;

  const symbol = makeSound(result.object.text);
  return { ...addSymbol(result, symbol), object: symbol };
}


function Achievement(parseResult) {
  const result = sameDent(inOrder(match(ACHIEVEMENT), Block(inOrder(match(TEXT), match(TEXT)))))(parseResult);
  if (!result.success) return result;

  return addSymbol(result, makeAchievement(result.object[0].text, result.object[1][0].text, result.object[1][1].text));
}


function SceneList(parseResult) {
  const result = sameDent(inOrder(match(SCENE_LIST), Block(atLeastOne(match(TEXT)))))(parseResult);
  if (!result.success) return result;

  return addSymbol(result, makeSceneList(result.object[1].map((token) => token.text)));
}


function Node(parseResult) {
  const result = sameDent(inOrder(ignore(atLeastOne(Temp), optional(match(LABEL))), anyNumberOf(ignore(Temp, choose(Text, Action))), ignore(atLeastOne(Temp), Link)))(parseResult);
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
  return choose(ActionItem, Comment, Image, Sound)(parseResult);
}


function ActionItem(parseResult) {
  const result = sameDent(match(ACHIEVE, BUG, CHECK_ACHIEVEMENTS, COMMENT, IMAGE,
    INPUT_NUMBER, INPUT_TEXT, LINE_BREAK, LINK, MORE_GAMES, PAGE_BREAK, PRINT, RAND, SET_REF, SCENE_LIST,
    SCRIPT, SELECTABLE_IF, SET, SHARE, SHOW_PASSWORD, SOUND))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeAction(result.object) };
}


// TODO handle stat chart
function StatChart(parseResult) {

}


function Link(parseResult) {
  return choose(SingleLink, Choice, FakeChoice, NodeLink, If)(parseResult);
}


function SingleLink(parseResult) {
  const result = sameDent(match(ENDING, FINISH, GOTO, GOTO_REF, GOTO_RANDOM_SCENE, GOTO_SCENE, GOSUB, GOSUB_SCENE))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeLink(result.object.type, result.object.text) };
}


function NodeLink(parseResult) {
  const result = sameDent(maybe(match(LABEL), Node))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeNodeLink(result.object) };
}


function FakeChoice(parseResult) {
  const result = sameDent(inOrder(match(FAKE_CHOICE), Block(atLeastOne(FakeChoiceItem)), atLeastOne(Node)))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeFakeChoice(result.object[1], result.object[2]) };
}


function FakeChoiceItem(parseResult) {
  const result = sameDent(inOrder(Reuse, ChoiceItemCondition, match(CHOICE_ITEM), optional(Block(atLeastOne(ignore(Temp, choose(Text, Action)))))))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeFakeChoiceItem(result.object[0], result.object[1], result.object[2].text, result.object[3]) };
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
  const result = sameDent(inOrder(match(IF), Block(atLeastOne(Node)), anyNumberOf(choose(ElseIf, Else))))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeIf(result.object[0].text, result.object[1], result.object[2]) };
}


function ElseIf(parseResult) {
  const result = sameDent(inOrder(match(ELSEIF), Block(atLeastOne(Node))))(parseResult);
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
