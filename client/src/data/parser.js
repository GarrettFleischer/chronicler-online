import { done, getToken, nextToken } from './tokenizer';


export const makeParseResult = (tokens, success = true, error = { expected: '', found: '' }, object = null) =>
  ({ tokens, success, error, object });


export function Nothing(parseResult) {
  return { ...parseResult, object: null };
}


//
// export function match(type) {
//   return (parseResult) => {
//     const token = getToken(parseResult.tokens);
//     if (token.type === type)
//       return { ...parseResult, object: token, tokens: nextToken(parseResult.tokens) };
//
//     return { ...parseResult, success: false, error: { expected: type, found: token.type } };
//   };
// }


export function match(...types) {
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


export function atLeastOneOf(...parsers) {
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
