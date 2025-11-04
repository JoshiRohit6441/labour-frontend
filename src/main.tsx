import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { JobProvider } from './store/JobContext';
import { SocketProvider } from './store/SocketContext';
import { Provider } from 'react-redux';
import { store } from './store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <JobProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </JobProvider>
    </Provider>
  </React.StrictMode>
);
