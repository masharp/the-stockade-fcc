'use strict';
(function iife() {
  /* define browserify modules to pack */
  const ReactDOM = require('react-dom');
  const React = require('react');
  const Request = require('request');
  const LineChart = require('react-d3').LineChart;
  const D3Time = require('d3').time;
  const Socket = require('socket.io-client')();
  const userDimensions = {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  }

  /* ------------------------ React Components -------------------------- */
  /* central controller for the app - contains main UI and user input elements */
  class Controller extends React.Component {
    constructor(props) {
      super(props);
      this.state = { stockData: [] };
    }
    componentDidMount() {
      Socket.on('update', this._stocksUpdated.bind(this));
    }
    _stocksUpdated(update) {
      console.log(update);
      this.setState({ stockData: update });
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
          /* React-D3 Line Chart, formatted */
            React.createElement(LineChart, { id: 'chrt', title: 'Price Index (since Jan. 2014)', data: this.state.stockData,
              width: this.props.graphDimensions.width - 75, height: this.props.graphDimensions.height / 1.3,
              xAccessor: (d) => {
                let formatter = D3Time.format('%Y-%m-%d').parse;
                if(typeof d.x === 'string') return formatter(d.x);
                else return d.x;
              },
              onMouseOver: (component, d, i) => {
                console.log('Over');
              },
              yAxisLabel: 'Price per Share (USD)', xAxisLabel: 'Time (month)', gridVertical: true,
              legend: true, fill: 'white' })
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

  Controller.propTypes = { graphDimensions: React.PropTypes.object.isRequired }

  ReactDOM.render(React.createElement(Controller, { graphDimensions: userDimensions }), document.getElementById('loader'));
}());
