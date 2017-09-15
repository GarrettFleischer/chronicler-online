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
  // const result = inOrder(atLeastOneOf(Node), matchType(EOF))(makeParseResult(tokens));
  const result = endingIn(matchType(EOF), Node)(makeParseResult(tokens));
  if (!result.success) return result;
  return { ...result, object: result.object.objects };

  // result = anyNumberOf(result, Node);
  // const nodes = result.object;
  // if (!result.success)
  //   result.object = `expected ${result.error.expected} but found ${result.error.found}`;
  //
  // result = match(result, EOF);
  // if (!result.success)
  //   result.object = `expected ${result.error.expected} but found ${result.error.found}`;
  //
  // return { ...result, object: nodes };
}


function Node(parseResult) {
  const result = inOrder(optional(matchType(LABEL)), anyNumberOf(Text, Action), Link)(parseResult);
  if (!result.success) return result;

  const label = result.object[0] === null ? null : result.object[0].text;
  return { ...result, object: makeNode(label, result.object[1], result.object[2]) };

  // let result = match(LABEL)(parseResult);
  // const label = result.success ? result.object.text : null;
  // result = result.success ? result : parseResult;
  //
  // result = anyNumberOf(Text, Action)(result);
  // const components = result.object;
  //
  // result = Link(result);
  // if (!result.success) return result;
  //
  // return { ...result, object: makeNode(label, components, result.object) };
}


function Text(parseResult) {
  // const result = inOrder(match(TEXT), anyNumberOf(match(TEXT)))(parseResult);
  const result = atLeastOneOf(matchType(TEXT))(parseResult);
  if (!result.success) return result;

  let text = result.object[0].text;
  result.object[1].forEach((token) => {
    text += `\n${token.text}`;
  });

  return { ...result, object: makeText(text) };

  // let result = match(TEXT)(parseResult);
  // if (!result.success) return result;
  // let text = result.object.text;
  //
  // let temp = match(TEXT)(result);
  // while (!done(temp.tokens) && temp.success) {
  //   text += `\n${temp.object.text}`;
  //   result = temp;
  //   temp = match(TEXT)(result);
  // }
  //
  // return { ...result, object: makeText(text) };
}


function Action(parseResult) {
  const result = oneOfType(ACHIEVE, BUG, CHECK_ACHIEVEMENTS, COMMENT, IMAGE,
    INPUT_NUMBER, INPUT_TEXT, LINE_BREAK, LINK, MORE_GAMES, PRINT, RAND, SET_REF, SCENE_LIST,
    SCRIPT, SELECTABLE_IF, SET, SHARE, SHOW_PASSWORD, SOUND)(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeAction(result.object) };
}


function Link(parseResult) {
  const result = oneOfType(FINISH, GOTO, GOTO_REF, GOTO_RANDOM_SCENE, GOTO_SCENE, GOSUB, GOSUB_SCENE)(parseResult);
  // TODO handle if and choices
  if (!result.success) return result;

  return { ...result, object: makeLink(result.object) };
}


function Nothing(parseResult) {
  return { ...parseResult, object: null };
}


function matchType(type) {
  return (parseResult) => {
    const token = getToken(parseResult.tokens);
    if (token.type === type)
      return { ...parseResult, object: token, tokens: nextToken(parseResult.tokens) };

    return { ...parseResult, success: false, error: { expected: type, found: token.type } };
  };
}


function oneOfType(...types) {
  return (parseResult) => {
    const token = getToken(parseResult.tokens);
    for (let i = 0; i < types.length; ++i) {
      const type = types[i];
      if (token.type === type)
        return { ...parseResult, object: token, tokens: nextToken(parseResult.tokens) };
    }

    return { ...parseResult, success: false, error: { expected: types.join(', '), found: token.type } };
  };
}


function choose(...parsers) {
  return (parseResult) => {
    let expected = '';
    let result = parseResult;
    for (let i = 0; i < parsers.length; ++i) {
      result = parsers[i](parseResult);
      if (result.success) return result;
      expected += `${i > 0 ? ', ' : ''}${result.error.expected}`;
    }

    return { ...result, error: { ...result.error, expected } };
  };
}


function anyNumberOf(...parsers) {
  return (parseResult) => {
    const objects = [];

    let result = parseResult;
    let temp = choose(...parsers)(result);
    while (temp.success) {
      result = temp;
      objects.push(result.object);
      if (done(result.tokens)) break;
      temp = choose(...parsers)(result);
    }

    return { ...result, object: objects };
  };
}


function atLeastOneOf(...parsers) {
  return inOrder(choose(...parsers), anyNumberOf(choose(...parsers)));
}


function optional(parser) {
  return (parseResult) => choose(parser, Nothing)(parseResult);
}


function inOrder(...parsers) {
  return (parseResult) => {
    const objects = [];
    let result = parseResult;
    for (let i = 0; i < parsers.length; ++i) {
      result = parsers[i](result);
      if (!result.success) return result;
      objects.push(result.object);
    }
    return { ...result, object: objects };
  };
}


function endingIn(endParser, ...parsers) {
  return (parseResult) => {
    const objects = [];
    let result = choose(...parsers)(parseResult);
    let temp = result;
    while (result.success) {
      objects.push(result.object);
      temp = choose(...parsers)(result);
      if (!temp.success) break;
      result = temp;
    }
    const endResult = endParser(result);
    if (!temp.success && !endResult.success) return temp;
    return { ...endResult, object: { end: endResult.object, objects } };
  };
}


// const mapParser = (parseResult) => (parser) => parser(parseResult);


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
