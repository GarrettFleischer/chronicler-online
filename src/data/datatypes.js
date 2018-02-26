import { generate as getID } from 'shortid';
import PropTypes from 'prop-types';

// TOKENS
export const EOF = 'EOF';
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
export const OPERATOR = 'OPERATOR';
export const PAGE_BREAK = 'PAGE_BREAK';
export const PAGE_BREAK_LINK = 'PAGE_BREAK_LINK';
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
export const STAT_OPPOSED = 'STAT_OPPOSED';
export const STAT_PERCENT = 'STAT_PERCENT';
export const STAT_TEXT = 'STAT_TEXT';
export const TEMP = 'TEMP';
export const TITLE = 'TITLE';

// STRUCTURES
export const NODE = 'NODE';
export const NODE_LINK = 'NODE_LINK';
export const FAKE_CHOICE_ITEM = 'FAKE_CHOICE_ITEM';
export const SCENE = 'SCENE';
export const ACTION_BLOCK = 'ACTION_BLOCK';
export const NODE_BLOCK = 'NODE_BLOCK';
export const USER = 'USER';
export const PROJECT = 'PROJECT';

export const PropTypeId = PropTypes.string;

// TODO modify these to take an object instead of parameters
// other
export const makeUser = (id, name, email, projects) => ({ type: USER, id, name, email, projects, activeProject: 0 });
export const makeProject = (id, title, author, scenes, variables) => ({ type: PROJECT, id, title, author, scenes, variables });
export const makeScene = (name, nodes) => ({ type: SCENE, id: getID(), name, nodes });

// symbols
export const makeTitle = (text) => ({ type: TITLE, id: getID(), text });
export const makeAuthor = (text) => ({ type: AUTHOR, id: getID(), text });
export const makeCreate = (name, value) => ({ type: CREATE, id: getID(), name, value });
export const makeTemp = (name, value, scene) => ({ type: TEMP, id: getID(), name, value, scene });
export const makeAchievement = (text, pre, post) => ({ type: ACHIEVEMENT, id: getID(), text, pre, post });
export const makeSceneList = (scenes) => ({ type: SCENE_LIST, id: getID(), scenes });
export const makeImage = (path, options) => ({ type: IMAGE, id: getID(), path, options });
export const makeSound = (path) => ({ type: SOUND, id: getID(), path });
export const makeReuse = (type) => ({ type, id: getID() });

// nodes and components
export const makeText = (text) => ({ type: TEXT, id: getID(), text });
export const makeAction = (line) => ({ type: line.type, id: getID(), text: line.text });
export const makeSetAction = (variableId, op, value, isVariable) => ({ type: SET, id: getID(), variableId, op, value, isVariable });
export const makeActionBlock = (components, link) => ({ type: ACTION_BLOCK, components, link });
export const makeNodeBlock = (nodes) => ({ type: NODE_BLOCK, nodes });

export const makePageBreakLink = (text, link) => ({ type: PAGE_BREAK_LINK, text, link });
export const makeLink = (type, text) => ({ type, text });
export const makeNodeLink = (node) => ({ type: NODE_LINK, id: getID(), node });

export const makeNode = (label, components, link) => ({ type: NODE, id: getID(), label, components, link });

export const makeChoice = (choices) => ({ type: CHOICE, id: getID(), choices });
export const makeChoiceItem = (reuse, condition, text, link) => ({ type: CHOICE_ITEM, id: getID(), reuse, condition, text, link });

export const makeIf = (condition, block, elses) => ({ type: IF, id: getID(), condition, ...block, elses });
export const makeElseIf = (condition, block) => ({ type: ELSEIF, id: getID(), condition, ...block });
export const makeElse = (block) => ({ type: ELSE, id: getID(), ...block });

export const makeFakeChoice = (choices, link) => ({ type: FAKE_CHOICE, id: getID(), choices, link });
export const makeFakeChoiceItem = (reuse, condition, text, block) => ({ type: FAKE_CHOICE_ITEM, id: getID(), reuse, condition, text, block });

export const makeStatChart = (stats) => ({ type: STAT_CHART, id: getID(), stats });
export const makeTextStat = (text) => ({ type: STAT_TEXT, id: getID(), text });
export const makePercentStat = (text) => ({ type: STAT_PERCENT, id: getID(), text });
export const makeOpposedStat = (stat, name, opposed) => ({ type: STAT_OPPOSED, id: getID(), stat, name, opposed });
