import {
  ACHIEVE,
  ACHIEVEMENT,
  ALLOW_REUSE,
  AUTHOR,
  BUG,
  CHECK_ACHIEVEMENTS,
  CHOICE,
  CHOICE_ITEM,
  FINISH,
  makeLine,
  TEXT,
  tokenize,
} from '../tokenizer';


describe('tokenizer', () => {
  it('handles indentation', () => {
    const cs = 'text\n    text\n\t\ttext';
    const expected = [
      makeLine(TEXT, 0, 'text', 0, 'text'),
      makeLine(TEXT, 1, '    text', 4, 'text'),
      makeLine(TEXT, 2, '\t\ttext', 2, 'text'),
    ];
    const result = tokenize(cs);

    expect(result.tokens).toEqual(expected);
  });

  it('handles text', () => {
    const cs = 'hello world';
    const expected = [
      makeLine(TEXT, 0, 'hello world', 0, 'hello world'),
    ];
    const result = tokenize(cs);

    expect(result).toEqual(expected);
  });

  it('handles *achieve', () => {
    const cs = '*achieve mystery1\n*achieve\t\tmystery1';
    const expected = [
      makeLine(ACHIEVE, 0, '*achieve mystery1', 0, 'mystery1'),
      makeLine(ACHIEVE, 1, '*achieve\t\tmystery1', 0, 'mystery1'),
    ];
    const result = tokenize(cs);

    expect(result).toEqual(expected);
  });

  it('handles *achievement', () => {
    const cs =
      '*achievement mystery1 visible 10 Lost Souls\n' +
      '\tInvestigate what became of the missing villagers.\n' +
      '\tDiscovered the fate of the hapless villagers.';
    const expected = [
      makeLine(ACHIEVEMENT, 0, '*achievement mystery1 visible 10 Lost Souls', 0, 'mystery1 visible 10 Lost Souls'),
      makeLine(TEXT, 1, '\tInvestigate what became of the missing villagers.', 1, 'Investigate what became of the missing villagers.'),
      makeLine(TEXT, 2, '\tDiscovered the fate of the hapless villagers.', 1, 'Discovered the fate of the hapless villagers.'),
    ];
    const result = tokenize(cs);

    expect(result).toEqual(expected);
  });

  it('handles *allow_reuse', () => {
    const cs = '    *allow_reuse #Eat some food.';
    const expected = [
      makeLine(ALLOW_REUSE, 0, '    *allow_reuse #Eat some food.', 4, '#Eat some food.'),
    ];
    const result = tokenize(cs);

    expect(result).toEqual(expected);
  });

  it('handles *author', () => {
    const cs = '*author CoG';
    const expected = [
      makeLine(AUTHOR, 0, '*author CoG', 0, 'CoG'),
    ];
    const result = tokenize(cs);

    expect(result).toEqual(expected);
  });

  it('handles *bug', () => {
    const cs = '*bug error';
    const expected = [
      makeLine(BUG, 0, '*bug error', 0, 'error'),
    ];
    const result = tokenize(cs);

    expect(result).toEqual(expected);
  });

  it('handles *check_achievements', () => {
    const cs = '*check_achievements';
    const expected = [
      makeLine(CHECK_ACHIEVEMENTS, 0, '*check_achievements', 0, ''),
    ];
    const result = tokenize(cs);

    expect(result).toEqual(expected);
  });

  it('handles *choice', () => {
    const cs =
      '*choice\n' +
      '\t#horse\n' +
      '\t\tYou have chosen a horse!\n' +
      '\t\t*finish';
    const expected = [
      makeLine(CHOICE, 0, '*choice', 0, ''),
      makeLine(CHOICE_ITEM, 1, '\t#horse', 1, 'horse'),
      makeLine(TEXT, 2, '\t\tYou have chosen a horse!', 2, 'You have chosen a horse!'),
      makeLine(FINISH, 3, '\t\t*finish', 2, ''),
    ];
    const result = tokenize(cs);

    expect(result).toEqual(expected);
  });
});

