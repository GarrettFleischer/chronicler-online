export const DataType = {
  ANY: 'ANY',
  PROJECT: 'PROJECT',
  VARIABLE: 'VARIABLE',
  SCENE: 'SCENE',
  NODE: 'NODE',
  COMPONENT: 'COMPONENT',
  CHANGESET: 'CHANGESET',
};

export const VariableType = {
  GLOBAL: 'GLOBAL',
  LOCAL: 'LOCAL',
};

export const NodeType = {
  NEXT: 'GOTO',
  CHOICE: 'CHOICE',
  FAKE_CHOICE: 'FAKE_CHOICE',
  // GOTO: 'GOTO',
  // GOTO_SCENE: 'GOTO_SCENE',
  // GOSUB: 'GOSUB',
  // GOSUB_SCENE: 'GOSUB_SCENE',
};

export const ChoiceType = {
  LINK: 'LINK',
  IF_LINK: 'IF_LINK',
};

export const LinkType = {
  NORMAL: 'NORMAL',
  DISABLE: 'DISABLE',
  HIDE: 'HIDE',
  ALLOW: 'ALLOW',
};

export const ComponentType = {
  TEXT: 'TEXT',
  SET: 'SET',
  IF: 'IF',
};


export function project(_id, title, author, children) {
  return { type: DataType.PROJECT, _id, title, author, children };
}


export function scene(_id, name, parent, children) {
  return { type: DataType.SCENE, _id, name, parent, children };
}


export function node(_id, label, parent, children, link, x = 0, y = 0) {
  return { type: DataType.NODE, _id, label, parent, children, link, x, y };
}


export function cLink(_id, linkType, text, linkId, components) {
  return { type: DataType.LINK, _id, linkType, text, linkId, components };
}


export function cIfLink(_id, expr, text, linkId, children) {
  return { type: DataType.IF_LINK, _id, expr, text, linkId, children };
}


export function cNext(_id, text, linkId) {
  return { type: NodeType.NEXT, _id, text, linkId };
}


export function cText(_id, text) {
  return { type: DataType.TEXT, _id, text };
}


export function cChoice(_id, links) {
  return { type: NodeType.CHOICE, _id, links };
}


export function cFakeChoice(_id, linkId, children) {
  return { type: NodeType.FAKE_CHOICE, _id, linkId, children };
}


export function varGlobal(_id, name) {
  return { type: VariableType.GLOBAL, _id, name };
}


export function varLocal(_id, name) {
  return { type: VariableType.LOCAL, _id, name };
}


export function cSet(_id, name, op, expr) {
  return { type: DataType.SET, _id, name, op, expr };
}


export function cIf(_id, expr, components, elseComponents) {
  return { type: DataType.IF, _id, expr, components, elseComponents };
}
