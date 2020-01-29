import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'chrome-extension-async';


async function doSomething(script) {
  try {

    /* eslint-disable no-undef */
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];

    /* eslint-disable no-undef */
    const results = await chrome.tabs.executeScript(activeTab.id, { code: script });
    const firstScriptResult = results[0];
    return firstScriptResult;
  }
  catch(err) {
    // Handle errors from chrome.tabs.query, chrome.tabs.executeScript or my code
  }
}


const result = doSomething('JSON.stringify(window.__RESELECT_TOOLS__.selectorGraph())').then((result) => {
  ReactDOM.render(<App/>, document.getElementById('root'));
});
