import { base, cChoice, cIf, cLink, cNext, cText, LinkType, node, scene } from '../data/nodes';


export function getBase(state) {
  return state.chronicler.present.data;
}


export const initialState = {
  chronicler: {
    past: [],
    present: {
      guid: 0,
      uid: 0,
      avail: [],
      data: initData(),
    },
    future: [],
    canUndo: false,
    canRedo: false,
  },
};


function initData() {
  return {
    ...base([

      scene(1, 'scene 1', [

        node(2, null, [
          cText(3, 'text 3'),
          cNext(4, 'next 4', 5),
        ]),

        node(5, null, [
          cText(6, 'text 6'),
          cChoice(7, [
            cLink(8, LinkType.NORMAL, 'choice 8', 2, []),
          ]),
        ]),

      ]),

      scene(9, 'scene 9', [

        node(10, null, [
          cText(11, 'text 3'),
          cNext(12, 'next 4', 13),
        ]),

        node(13, null, [
          cText(14, 'text 6'),

          cIf(15, '',
            [cText(16, '')],
            [cChoice(17, [
              cLink(18, LinkType.NORMAL, 'choice 18', 10, []),
            ]),
            ]),


        ]),

      ]),

    ]),
  };

  // return base([
  //   // SCENE 1
  //   scene(1, 'startup', [
  //     // NodeType 2
  //     node(2, 'Start', [
  //       cText(3, 'A knight...'),
  //       cChoice(4, [
  //         cLink(5, LinkType.NORMAL, 'Fly...', 3, [
  //           cSet(6, 'disdain', '%+', '10'),
  //         ]),
  //         cLink(7, LinkType.NORMAL, 'Charge...', 4, null),
  //       ]),
  //     ]),
  //     // NodeType 3
  //     node(8, null, [
  //       cNext('End Act 1', 5),
  //     ]),
  //     // NodeType 4
  //     node(9, null, [
  //       cNext(10, null, 3),
  //     ]),
  //     // NodeType 5
  //     node(11, null, [
  //       cGotoScene(12, 6, 8),
  //     ]),
  //   ]),
  //   // SCENE 6
  //   scene(13, 'scene_2', [
  //     // NodeType 7
  //     node(14, null, [
  //       cText(15, '...'),
  //       // LABEL 8
  //       cLabel(16, 'middle'),
  //     ]),
  //   ]),
  // ]);
}
