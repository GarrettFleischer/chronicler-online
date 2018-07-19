export const GOTO = 'GOTO';
export const makeGoto = (labelId) => ({ type: GOTO, labelId });

export const CHOICE = 'CHOICE';
export const makeChoice = (choices) => ({ type: CHOICE, choices });
