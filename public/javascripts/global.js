'use strict';

(function iife() {
  /* define browserify modules to pack */
  const ReactDOM = require('react-dom');
  const React = require('react');
  const Request = require('request');
  const Socket = require('socket.io-client')();
  const HighChart = require('react-highcharts');

  const userDimensions = {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  };

  const highChartConfig = {

  };

  /* ------------------------ React Components -------------------------- */
  /* central controller for the app - contains main UI and user input elements */
  class Controller extends React.Component {
    constructor(props) {
      super(props);
      this.state = { stockData: [], stockSymbols: [] , validSymbols: [] };
    }
    componentDidMount() {
      Socket.on('initiate', this.handleStockInitiate.bind(this));
      Socket.on('update', this.handleStockUpdate.bind(this));
    }
    handleStockInitiate(initial) {
      if(this.state.stockSymbols.length === 0) this.setState({ stockSymbols: initial.data.map((d) => { return d.name; })});
      if(this.state.stockData.length === 0) this.setState({ stockData: initial.data });
    }
    handleStockUpdate(update) {
      this.setState({ stockSymbols: update.map((d) => {return d.name; }), stockData: update });
    }
    formatX(d) {
      let formatter = D3Time.format('%Y-%m-%d').parse;
      if(typeof d.x === 'string') return formatter(d.x);
      else return d.x;
    }
    handleSymbolSubmit(symbol) {
      if(Validator(symbol)) {
        Socket.emit('added', symbol);
      } else {
        let errorElement = document.getElementById('error');
        errorElement.classList.innerHTML('NOT A VALID STOCK SYMBOL.');
        errorElement.classList.remove('hidden');
      }
    }
    handleSymbolRemove(symbol) {
      Socket.emit('removed', symbol);
    }
    render() {
      return (
        React.createElement('div', { id: 'main' },
          React.createElement('div', { id: 'error', className: 'hidden' }),
          React.createElement('div', { id: 'line-chart' },
          /* React-D3 Line Chart, formatted */
            React.createElement(HighChart, { config: this.props.config })
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

  Controller.propTypes = {
    graphDimensions: React.PropTypes.object.isRequired,
    config: React.PropTypes.object.isRequired
   }

  ReactDOM.render(React.createElement(Controller, { graphDimensions: userDimensions, config: highChartConfig }),
    document.getElementById('loader'));
}());
