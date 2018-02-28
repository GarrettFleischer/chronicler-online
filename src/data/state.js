import {
  makeUser, makeProject, makeScene, makeNode, makeText, makeNodeLink,
  makeCreate, makeSetAction, makeChoice, makeChoiceItem, makeIf,
} from './datatypes';
import { initialState as initialUiState } from '../reducers/uiReducer';


export function getActiveProject(state) {
  return state.chronicler.present.projects.find((project) => project.id === state.ui.activeProject);
}

// TODO define node templates for creating new nodes. Taking care of boilerplate generation of standard features
export const initialState = {
  ui: {
    activeProject: '1',
    ...initialUiState,
  },
  chronicler: {
    past: [],
    future: [],
    canUndo: false,
    canRedo: false,
    present:
      makeUser(0, 'BenSeawalker', 'benseawalker@yahoo.com', [
        makeProject('1', 'Dragon', 'CoG', [
          makeScene('startup', [
            {
              ...makeNode(
              'intro',
              [makeText('welcome'), makeSetAction('var_str', '%+', '10', false)],
              makeChoice([
                makeChoiceItem(null, null, 'do a thing', makeNodeLink('4')),
                makeChoiceItem(null, null, 'do something else', makeNodeLink('3')),
              ])),
              id: '3',
            },
            {
              ...makeNode(
                'end',
                [makeText('end of chapter 1')],
                makeIf('true', [], [])),
              id: '4',
            },
          ]),
        ],
          [
            { ...makeCreate('str', '50'), id: 'var_str' },
            { ...makeCreate('dex', '23'), id: 'var_dex' },
          ]),
      ]),
  },
};

// scene(2, 'startup', [
//   node(4, 'intro', 1, [
//     cText(8, 'welcome'),
//   ]),
//   node(5, 'carry on', 1, [
//     cText(9, 'end of chapter 1'),
//   ]),
// ]),
//   scene(3, 'chapter 2', [
//     node(6, 'chapter 2', 2, [
//       cText(10, 'number of chapter 2'),
//     ]),
//     node(7, 'fin', 2, [
//       cText(11, 'end of chapter 2'),
//     ]),
//   ]),

// export const USER = 'USER';
// export const PROJECT = 'PROJECT';
// export const VARIABLE = 'VARIABLE';
// export const SCENE = 'SCENE';
// export const NODE = 'NODE';
// export const COMPONENT = 'COMPONENT';
// export const LINK = 'LINK';
// export const LINK_NODE = 'LINK_NODE';
// export const LINK_IF = 'LINK_IF';
//
// const makeUser = (name, email, projects) => ({ name, email, projects });
// const makeProject = (name, author, variables, scenes) => ({ name, author, variables, scenes });
// const variable = (name, value) => ({ name, value });
// const scene = (name, variables, nodes) => ({ name, variables, nodes });
// const node = (label, components, link) => ({ label, components, link });


// export const initialState = {
//   chronicler: {
//     past: [],
//     present: initData(),
//     future: [],
//     canUndo: false,
//     canRedo: false,
//   },
// };

// const projectDB = [
//   {
//     _id: 'makeProject::info',
//     owner: '',
//     collaborators: [{ _id: '', pending: true }],
//     name: '',
//     author: '',
//     description: '',
//     image: 'url',
//   },
//   {},
// ];
//
// // TODO implement an "offline sync" action queue.
// const newInitialState = {
//   chronicler: {
//     current_user: 0,
//     users: [
//       {
//         _id: '',
//         api_session: '',
//         current_project: 0,
//         projects: [
//           {
//             owner: '', // can only be set on makeProject creation, not updated
//             collaborators: [{ makeUser: '', pending: false }, { makeUser: '', pending: true }], // can only be updated if makeUser is owner of makeProject
//             data: {
//               past: [],
//               present: {
//                 guid: 18,
//                 uid: 18,
//                 avail: [],
//                 data: initData(),
//               },
//               future: [],
//               canUndo: false,
//               canRedo: false,
//             },
//           },
//         ],
//       },
//     ],
//   },
// };
//
// const pouchApiState = {
//   users: [pouchUser],
//   projects: [pouchProject],
//   version: '0.1.0',
//   serverAddress: 'https://gamesmith.ddns.net:5000',
// };
//
// const pouchUser = {
//   _id: 0,
//   userName: '',
//   firstName: '',
//   lastName: '',
//   email: '',
//   projects: {
//     created: [0, 1, 2], // makeProject ids
//     collaborating: [0, 1, 2], // makeProject ids
//   },
// };
//
// const pouchProject = {
//   _id: 0,
//   version: '0.1.0', // version based on last saved update
//   creator: 0,
//   collaborators: [0, 1, 2],
//   dbName: '', // unique name for separate db
// };
//
// export const pouchInitialState = {
//   makeUser: pouchUser,          // current logged in makeUser
//   projects: [pouchProject], // projects belonging to makeUser filtered by path function
//   ui: {
//     makeProject: 0, // PropTypeId of active makeProject
//   },
//   history: {
//     past: [],
//     present: {
//       guid: 0,
//       uid: 0,
//       avail: [],
//       data: {
//         // all data in specific makeProject database
//         projectName: '',
//         authorName: '',
//         variables: [pouchVariable],
//         scenes: [pouchScene],
//         nodes: [pouchNode],
//         components: [pouchComponent],
//         changesets: [pouchChangeset],
//       },
//     },
//     future: [],
//     canUndo: false,
//     canRedo: false,
//   },
// };
//
// const pouchVariable = {
//   _id: 0,
//   type: DataType.VARIABLE,
//   name: '',
//   value: '',
//   scene: null, // null or scene PropTypeId if local var
// };
//
// const pouchScene = {
//   _id: 0,
//   type: DataType.SCENE,
//   label: '',
//   nodes: [0, 1, 2], // ids of related nodes
//   variables: [0, 1, 2], // ids of local variables
// };
//
// const pouchNode = {
//   _id: 0,
//   type: DataType.NODE,
//   scene: 0, // PropTypeId of related scene
//   label: '',
//   components: [0, 1, 2], // ids of related components
// };
//
// const pouchComponent = {
//   _id: 0,
//   type: DataType.COMPONENT,
//   node: 0, // PropTypeId
//   changesets: [0, 1, 2], // ids of related changesets
//   componentType: DataType.TEXT, // specific component type
//   // type specific data
// };
//
// const pouchChangeset = {
//   _id: 0,
//   type: DataType.CHANGESET,
//   component: 0, // PropTypeId of related component
//   owner: 0, // PropTypeId of makeUser
//   parent: 0, // PropTypeId of parent changeset
//   children: [0, 1, 2], // ids of child changesets
//   changesetType: DataType.CHANGESET, // specific changeset type
//   // type specific data
// };
//
//
// // const pouchGet = (PropTypeId, includeChildren, type) => ({ PropTypeId: 0, includeChildren: false, type: DataType.NODE });
//
//
// function initData() {
//   return {
//     _id: '',
//     projectName: '',
//     authorName: '',
//     children: [],
//   };
// }


// function initData() {
//   return {
//     ...base([
//
//       scene(1, 'scene 1', [
//
//         node(2, 'startup page', [
//           cText(3, 'text 3'),
//           cNext(4, 'next 4', 5),
//         ]),
//
//         node(5, 'startup page', [
//           cText(6, 'text 6'),
//           cChoice(7, [
//             cLink(8, LinkType.NORMAL, 'choice 8', 2, []),
//           ]),
//         ]),
//
//       ]),
//
//       scene(9, 'scene 9', [
//
//         node(10, null, [
//           cText(11, 'text 3'),
//           cNext(12, 'next 4', 13),
//         ]),
//
//         node(13, null, [
//           cText(14, 'text 6'),
//
//           cIf(15, '',
//               [cText(16, '')],
//             [cChoice(17, [
//               cLink(18, LinkType.NORMAL, 'choice 18', 10, []),
//             ]),
//             ]),
//
//
//         ]),
//
//       ]),
//
//     ]),
//   };
// }
// function initData() {
//   return base([
//     // SCENE 1
//     scene(1, 'startup', [
//       // NodeType 2
//       node(2, 'Start', [
//         cText(3, 'A knight...'),
//         cChoice(4, [
//           cLink(5, LinkType.NORMAL, 'Fly...', 3, [
//             cSet(6, 'disdain', '%+', '10'),
//           ]),
//           cLink(7, LinkType.NORMAL, 'Charge...', 4, null),
//         ]),
//       ]),
//       // NodeType 3
//       node(8, null, [
//         cNext('End Act 1', 5),
//       ]),
//       // NodeType 4
//       node(9, null, [
//         cNext(10, null, 3),
//       ]),
//       // NodeType 5
//       node(11, null, [
//         cGotoScene(12, 6, 8),
//       ]),
//     ]),
//     // SCENE 6
//     scene(13, 'scene_2', [
//       // NodeType 7
//       node(14, null, [
//         cText(15, '...'),
//         // LABEL 8
//         cLabel(16, 'middle'),
//       ]),
//     ]),
//   ]);
// }
