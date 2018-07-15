import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-intl-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './pages/App';
import configureStore from './redux/store';
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render((
    <Provider store={configureStore()}>
      <App />
    </Provider>
  ),
  document.getElementById('root')
);
registerServiceWorker();
