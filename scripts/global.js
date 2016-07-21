'use strict';

/* define modules to pack */
const ReactDOM = require('react-dom');
const React = require('react');
const XHR = require('xhr');
const Socket = require('socket.io-client')();
const HighChart = require('react-highcharts');

const userDimensions = {
  width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
  height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
};

const highChartConfig = {
  rangeSelector: {
    selected: 4
  },
  title: 'Selected Stocks',
  yAxis: {
    labels: {
      formatter: () => (this.value > 0 ? ' + ' : '') + this.value + '%'
    },
    title: {
      text: 'Time'
    },
    plotLines: [{ value: 0, width: 2, color: 'silver' }]
  },
  yAxis: {
    title: {
      text: 'Price per Share (USD)'
    }
  },
  plotOptions: {
    series: {
      compare: 'percent'
    }
  },
  tooltip: {
    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change} %)</br>',
    valueDecimals: 2
  },
  series: []
};

/* ------------------------ React Components -------------------------- */
/* central controller for the app - contains main UI and user input elements */
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { stockData: [], stockSymbols: [], chartConfig: this.props.config };

    this._initiate = this._initiate.bind(this);
    this._update =  this._update.bind(this);
    this._errorAdd = this._errorAdd.bind(this);
    this._errorRemove = this._errorRemove.bind(this);
    this._submit = this._submit.bind(this);
    this._remove = this._remove.bind(this);
  }
  componentDidMount() {
    Socket.on('initiate', this._initiate);
    Socket.on('update', this._update);
    Socket.on('submit', this._submit);
    Socket.on('remove', this._remove);
    Socket.on('error:add', this._errorAdd);
    Socket.on('error:remove', this._errorRemove);
  }
  _initiate(initial) {
    if (this.state.stockSymbols.length === 0) this.setState({ stockSymbols: initial.map((d) => { return d.name; })});
    if (this.state.stockData.length === 0) this.setState({ stockData: initial });

    let newConfig = this.state.chartConfig;
    newConfig.series =  initial;
    this.setState({ chartConfig: newConfig });
  }
  _update(update) {
    this.setState({ stockSymbols: update.map((d) => {return d.name; }), stockData: update });
  }
  _errorAdd(error) {
    let errorElement = document.getElementById('error');
    errorElement.classList.innerHTML(error);
    errorElement.classList.remove('hidden');
  }
  _errorRemove(error) {
    let errorElement = document.getElementById('error');
    errorElement.classList.innerHTML(error);
    errorElement.classList.remove('hidden');
  }
  _submit(symbol) {
    Socket.emit('added', symbol);
  }
  _remove(symbol) {
    Socket.emit('removed', symbol);
  }
  formatX(d) {
    let formatter = D3Time.format('%Y-%m-%d').parse;
    if (typeof d.x === 'string') return formatter(d.x);
    else return d.x;
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

Main.propTypes = {
  graphDimensions: React.PropTypes.object.isRequired,
  config: React.PropTypes.object.isRequired
 }

ReactDOM.render(React.createElement(Main, { graphDimensions: userDimensions, config: highChartConfig }),
  document.getElementById('main'));
