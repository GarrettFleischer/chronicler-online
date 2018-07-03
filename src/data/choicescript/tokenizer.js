/* eslint-disable no-nested-ternary */

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
  DELETE,
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
} from '../datatypes';

// TODO add restore_game token as a Link


export const makeLine


  = (type, number, raw, indent, text) => ({ type, number, raw, indent, text });

export const nextToken = (tokens) => ({ ...tokens, index: tokens.index + 1 });

export const prevToken = (tokens) => ({ ...tokens, index: tokens.index - 1 });

export const getToken = (tokens) => tokens.tokens[tokens.index];

export const done = (tokens) => tokens.index === tokens.tokens.length;

export const isBlank = (line) => line.type === TEXT && !line.text.length;


export function tokenize(cs) {
  const tokens = [];
  const lines = cs.replace(/\r+/g, '').split('\n'); // remove Windows carriage returns and split on newline characters
  let incrementLine = 1;
  for (let i = 0; i < lines.length; i += incrementLine) {
    const raw = lines[i];
    incrementLine = 1;

    const leadingWS = raw.match(/^\s*/).toString().match(/\s/g);
    const indent = leadingWS ? leadingWS.length : 0;
    const text = raw.replace(/^\s+/, '');

    let type = TEXT;
    let parsed = text;
    ACTIONS.some((action) => {
      const regex = new RegExp(`^\\*${action.text}(\\s+|$)`);
      if (text.match(regex)) {
        type = action.type;
        parsed = text.replace(/^\*\w+(\s+|$)/, '');
      }
      return type !== TEXT;
    });

    // check for choice items as they are initially parsed as TEXT
    if (type === TEXT && text.match(/^#/)) {
      type = CHOICE_ITEM;
      parsed = text.replace(/^#/, '');
      // handle reusable choices as separate tokens on the same line
    } else if (type === HIDE_REUSE || type === DISABLE_REUSE || type === ALLOW_REUSE) {
      const index = parsed.indexOf('#');
      if (index >= 0) {
        incrementLine = 0;
        lines[i] = parsed;
        parsed = '';
      }
      // handle conditional choices as separate tokens on the same line
    } else if (type === IF || type === SELECTABLE_IF) {
      const index = parsed.indexOf('#');
      if (index >= 0) {
        incrementLine = 0;
        lines[i] = parsed.slice(index);
        parsed = parsed.slice(0, index).trim();
      }
    } else if (type === SET) {
      const items = (parsed.split(/\s/)).filter((s) => s.length > 0);
      tokens.push(makeLine(SET, i, raw, indent, ''));
      tokens.push(makeLine(TEXT, i, raw, indent, items[0]));
      if (items[1].match(/(\+|-|\*|\/|%\+|%-)/)) {
        tokens.push(makeLine(OPERATOR, i, raw, indent, items[1]));
        tokens.push(makeLine(TEXT, i, raw, indent, items[2]));
      } else
        tokens.push(makeLine(TEXT, i, raw, indent, items[1]));

      // eslint-disable-next-line no-continue
      continue; // all pushing is taken care of, continue from the beginning the loop
    }

    tokens.push(makeLine(type, i, raw, indent, parsed));
  }

  tokens.push(makeLine(EOF, tokens.length, '', 0, ''));

  return { index: 0, tokens: removeEmptyLines(tokens) };
}


function removeEmptyLines(lines) {
  let lastLineText = false;
  return lines.filter((line) => {
    if (line.type !== TEXT) {
      lastLineText = false;
      return true;
    }
    if (line.text.length > 0) lastLineText = true;
    return lastLineText;
  });
}

// TODO make restore_game action
const makeAction = (type, text) => ({ type, text });
const ACTIONS = [
  makeAction(ACHIEVE, 'achieve'),
  makeAction(ACHIEVEMENT, 'achievement'),
  makeAction(ALLOW_REUSE, 'allow_reuse'),
  makeAction(AUTHOR, 'author'),
  makeAction(BUG, 'bug'),
  makeAction(CHECK_ACHIEVEMENTS, 'check_achievements'),
  makeAction(CHOICE, 'choice'),
  makeAction(COMMENT, 'comment'),
  makeAction(CREATE, 'create'),
  makeAction(DELETE, 'delete'),
  makeAction(DISABLE_REUSE, 'disable_reuse'),
  makeAction(ELSE, 'else'),
  makeAction(ELSEIF, 'elseif'),
  makeAction(ELSEIF, 'elsif'),
  makeAction(ENDING, 'ending'),
  makeAction(FAKE_CHOICE, 'fake_choice'),
  makeAction(FINISH, 'finish'),
  makeAction(GOSUB, 'gosub'),
  makeAction(GOSUB_SCENE, 'gosub_scene'),
  makeAction(GOTO, 'goto'),
  makeAction(GOTO_RANDOM_SCENE, 'goto_random_scene'),
  makeAction(GOTO_SCENE, 'goto_scene'),
  makeAction(HIDE_REUSE, 'hide_reuse'),
  makeAction(IF, 'if'),
  makeAction(IMAGE, 'image'),
  makeAction(INPUT_NUMBER, 'input_number'),
  makeAction(INPUT_TEXT, 'input_text'),
  makeAction(LABEL, 'label'),
  makeAction(LINE_BREAK, 'line_break'),
  makeAction(LINK, 'link'),
  makeAction(MORE_GAMES, 'more_games'),
  makeAction(PAGE_BREAK, 'page_break'),
  makeAction(PRINT, 'print'),
  makeAction(RAND, 'rand'),
  makeAction(GOTO_REF, 'gotoref'),
  makeAction(SET_REF, 'setref'),
  makeAction(SCENE_LIST, 'scene_list'),
  makeAction(SCRIPT, 'script'),
  makeAction(SELECTABLE_IF, 'selectable_if'),
  makeAction(SET, 'set'),
  makeAction(SHARE, 'share_this_game'),
  makeAction(SHOW_PASSWORD, 'show_password'),
  makeAction(SOUND, 'sound'),
  makeAction(STAT_CHART, 'stat_chart'),
  makeAction(TEMP, 'temp'),
  makeAction(TITLE, 'title'),
];
