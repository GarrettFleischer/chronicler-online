/* eslint-disable react/jsx-indent */
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-intl-redux';
import { BrowserRouter } from 'react-router-dom';
import { initialState } from './data/state';
import configureStore from './data/store';
import './index.css';
import App from './pages/App';
import registerServiceWorker from './registerServiceWorker';
import MainRoute from './routes/MainRoute';
import { chroniclerTheme } from './theme';


const store = configureStore(initialState);


ReactDOM.render((
    <Provider store={store}>
      <MuiThemeProvider theme={chroniclerTheme}>
        <BrowserRouter>
          <App>
            <MainRoute />
          </App>
        </BrowserRouter>
      </MuiThemeProvider>
    </Provider>
  ),
  document.getElementById('root'),
);

registerServiceWorker();
