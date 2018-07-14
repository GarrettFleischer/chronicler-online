export const UI_SHOW_RADIAL_MENU = 'UI_SHOW_RADIAL_MENU';
export const showRadialMenu = (id, show, x = 0, y = 0) => ({ type: UI_SHOW_RADIAL_MENU, id, show, x, y });

export const UI_RADIAL_MENU_TOGGLE = 'UI_RADIAL_MENU_TOGGLE';
export const toggleRadialMenu = (id, x = 0, y = 0) => ({ type: UI_RADIAL_MENU_TOGGLE, id, x, y });

export const UI_RADIAL_MENU_POSITION = 'UI_RADIAL_MENU_POSITION';
export const setRadialMenuPosition = (id, x, y) => ({ type: UI_RADIAL_MENU_POSITION, id, x, y });

const setForId = (state, id, data) => ({ ...state, [id]: { ...state[id], ...data } } );

export const uiRadialMenu = (state = {}, action) => {
  switch (action.type) {
    case UI_SHOW_RADIAL_MENU:
      return setForId(state, action.id, { show: action.show, x: action.x, y: action.y });

    case UI_RADIAL_MENU_TOGGLE:
      return setForId(state, action.id, { show: !state[action.id].show, x: action.x, y: action.y });

    case UI_RADIAL_MENU_POSITION:
      return setForId(state, action.id, { x: action.x, y: action.y });

    default:
      return state;
  }
};

export const uiRadialMenuInitialState = {
  show: false,
  x: 0,
  y: 0,
};
