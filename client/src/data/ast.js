import { generate as getID } from 'shortid';
import { ACHIEVEMENT, CHOICE, CREATE, IMAGE, LABEL, parse, SOUND, TEMP, TEXT } from './parser';


export const BASE = 'BASE';


export function generateAST(cs) {
  const ast = [];
  const lines = parse(cs);
  const symbolTable = generateSymbolTable(lines);
  const blocks = procBlocks(lines);

  return { symbolTable, blocks };

  // let node = makeASTNode();
  // for (let i = 0; i < lines.length; ++i) {
  //   const line = lines[i];
  //
  //   switch (line.type) {
  //     // ignore things in symbol table
  //     case CREATE:
  //     case TEMP:
  //     case ACHIEVEMENT:
  //       break;
  //
  //     case LABEL: {
  //       ast.push(node);
  //       node = makeASTNode();
  //       break;
  //     }
  //
  //     default:
  //       node.children.append(line);
  //       break;
  //   }
  // }

  return ast;
}


const buildASTNode = (lines, index) => {
  const node = makeASTNode();
  let i;
  for (i = index; i < lines.length; ++i) {
    const line = lines[i];

    switch (line.type) {
      // ignore things in symbol table
      case CREATE:
      case TEMP:
      case ACHIEVEMENT:
        break;

      case LABEL:
        return { index: i, node };

      default:
        node.children.append(line);
        break;
    }
  }
};


const makeSymbol = (line) => ({ id: getID(), ...line });
const makeNode = (type, components) => ({ id: getID(), type, components });
const makeASTNode = () => ({ id: getID(), type: null, children: [] });
const makeBlock = (indent) => ({ indent, lines: [], components: [], child: null });
const makeComponent = (type, indent, lines) => ({ id: getID(), type, indent, lines, child: null });

const isDeclaration = (type) => type === CREATE || type === TEMP || type === ACHIEVEMENT || type === LABEL;
const isResource = (type) => type === IMAGE || type === SOUND;


function generateSymbolTable(lines) {
  const filtered = lines.filter((line) => isDeclaration(line.type) || isResource(line.type));
  const reduced = filtered.reduce((acc, curr) => {
    if (isResource(curr.type) && indexOf(acc, (item) => item.text === curr.text) > -1)
      return acc; // remove duplicate resources from symbol table

    return [...acc, curr];
  }, []);

  return reduced.map((line) => makeSymbol(line));
}


function indexOf(array, filter) {
// eslint-disable-next-line no-nested-ternary
  return array.reduce((acc, curr, i) => (acc > -1) ? acc : (filter(curr) ? i : -1), -1);
}


function last(array) {
  return array[array.length - 1];
}


function procNodes(lines) {

}


function procNode(block) {
  if (block === null) return null;
  const childNode = procNode(block.child);
  // for (let i = 0; i < block.components.length; i++) {
  //   let component = block.components[i];
  //   if(component.type === )
  // }
}


function flatten(blocks) {
  const chunks = [];
}


// function combineTextLines(lines) {
//   return lines.reduce((acc, curr) => {
//     if (acc.length > 0 && last(acc).type === TEXT && curr.type === TEXT) {
//       acc[acc.length - 1] = {
//         ...last(acc),
//         raw: `${last(acc).raw}\n${curr.raw}`,
//         text: `${last(acc).text}\n${curr.text}`,
//         stop: curr.number,
//       };
//       return acc;
//     }
//     return [...acc, curr];
//   }, []);
//
//   // let lastLine = lines[0];
//   // const newLines = [];
//   // for (let i = 1; i < lines.length; i++) {
//   //   const line = lines[i];
//   //
//   //   if (lastLine.type === TEXT && line.type === TEXT) {
//   //     lastLine = {
//   //       ...lastLine,
//   //       raw: `${lastLine.raw}\n${line.raw}`,
//   //       text: `${lastLine.text}\n${line.text}`,
//   //       stop: line.number,
//   //     };
//   //     if (i === lines.length - 1) newLines.push(lastLine);
//   //   } else newLines.push(lastLine);
//   // }
//   //
//   // return newLines;
// }


const isBlank = (line) => line.type === TEXT && !line.text.length;


function procComponent(lines, index) {
  const line = lines[index];

  switch (line.type) {

    case CHOICE: {
      const component = makeComponent(CHOICE, line.indent, [line]);
      let i;
      for (i = index + 1; i < lines.length; ++i) {
        if (line.indent <= component.indent && !isBlank(line))
          break;
        component.lines.push(line);
      }
      return { index: i, component };
    }

    case TEXT: {
      const component = makeComponent(TEXT, line.indent, [line]);
      let i;
      for (i = index + 1; i < lines.length && line.type === TEXT; ++i)
        component.lines.push(line);

      return { index: i, component };
    }
    // TODO handle if statements

    default:
      return { index: index + 1, component: makeComponent(line.type, line.indent, [line]) };
  }
}


// function procComponents(block) {
//   const components = [];
//
//   for (let i = 0; i < block.lines.length - 1; i++) {
//     const line = block.lines[i];
//     switch (line.type) {
//       case TEXT: {
//         const component = makeComponent(TEXT, block.indent, [line]);
//         for (i += 1; i < block.lines.length && line.type === TEXT; ++i)
//           component.lines.push(line);
//         components.push(component);
//         break;
//       }
//
//       default:
//         components.push(makeComponent(line.type, block.indent, [line]));
//     }
//   }
//
//   const lastComponent = last(block.components);
//   if (lastComponent.type === CHOICE) {
//
//   }
//
//   return components;
// }


function procBlock(lines, index) {
  const block = makeBlock(lines[index].indent);
  let i;
  for (i = index; i < lines.length; i++) {
    const line = lines[i];
    if (line.indent === block.indent)
      block.lines.push(line);
    else if (line.indent > block.indent) {
      const result = procBlock(lines, i);
      block.child = result.block;
      return { index: result.index, block };
    } else
      return { index: i, block };
  }

  return { index: i, block };
}


function procBlocks(lines) {
  return combine(lines, procBlock);
}


function combine(lines, func) {
  const results = [];

  for (let i = 0; i < lines.length; i++) {
    const result = func(lines, i);
    i = result.index;
    results.push(result.block);
  }

  return results;
}
