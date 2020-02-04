import "regenerator-runtime/runtime";
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './style.css';

chrome.devtools.inspectedWindow.eval('window.__RESELECT_TOOLS__.getAllGoodSelectorsTableData()', (result) => {
  ReactDOM.render(<App selectors={result} />, document.getElementById('panel'));
});


