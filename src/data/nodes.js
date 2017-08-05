import { Enum } from './core';


export const DataType = {
  BASE: 'NodeType/BASE',
  SCENE: 'NodeType/SCENE',
  NODE: 'NodeType/NODE',
  LINK: 'NodeType/LINK',
  IF_LINK: 'NodeType/IF_LINK',
  NEXT: 'NodeType/NEXT',
  TEXT: 'NodeType/TEXT',
  CHOICE: 'NodeType/CHOICE',
  FAKE_CHOICE: 'NodeType/FAKE_CHOICE',
  CREATE: 'NodeType/CREATE',
  TEMP: 'NodeType/TEMP',
  SET: 'NodeType/SET',
  IF: 'NodeType/IF',
  LABEL: 'NodeType/LABEL',
  GOTO: 'NodeType/GOTO',
  GOTO_SCENE: 'NodeType/GOTO_SCENE',
  GOSUB: 'NodeType/GOSUB',
  GOSUB_SCENE: 'NodeType/GOSUB_SCENE',
};

export const LinkType = {
  NORMAL: 'LinkType/NORMAL',
  DISABLE: 'LinkType/DISABLE',
  HIDE: 'LinkType/HIDE',
  ALLOW: 'LinkType/ALLOW',
};


export function base(scenes) {
  return { type: DataType.BASE, scenes };
}


export function scene(id, name, nodes) {
  return { type: DataType.SCENE, id, name, nodes };
}


export function node(id, label, components, x = 0, y = 0) {
  return { type: DataType.NODE, id, label, components, x, y };
}


export function cLink(id, linkType, text, linkId, components) {
  return { type: DataType.LINK, id, linkType, text, linkId, components };
}


export function cIfLink(id, expr, text, linkId, components) {
  return { type: DataType.IF_LINK, id, expr, text, linkId, components };
}


export function cNext(id, text, linkId) {
  return { type: DataType.NEXT, id, text, linkId };
}


export function cText(id, text) {
  return { type: DataType.TEXT, id, text };
}


export function cChoice(id, links) {
  return { type: DataType.CHOICE, id, links };
}


export function cFakeChoice(id, linkId, choices) {
  return { type: DataType.FAKE_CHOICE, id, linkId, choices };
}


export function cCreate(id, name) {
  return { type: DataType.CREATE, id, name };
}


export function cTemp(id, name) {
  return { type: DataType.TEMP, id, name };
}


export function cSet(id, name, op, expr) {
  return { type: DataType.SET, id, name, op, expr };
}


export function cIf(id, expr, components, elseComponents) {
  return { type: DataType.IF, id, expr, components, elseComponents };
}


export function cLabel(id, label) {
  return { type: DataType.LABEL, id, label };
}


export function cGoto(id, linkId) {
  return { type: DataType.GOTO, id, linkId };
}


export function cGotoScene(id, sceneId, linkId) {
  return { type: DataType.GOTO_SCENE, id, sceneId, linkId };
}


export function cGosub(id, linkId) {
  return { type: DataType.GOSUB, id, linkId };
}


export function cGosubScene(id, sceneId, linkId) {
  return { type: DataType.GOSUB_SCENE, id, sceneId, linkId };
}
