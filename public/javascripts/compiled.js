'use strict';

(function iife() {
  /* define browserify modules to pack */
  const ReactDOM = require('react-dom');
  const React = require('react');
  const Redux = require('redux');
  const Request = require('request');
  const D3 = require('react-d3');

  /* ------------------------ React Components -------------------------- */
  /* central controller for the app - contains main UI and user input elements */
  class Controller extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    render() {
      return React.createElement('div', { id: 'main' });
    }
  }

  Controller.propTypes = {};
  ReactDOM.render(React.createElement(Controller, {}), document.getElementById('loader'));
})();
