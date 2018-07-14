import { uiWindow } from '../../../components/WindowResizeHOC/reducers';
import { uiRadialMenu } from '../../../components/RadialMenu/reducers';
import { uiFlowchart } from '../../../components/Flowchart/reducers';
import { combineReducers } from 'redux';
import { intlReducer } from 'react-intl-redux';


const rootReducer = combineReducers({
  intl: intlReducer,
  ui: combineReducers({ uiWindow, uiRadialMenu, uiFlowchart }),
});

export default rootReducer;
