import { base, cChoice, cGotoScene, cLabel, cLink, cNext, cSet, cText, LinkType, node, scene } from './nodes';


export const initialState = {
  chronicler: {
    past: [],
    present: {
      unid: {
        guid: 0,
        uid: 0,
        avail: [],
        data: initData(),
      },
    },
    future: [],
    canUndo: false,
    canRedo: true,
  },
};


function initData() {
  base([
    // SCENE 1
    scene(1, 'startup', [
      // NodeType 2
      node(2, 'Start', [
        cText(3, 'A knight...'),
        cChoice(4, [
          cLink(5, LinkType.NORMAL, 'Fly...', 3, [
            cSet(6, 'disdain', '%+', '10'),
          ]),
          cLink(7, LinkType.NORMAL, 'Charge...', 4, null),
        ]),
      ]),
      // NodeType 3
      node(8, null, [
        cNext('End Act 1', 5),
      ]),
      // NodeType 4
      node(9, null, [
        cNext(10, null, 3),
      ]),
      // NodeType 5
      node(11, null, [
        cGotoScene(12, 6, 8),
      ]),
    ]),
    // SCENE 6
    scene(13, 'scene_2', [
      // NodeType 7
      node(14, null, [
        cText(15, '...'),
        // LABEL 8
        cLabel(16, 'middle'),
      ]),
    ]),
  ]);
}