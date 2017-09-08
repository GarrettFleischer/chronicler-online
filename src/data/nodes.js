export const DataType = {
  ANY: 'DataType/ANY',
  VARIABLE: 'DataType/VARIABLE',
  SCENE: 'DataType/SCENE',
  NODE: 'DataType/NODE',
  COMPONENT: 'DataType/COMPONENT',
  CHANGESET: 'DataType/CHANGESET',
};

export const VariableType = {
  GLOBAL: 'VariableType/GLOBAL',
  LOCAL: 'VariableType/LOCAL',
};

export const NodeType = {
  NEXT: 'NodeType/GOTO',
  CHOICE: 'NodeType/CHOICE',
  FAKE_CHOICE: 'NodeType/FAKE_CHOICE',
  // GOTO: 'NodeType/GOTO',
  // GOTO_SCENE: 'NodeType/GOTO_SCENE',
  // GOSUB: 'NodeType/GOSUB',
  // GOSUB_SCENE: 'NodeType/GOSUB_SCENE',
};

export const ChoiceType = {
  LINK: 'ChoiceType/LINK',
  IF_LINK: 'ChoiceType/IF_LINK',
};

export const LinkType = {
  NORMAL: 'LinkType/NORMAL',
  DISABLE: 'LinkType/DISABLE',
  HIDE: 'LinkType/HIDE',
  ALLOW: 'LinkType/ALLOW',
};

export const ComponentType = {
  TEXT: 'ComponentType/TEXT',
  SET: 'ComponentType/SET',
  IF: 'NodeType/IF',
};


export function scene(id, name, children) {
  return { type: DataType.SCENE, id, name, children };
}


export function node(id, linkData, label, parent, children, x = 0, y = 0) {
  return { type: DataType.NODE, linkData, id, label, parent, children, x, y };
}


export function cLink(id, linkType, text, linkId, components) {
  return { type: DataType.LINK, id, linkType, text, linkId, components };
}


export function cIfLink(id, expr, text, linkId, components) {
  return { type: DataType.IF_LINK, id, expr, text, linkId, components };
}


export function cNext(id, text, linkId) {
  return { type: NodeType.NEXT, id, text, linkId };
}


export function cText(id, text) {
  return { type: DataType.TEXT, id, text };
}


export function cChoice(id, links) {
  return { type: NodeType.CHOICE, id, links };
}


export function cFakeChoice(id, linkId, choices) {
  return { type: NodeType.FAKE_CHOICE, id, linkId, choices };
}


export function varGlobal(id, name) {
  return { type: VariableType.GLOBAL, id, name };
}


export function varLocal(id, name) {
  return { type: VariableType.LOCAL, id, name };
}


export function cSet(id, name, op, expr) {
  return { type: DataType.SET, id, name, op, expr };
}


export function cIf(id, expr, components, elseComponents) {
  return { type: DataType.IF, id, expr, components, elseComponents };
}
