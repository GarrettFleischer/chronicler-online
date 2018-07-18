export const Goto = 'Goto';
export const makeGoto = (labelId) => ({ type: Goto, labelId });

export const Choice = 'Choice';
export const makeChoice = (choices) => ({ type: Choice, choices });
