import * as React from 'react';
import { App } from 'app';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import store from './Store/index';
import 'react-toastify/dist/ReactToastify.css';
import 'sanitize.css/sanitize.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HelmetProvider>
    <Provider store={store}>
      <ToastContainer theme="light" />
      <App />
    </Provider>
  </HelmetProvider>,
);
