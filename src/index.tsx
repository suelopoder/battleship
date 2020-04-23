import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { getGameId } from './helpers';

ReactDOM.render(
  <React.StrictMode>
    <App gameId={getGameId()}/>
  </React.StrictMode>,
  document.getElementById('root')
);
