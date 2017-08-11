/* eslint-disable react/jsx-indent */
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-intl-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './containers/App';
import { initialState } from './data/state';
import configureStore from './data/store';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import MainRoute from './routes/Main';
import { chroniclerTheme } from './theme';


const store = configureStore(initialState);


ReactDOM.render((
    <MuiThemeProvider theme={chroniclerTheme}>
      <Provider store={store}>
        <BrowserRouter>
          <App>
            <MainRoute />
          </App>
        </BrowserRouter>
      </Provider>
    </MuiThemeProvider>
  ),
  document.getElementById('root'),
);
registerServiceWorker();
