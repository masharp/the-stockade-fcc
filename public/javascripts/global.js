'use strict';
(function iife() {
  /* define browserify modules to pack */
  const ReactDOM = require('react-dom');
  const React = require('react');
  const Request = require('request');
  const D3 = require('react-d3');
  const Socket = require('socket.io-client')();

  /* ------------------------ React Components -------------------------- */
  /* central controller for the app - contains main UI and user input elements */
  class Controller extends React.Component {
    constructor(props) {
      super(props);
      this.state = { stockData: {} };
    }
    componentDidMount() {
      Socket.on('symbols:initiate', this._stocksUpdated.bind(this));
      Socket.on('symbols:update', this._stocksUpdated.bind(this));
    }
    _stocksUpdated(update) {
      this.setState({ stockData: update.data });
    }
    handleSymbolSubmit(symbol) {
      Socket.emit('symbols:added', symbol);
    }
    handleSymbolRemove(symbol) {
      Socket.emit('symbols:removed', symbol);
    }
    render() {
      return (
        React.createElement('div', { id: 'main' }
        )
      );
    }
  }

  Controller.propTypes = { }

  ReactDOM.render(React.createElement(Controller, { }), document.getElementById('loader'));
}());
