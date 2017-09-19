import { peek, pop, push } from '../lib/stack';
import { done, getToken, nextToken } from './tokenizer';


export const makeParseResult = (tokens, success = true, error = { expected: '', found: '' }, indentStack = [0], object = null) =>
  ({ tokens, success, error, object, indent: indentStack }); // { level: indentLevel, check: isSameIndent } });

export const makeError = (expected, found, line) => ({ expected, found, line });


export function Nothing(parseResult) {
  return { ...parseResult, object: null };
}


// function isIndented(parseResult) {
//   const token = getToken(parseResult.tokens);
//   return isBlank(token) || token.indent > parseResult.indent.level;
// }
//
// function isSameIndent(parseResult) {
//   const token = getToken(parseResult.tokens);
//   return isBlank(token) || token.indent === parseResult.indent.level;
// }
//
// function isDedented(parseResult) {
//   const token = getToken(parseResult.tokens);
//   return isBlank(token) || token.indent < parseResult.indent.level;
// }

export function indent(parseResult) {
  const token = getToken(parseResult.tokens);
  const indentLevel = peek(parseResult.indent);
  if (token.indent <= indentLevel) return { ...parseResult, success: false, error: makeError(`indent > ${indentLevel}`, `indent: ${token.indent}`, token.number) };
  return { ...parseResult, object: null, indent: push(parseResult.indent, token.indent) };
}


export function dedent(parseResult) {
  const token = getToken(parseResult.tokens);
  if (parseResult.indent.length <= 1) return { ...parseResult, success: false, error: makeError('indent: 0', 'indent < 0', token.number) };
  const result = { ...parseResult, indent: pop(parseResult.indent) };
  const indentLevel = peek(result.indent);
  if (token.indent > indentLevel) return { ...parseResult, success: false, error: makeError(`indent: ${indentLevel}`, `indent: ${token.indent}`, token.number) };
  return { ...result, object: null };
}


export function sameDent(parser) {
  return (parseResult) => {
    const token = getToken(parseResult.tokens);
    const indentLevel = peek(parseResult.indent);
    if (token.indent !== indentLevel) return { ...parseResult, success: false, error: makeError(`indent: ${indentLevel}`, `indent: ${token.indent}`, token.number) };
    return parser(parseResult);
  };
}


export function match(...types) {
  return (parseResult) => {
    const token = getToken(parseResult.tokens);
    for (let i = 0; i < types.length; ++i) {
      const type = types[i];
      if (token.type === type)
        return { ...parseResult, object: token, tokens: nextToken(parseResult.tokens) };
    }

    return { ...parseResult, success: false, error: makeError(types.join(', '), token.type, token.number) };
  };
}


export function test(parser) {
  return (parseResult) => {
    const result = parser(parseResult);
    return { ...parseResult, success: result.success, error: result.error };
  };
}


export function maybe(testParser, parser) {
  return (parseResult) => {
    const result = inOrder(test(testParser), parser)(parseResult);
    if (!result.success) return result;
    return { ...result, object: result.object[1] };
  };
}


export function choose(...parsers) {
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


export function anyNumberOf(...parsers) {
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


export function atLeastOne(...parsers) {
  return (parseResult) => {
    const result = inOrder(choose(...parsers), anyNumberOf(choose(...parsers)))(parseResult);
    if (!result.success) return result;
    return { ...result, object: [result.object[0], ...result.object[1]] };
  };
}


export function optional(parser) {
  return (parseResult) => choose(parser, Nothing)(parseResult);
}


export function inOrder(...parsers) {
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


export function endingIn(parser, endParser) {
  return (parseResult) => {
    const objects = [];
    let result = parser(parseResult);
    let temp = result;
    while (result.success) {
      objects.push(result.object);
      temp = parser(result);
      if (!temp.success) break;
      result = temp;
    }
    const endResult = endParser(result);
    if (!temp.success && !endResult.success) return temp;
    return { ...endResult, object: { end: endResult.object, objects } };
  };
}
