import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './containers/App/App';
import initialState from './data/initialState';
import './index.css';
import registerServiceWorker from './lib/registerServiceWorker';
import MainRoute from './routes/Main';
import configureStore from './store/configureStore';


const store = configureStore(initialState);


ReactDOM.render((
    <Provider store={store}>
      <BrowserRouter>
        <App>
          <MainRoute />
        </App>
      </BrowserRouter>
    </Provider>
  ),
  document.getElementById('root'),
);
registerServiceWorker();
