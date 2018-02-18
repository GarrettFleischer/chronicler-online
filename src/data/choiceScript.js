import { findIdForLabel } from './core';

import { tokenize } from './tokenizer';

import {
  anyNumberOf,
  atLeastOne,
  choose,
  dedent,
  endingIn,
  ignore,
  indent,
  inOrder,
  inOrderIgnore,
  makeError,
  makeParseResult,
  match,
  maybe,
  optional,
  sameDent,
} from './parser';

import {
  ACHIEVE,
  ACHIEVEMENT,
  ALLOW_REUSE,
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
  OPERATOR,
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
  STAT_CHART,
  TEMP,
  TEXT,
  TITLE,
  NODE_LINK,
  makeTitle,
  makeAuthor,
  makeCreate,
  makeTemp,
  makeAchievement,
  makeSceneList,
  makeImage,
  makeSound,
  makeReuse,
  makeText,
  makeAction,
  makeActionBlock,
  makeLink,
  makeNodeLink,
  makeNode,
  makeChoice,
  makeChoiceItem,
  makeIf,
  makeElseIf,
  makeElse,
  makeFakeChoice,
  makeFakeChoiceItem,
  makeStatChart,
  makeTextStat,
  makePercentStat,
  makeOpposedStat,
  makeSetAction,
} from './datatypes';


const getVariableName = (text, offset = 0) => text.split(' ')[offset];
const getVariableValue = (text, offset = 0) => text.split(' ').slice(offset + 1).join(' ');


export function parse(cs) {
  const tokens = tokenize(cs); // TODO loop over every scene
  const parseResult = makeParseResult('startup', tokens);
  const result = inOrder(anyNumberOf(Symbol), endingIn(Node, match(EOF)))(parseResult);
  if (!result.success) {
    return {
      ...result,
      object: `line: ${result.error.line + 1} - expected ${result.error.expected}, but found ${result.error.found}`,
    };
  }

  return { ...result, object: result.object[1].objects };
}


export function flattenScenes(scenes) {
  return scenes.map((scene) => {
    const result = flattenNodes(scene.nodes);
    return result.map((node) => {
      let link = node.link;
      if (link.type === GOTO)
        link = { type: NODE_LINK, node: findIdForLabel(link.text, scene.name)(scenes) };
      return { ...node, link };
    });
  });
}


function flattenNodes(nodes) {
  let result = [];
  nodes.forEach((node) => {
    result = [...result, ...flattenNode(node)];
  });
  return result;
}


function flattenNode(node) {
  const result = flattenLink(node.link);
  return [{ ...node, link: result.link }, ...result.nodes];
}


function flattenLink(item) {
  let link = item;
  let nodes = [];

  switch (link.type) {
    case CHOICE:
      link.block = link.block.map((choiceItem) => {
        const { block, ...data } = choiceItem;
        if (block.length === 1)
          nodes = [...nodes, ...flattenNodes(block)];
        return { ...data, link: { type: NODE_LINK, node: block[0].id } };
      });
      break;

    case FAKE_CHOICE:
      nodes = [...nodes, ...flattenNodes(link.link)];
      link.link = { type: NODE_LINK, node: link.link.id };
      break;

    case IF: {
      const { block, ...data } = link;
      nodes = [...nodes, ...flattenNodes(block)];
      const elses = link.elses.map((elseItem) => flattenLink(elseItem));
      link = { ...data, elses, link: { type: NODE_LINK, node: block[0].id } };
    }
      break;

    case ELSEIF:
    case ELSE: {
      const { block, ...data } = link;
      nodes = [...nodes, ...flattenNodes(block)];
      link = { ...data, link: { type: NODE_LINK, node: block[0].id } };
    }
      break;

    case NODE_LINK:
      nodes = [...nodes, ...flattenNode(link.node)];
      link.node = { type: NODE_LINK, node: link.node.id };
      break;

    default:
      break;
  }

  return { link, nodes };
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

  const name = getVariableName(result.object.text);
  const value = getVariableValue(result.object.text);
  return addSymbol(result, makeCreate(name, value));
}


function Temp(parseResult) {
  const result = sameDent(match(TEMP))(parseResult);
  if (!result.success) return result;

  const name = getVariableName(result.object.text);
  const value = getVariableValue(result.object.text);
  return addSymbol(result, makeTemp(name, value, result.scene));
}


function Image(parseResult) {
  const result = sameDent(match(IMAGE))(parseResult);
  if (!result.success) return result;

  const name = getVariableName(result.object.text);// result.object.text.split(' ')[0];
  const options = getVariableValue(result.object.text);// result.object.text.split(' ').slice(1).join(' ');
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


function Reuse(parseResult) {
  const result = sameDent(match(HIDE_REUSE, DISABLE_REUSE, ALLOW_REUSE))(parseResult);
  if (!result.success) return result;

  return addSymbol(result, makeReuse(result.object.type));
}


function Node(parseResult) {
  const result = sameDent(inOrderIgnore(atLeastOne(Temp, Reuse))(optional(Label), anyNumberOf(TextOrAction), Link))(parseResult);
  if (!result.success) return result;

  const label = result.object[0] === null ? '' : result.object[0];
  return { ...result, object: makeNode(label, result.object[1], result.object[2]) };
}


function Label(parseResult) {
  const result = match(LABEL)(parseResult);
  if (!result.success) return result;

  return { ...result, object: result.object.text };
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
  return choose(SetAction, ActionItem, Comment, StatChart, Image, Sound)(parseResult);
}

const findSymbol = (symbols, name) => (
  symbols.find((symbol) => (symbol.type === CREATE || symbol.type === TEMP) && symbol.name === name)
);

function SetAction(parseResult) {
  const result = sameDent(inOrder(match(SET), match(TEXT), optional(match(OPERATOR)), match(TEXT)))(parseResult);
  if (!result.success) return result;

  const variable = findSymbol(result.symbols, result.object[1].text);
  // TODO handle not found
  const op = result.object[2] === null ? '' : result.object[2].text;
  const variable2 = findSymbol(result.symbols, result.object[3].text);
  if (variable2 === undefined)
    return { ...result, object: makeSetAction(variable.id, op, result.object[3].text, false) };

  return { ...result, object: makeSetAction(variable.id, op, variable2.id, true) };
}


function ActionItem(parseResult) {
  const result = sameDent(match(ACHIEVE, BUG, CHECK_ACHIEVEMENTS, COMMENT, IMAGE,
    INPUT_NUMBER, INPUT_TEXT, LINE_BREAK, LINK, MORE_GAMES, PAGE_BREAK, PRINT, RAND, SET_REF, SCENE_LIST,
    SCRIPT, SELECTABLE_IF, SHARE, SHOW_PASSWORD, SOUND))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeAction(result.object) };
}


// TODO handle stat chart
function StatChart(parseResult) {
  // let result = sameDent(match(STAT_CHART))(parseResult);
  // result = Block(OpposedStat)(result);
  const result = sameDent(inOrder(match(STAT_CHART), Block(atLeastOne(TextStat, PercentStat, OpposedStat))))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeStatChart(result.object[1]) };
}


function TextStat(parseResult) {
  const result = sameDent(match(TEXT))(parseResult);
  if (!result.success) return result;

  if (!result.object.text.match(/^text /)) {
    return {
      ...result,
      success: false,
      error: makeError('text stat', result.object.text, result.object.number),
    };
  }
  return { ...result, object: makeTextStat(result.object.text.replace(/^text /, '')) };
}


function PercentStat(parseResult) {
  const result = sameDent(match(TEXT))(parseResult);
  if (!result.success) return result;

  if (!result.object.text.match(/^percent /)) {
    return {
      ...result,
      success: false,
      error: makeError('percent stat', result.object.text, result.object.number),
    };
  }
  return { ...result, object: makePercentStat(result.object.text.replace(/^percent /, '')) };
}


function OpposedStat(parseResult) {
  // let result = sameDent(match(TEXT))(parseResult);
  // result = Block(inOrder(match(TEXT), optional(match(TEXT))))(result);
  const result = sameDent(inOrder(match(TEXT), Block(inOrder(match(TEXT), optional(match(TEXT))))))(parseResult);
  if (!result.success) return result;

  if (!result.object[0].text.match(/^opposed_pair /)) {
    return {
      ...result,
      success: false,
      error: makeError('opposed_pair', result.object.text, result.object.number),
    };
  }
  const stat = result.object[0].text.replace(/^opposed_pair /, '');
  const name = result.object[1][1] === null ? null : result.object[1][0].text;
  const opposed = result.object[1][1] === null ? result.object[1][0].text : result.object[1][1].text;
  return { ...result, object: makeOpposedStat(stat, name, opposed) };
}


function Link(parseResult) {
  return choose(PageBreakLink, SingleLink, Choice, FakeChoice, NodeLink, If)(parseResult);
}

function PageBreakLink(parseResult) {
  const result = sameDent(inOrder(match(PAGE_BREAK), SingleLink))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeLink(result.object.type, result.object.text) };
}

function SingleLink(parseResult) {
  const result = sameDent(match(ENDING, FINISH, GOTO, GOTO_REF, GOTO_RANDOM_SCENE, GOTO_SCENE, GOSUB, GOSUB_SCENE))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeLink(result.object.type, result.object.text) };
}


function NodeLink(parseResult) {
  const result = sameDent(maybe(Label, Node))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeNodeLink(result.object) };
}


function FakeChoice(parseResult) {
  const result = sameDent(inOrder(match(FAKE_CHOICE), Block(atLeastOne(FakeChoiceItem)), atLeastOne(Node)))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeFakeChoice(result.object[1], result.object[2]) };
}


function FakeChoiceItem(parseResult) {
  const result = sameDent(inOrder(ChoiceItemReuse, ChoiceItemCondition, match(CHOICE_ITEM), optional(Block(atLeastOne(TextOrAction)))))(parseResult);
  if (!result.success) return result;

  return {
    ...result,
    object: makeFakeChoiceItem(result.object[0], result.object[1], result.object[2].text, result.object[3]),
  };
}


function TextOrAction(parseResult) {
  return ignore(choose(Temp, Reuse), choose(Text, Action))(parseResult);
}


function Choice(parseResult) {
  const result = sameDent(inOrder(match(CHOICE), Block(atLeastOne(ChoiceItem))))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeChoice(result.object[1]) };
}


function ChoiceItem(parseResult) {
  const result = sameDent(inOrder(ChoiceItemReuse, ChoiceItemCondition, match(CHOICE_ITEM), ActionBlock))(parseResult);
  if (!result.success) return result;

  return {
    ...result,
    object: makeChoiceItem(result.object[0], result.object[1], result.object[2].text, result.object[3]),
  };
}


// function ChoiceItemBlock(parseResult) {
//   const result = Block(inOrder(anyNumberOf(TextOrAction), choose(Link, maybe(Label, atLeastOne(Node)))))(parseResult);
//   if (!result.success) return result;
//
//   return { ...result };
// }


function ChoiceItemReuse(parseResult) {
  const result = optional(match(HIDE_REUSE, DISABLE_REUSE))(parseResult);

  return { ...result, object: result.object === null ? null : result.object.type };
}


function ChoiceItemCondition(parseResult) {
  const result = optional(match(SELECTABLE_IF, IF))(parseResult);

  return {
    ...result,
    object: result.object === null ? null : { type: result.object.type, condition: result.object.text },
  };
}


function If(parseResult) {
  const result = sameDent(inOrder(match(IF), ActionBlock, anyNumberOf(ElseIf, Else)))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeIf(result.object[0].text, result.object[1], result.object[2]) };
}


function ElseIf(parseResult) {
  const result = sameDent(inOrder(match(ELSEIF), ActionBlock))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeElseIf(result.object[0].text, result.object[1], result.object[2]) };
}


function Else(parseResult) {
  const result = sameDent(inOrder(match(ELSE), ActionBlock))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeElse(result.object[1]) };
}


function ActionBlock(parseResult) {
  const result = Block(inOrder(anyNumberOf(TextOrAction), Link))(parseResult);
  if (!result.success) return result;

  return { ...result, object: makeActionBlock(result.object[0], result.object[1]) };
}


function Block(parser) {
  return (parseResult) => {
    const result = inOrder(indent, parser, dedent)(parseResult);
    if (!result.success) return result;

    return { ...result, object: result.object[1] };
  };
}

