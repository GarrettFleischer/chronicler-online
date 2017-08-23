export const DataType = {
  ANY: 'DataType/ANY',
  BASE: 'DataType/BASE',
  VARIABLE: 'DataType/VARIABLE',
  SCENE: 'DataType/SCENE',
  NODE: 'DataType/NODE',
  COMPONENT: 'DataType/COMPONENT',
  CHANGESET: 'DataType/CHANGESET',
  LINK: 'DataType/LINK',
  IF_LINK: 'DataType/IF_LINK',
  NEXT: 'DataType/NEXT',
  TEXT: 'DataType/TEXT',
  CHOICE: 'DataType/CHOICE',
  FAKE_CHOICE: 'DataType/FAKE_CHOICE',
  CREATE: 'DataType/CREATE',
  TEMP: 'DataType/TEMP',
  SET: 'DataType/SET',
  IF: 'DataType/IF',
  LABEL: 'DataType/LABEL',
  GOTO: 'DataType/GOTO',
  GOTO_SCENE: 'DataType/GOTO_SCENE',
  GOSUB: 'DataType/GOSUB',
  GOSUB_SCENE: 'DataType/GOSUB_SCENE',
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
