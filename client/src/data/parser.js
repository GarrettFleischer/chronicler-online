import { generate as getID } from 'shortid';
import {
  ACHIEVE,
  BUG,
  CHECK_ACHIEVEMENTS,
  COMMENT,
  done,
  EOF,
  FINISH,
  getToken,
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
  nextToken,
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
// const makeLabel = (label, id) => (label === null) ? `node_${id}` : label;
const makeNode = (label, components, link) => ({ type: NODE, id: getID(), label, components, link });

const makeParseResult = (tokens, success = true, error = { expected: '', found: '' }, object = null) =>
  ({ tokens, success, error, object });


export function parse(cs) {
  const tokens = tokenize(cs);
  let result = makeParseResult(tokens);
  result = anyNumberOf(result, Node);
  const nodes = result.object;
  if (!result.success)
    result.object = `expected ${result.error.expected} but found ${result.error.found}`;

  result = match(result, EOF);
  if (!result.success)
    result.object = `expected ${result.error.expected} but found ${result.error.found}`;

  return { ...result, object: nodes };
}


function Node(parseResult) {
  let result = match(parseResult, LABEL);
  const label = result.success ? result.object.text : null;
  result = result.success ? result : parseResult;

  result = anyNumberOf(result, Text, Action);
  const components = result.object;

  result = Link(result);
  if (!result.success) return result;

  return { ...result, object: makeNode(label, components, result.object) };
}


function Text(parseResult) {
  let result = match(parseResult, TEXT);
  if (!result.success) return result;
  let text = result.object.text;

  let temp = match(result, TEXT);
  while (!done(temp.tokens) && temp.success) {
    text += `\n${temp.object.text}`;
    result = temp;
    temp = match(result, TEXT);
  }

  return { ...result, object: makeText(text) };
}


function Action(parseResult) {
  const result = oneOf(parseResult, ACHIEVE, BUG, CHECK_ACHIEVEMENTS, COMMENT, IMAGE,
    INPUT_NUMBER, INPUT_TEXT, LINE_BREAK, LINK, MORE_GAMES, PRINT, RAND, SET_REF, SCENE_LIST,
    SCRIPT, SELECTABLE_IF, SET, SHARE, SHOW_PASSWORD, SOUND);
  if (!result.success) return result;

  return { ...result, object: makeAction(result.object) };
}


function Link(parseResult) {
  const result = oneOf(parseResult, FINISH, GOTO, GOTO_REF, GOTO_RANDOM_SCENE, GOTO_SCENE, GOSUB, GOSUB_SCENE);
  // TODO handle if and choices
  if (!result.success) return result;

  return { ...result, object: makeLink(result.object) };
}


function match(parseResult, type) {
  const token = getToken(parseResult.tokens);
  if (token.type === type)
    return { ...parseResult, object: token, tokens: nextToken(parseResult.tokens) };

  return { ...parseResult, success: false, error: { expected: type, found: token.type } };
}


function oneOf(parseResult, ...types) {
  const token = getToken(parseResult.tokens);
  for (let i = 0; i < types.length; ++i) {
    const type = types[i];
    if (token.type === type)
      return { ...parseResult, object: token, tokens: nextToken(parseResult.tokens) };
  }

  return { ...parseResult, success: false, error: { expected: types.join(', '), found: token.type } };
}


function choose(...parseResults) {
  let result = parseResults[0];
  if (result.success) return result;

  let expected = result.error.expected;
  for (let i = 1; i < parseResults.length; ++i) {
    result = parseResults[i];
    if (result.success) return result;
    expected += `, ${result.error.expected}`;
  }

  return { ...result, error: { ...result.error, expected } };
}


function anyNumberOf(parseResult, ...parsers) {
  const objects = [];

  let result = parseResult;
  let temp = choose(...parsers.map(mapParser(result)));
  while (temp.success) {
    result = temp;
    objects.push(result.object);
    if (done(result.tokens)) break;
    temp = choose(...parsers.map(mapParser(result)));
  }

  return { ...result, object: objects };
}


// function atLeastOneOf(parseResult, ...parsers) {
//   const result = anyNumberOf(parseResult, parsers);
//   if(result.object.length === 0) return parseResult;
//   return result;
// }


const mapParser = (parseResult) => (parser) => parser(parseResult);


// const failure = undefined;
//
// function lit(type) {
//   return ((tokens) => {
//     const token = getToken(tokens);
//     return ((token.type === type) ? token : failure);
//   });
// }
//
// function or(...parsers) {
//   return ((tokens) => {
//     let result = failure;
//     for (let i = 0; i < parsers.length && result === failure; ++i) {
//       const parser = parsers[i];
//       result = parser(tokens);
//     }
//     return result;
//   });
// }
//
// function and(...parsers) {
//   return ((tokens) => {
//
//   });
// }
//
// function advanceToken(tokens) {
//   tokens.index += 1;
// }
