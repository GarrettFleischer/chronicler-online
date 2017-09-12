import { generate as getID } from 'shortid';
import { ACHIEVEMENT, CREATE, LABEL, parse, TEMP } from './parser';


export const BASE = 'BASE';

export const makeSymbol = (line) => ({ id: getID(), ...line });

export const makeASTNode = () => ({ type: null, id: getID(), children: [] });


export function generateSymbolTable(lines) {
  const filtered = lines.filter((line) =>
    line.type === CREATE || line.type === TEMP || line.type === ACHIEVEMENT || line.type === LABEL);
  return filtered.map((line) => makeSymbol(line));
}


export function generateAST(cs) {
  const ast = [];
  const lines = parse(cs);
  const symbolTable = generateSymbolTable(lines);

  let node = makeASTNode();
  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];

    switch (line.type) {
      case CREATE:
      case TEMP:
      case ACHIEVEMENT:
        break;

      case LABEL: {
        ast.push(node);
        node = makeASTNode();
        break;
      }

      default:
        node.children.append(line);
        break;
    }
  }

  return ast;
}

