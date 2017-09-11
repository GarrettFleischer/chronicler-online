export const TEXT = 'TEXT';


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

    result.push(makeLine(TEXT, i, raw, indent, text));
  });

  return result;
}
