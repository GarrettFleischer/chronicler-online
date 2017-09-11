export const TEXT = 'TEXT';
export const ACHIEVE = 'ACHIEVE';
export const ACHIEVEMENT = 'ACHIEVEMENT';
export const ALLOW_REUSE = 'ALLOW_REUSE';
export const AUTHOR = 'AUTHOR';
export const BUG = 'BUG';
export const CHECK_ACHIEVEMENTS = 'CHECK_ACHIEVEMENTS';
export const CHOICE = 'CHOICE';
export const CHOICE_ITEM = 'CHOICE_ITEM';
export const COMMENT = 'COMMENT';
export const CREATE = 'CREATE';
export const DELETE = 'DELETE';
export const DISABLE_REUSE = 'DISABLE_REUSE';
export const ELSE = 'ELSE';
export const ELSEIF = 'ELSEIF';
export const ENDING = 'ENDING';
export const FAKE_CHOICE = 'FAKE_CHOICE';
export const FINISH = 'FINISH';
export const GOSUB = 'GOSUB';
export const GOSUB_SCENE = 'GOSUB_SCENE';
export const GOTO = 'GOTO';
export const GOTO_RANDOM_SCENE = 'GOTO_RANDOM_SCENE';
export const GOTO_SCENE = 'GOTO_SCENE';
export const HIDE_REUSE = 'HIDE_REUSE';
export const IF = 'IF';
export const IMAGE = 'IMAGE';
export const INPUT_NUMBER = 'INPUT_NUMBER';
export const INPUT_TEXT = 'INPUT_TEXT';
export const LABEL = 'LABEL';
export const LINE_BREAK = 'LINE_BREAK';
export const LINK = 'LINK';
export const MORE_GAMES = 'MORE_GAMES';
export const PAGE_BREAK = 'PAGE_BREAK';
export const PRINT = 'PRINT';
export const RAND = 'RAND';
export const GOTO_REF = 'GOTO_REF';
export const SET_REF = 'SET_REF';
export const SCENE_LIST = 'SCENE_LIST';
export const SCRIPT = 'SCRIPT';
export const SELECTABLE_IF = 'SELECTABLE_IF';
export const SET = 'SET';
export const SHARE = 'SHARE';
export const SHOW_PASSWORD = 'SHOW_PASSWORD';
export const SOUND = 'SOUND';
export const STAT_CHART = 'STAT_CHART';
export const TEMP = 'TEMP';
export const TITLE = 'TITLE';


export function makeLine(type, number, raw, indent, text) {
  return { type, number, raw, indent, text };
}


export function parse(cs) {
  const result = [];
  const lines = cs.match(/[^\r\n]+/g);
  lines.forEach((raw, i) => {
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

    if (type === TEXT) {
      if (text.match(/^#\S+/)) {
        type = CHOICE_ITEM;
        parsed = text.replace(/^#/, '');
      }
    }

    result.push(makeLine(type, i, raw, indent, parsed));
  });

  return result;
}


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
