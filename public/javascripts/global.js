'use strict';
(function iife() {
  /* define browserify modules to pack */
  const ReactDOM = require('react-dom');
  const React = require('react');
  const Request = require('request');
  const LineChart = require('react-d3').LineChart;
  const Socket = require('socket.io-client')();
  var lineData = [
  {
    name: "series1",
    values: [ { x: 0, y: 20 }, { x: 24, y: 10 } ],
    strokeWidth: 3
  },
  {
    name: "series2",
    strokeWidth: 3,
    values: [ { x: 200, y: 82 }, { x: 302, y: 82 } ]
  }
];
  /* ------------------------ React Components -------------------------- */
  /* central controller for the app - contains main UI and user input elements */
  class Controller extends React.Component {
    constructor(props) {
      super(props);
      this.state = { stockData: [], tempData: lineData };
    }
    componentDidMount() {
      Socket.on('update', this._stocksUpdated.bind(this));
    }
    _stocksUpdated(update) {
      this.setState({ stockData: [] });
    }
    handleSymbolSubmit(symbol) {
      Socket.emit('added', symbol);
    }
    handleSymbolRemove(symbol) {
      Socket.emit('removed', symbol);
    }
    render() {
      return (
        React.createElement('div', { id: 'main' },
          React.createElement('div', { id: 'line-chart' },
            React.createElement(LineChart, { fill: 'white', title: 'Observed Stock Symbols', width: 1000,
              data: this.state.tempData })
          ),
          React.createElement(Stockade, { })
        )
      );
    }
  }

  class Stockade extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        React.createElement('div', { id: 'stockade' },
          React.createElement(Stock, { data: 'Stock' })
        )
      );
    }
  }

  const Stock = (props) => React.createElement('div', {}, props.data);

  Controller.propTypes = { }

  ReactDOM.render(React.createElement(Controller, { }), document.getElementById('loader'));
}());
