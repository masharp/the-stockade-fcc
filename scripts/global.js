'use strict';

/* define modules to pack */
const ReactDOM = require('react-dom');
const React = require('react');
const Socket = require('socket.io-client')();
const HighChart = require('react-highcharts');
const $ = require('jquery').ajax;

import Stockade from './components/Stockade';

const MARKIT_LOOKUP = 'https://crossorigin.me/http://dev.markitondemand.com/Api/v2/Lookup';

const userDimensions = {
  width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
  height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
};

const highChartConfig = {
  rangeSelector: {
    selected: 1
  },
  title: 'Selected Stocks',
  xAxis: {
    title: {
      text: 'One Year'
    },
    crosshair: {
      color: '#000000'
    }
  },
  yAxis: {
    plotLines: [{ value: 0, width: 2, color: 'black' }],
    labels : {
      step: 1
    },
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
    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>${point.y}</b></br>',
    valueDecimals: 2
  },
  series: []
};

/* ------------------------ React Components -------------------------- */
/* central controller for the app - contains main UI and user input elements */
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null, symbols: null, config: this.props.config, api: null };

    this._initiate = this._initiate.bind(this);
    this._update =  this._update.bind(this);
    this._errorAdd = this._errorAdd.bind(this);
    this._errorRemove = this._errorRemove.bind(this);
    this._add = this._add.bind(this);
    this._remove = this._remove.bind(this);

    this.fetchStockData = this.fetchStockData.bind(this);
    this.configureChart = this.configureChart.bind(this);
    this.configureData = this.configureData.bind(this);

    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.testValidSymbol = this.testValidSymbol.bind(this);
  }
  componentDidMount() {
    Socket.on('initiate', this._initiate);
    Socket.on('update', this._update);
    Socket.on('error:add', this._errorAdd);
    Socket.on('error:remove', this._errorRemove);
  }
  _initiate(initial) {
    this.setState({ symbols: initial.list, api: initial.url });
    this.fetchStockData();
  }
  _update(update) {
    const errorElement = document.getElementById('error');
    errorElement.classList.add('hidden');

    this.setState({ symbols: update.list });
    this.fetchStockData();
  }
  _errorAdd(error) {
    const errorElement = document.getElementById('error');
    errorElement.innerHTML = error;
    errorElement.classList.remove('hidden');
  }
  _errorRemove(error) {
    const errorElement = document.getElementById('error');
    errorElement.innerHTML = error;
    errorElement.classList.remove('hidden');
  }
  _add(symbol) {
    Socket.emit('add', symbol);
  }
  _remove(symbol) {
    Socket.emit('remove', symbol);
  }
  fetchStockData() {
    const self = this;
    const params = {
      Normalized: false,
      NumberOfDays: 360,
      DataPeriod: 'Day',
      Elements: this.state.symbols.map((s) => { return ({ Symbol: s, Type: 'Price', Params: ['c'] }); })
    };

    $({
      url: this.state.api,
      data: { parameters: JSON.stringify(params) },
      dataType: 'jsonp',
      success: function(json) {
        if (!json || json.Message) {
          console.error(json.Message);
        }

        self.setState({ data: json });
        self.configureData();
      },
      error: function(response, status) {
        reject({ response, status });
      }
    });
  }
  configureData() {
    const data = this.state.data;
    const configured = [];
    const datesLen = data.Dates.length;
    const symbolLen = data.Elements.length;

    for (let x = 0; x < symbolLen; x++) {
      let element = data.Elements[x];
      let points = [];

      for (let y = 0; y < datesLen; y++) {
        const date = data.Dates[y].split('').slice(0, 10).join(''); // format date
        const dataPoint = element.DataSeries['close'].values[y];

        points.push([date, dataPoint]);
      }

      configured.push({ element, points });
    }

    this.setState({ data: configured });
    this.configureChart();
  }
  configureChart() {
    const data = this.state.data;
    let newConfig = this.state.config;

    newConfig.series = data.map((d) => {
      return ({
        type: 'line',
        name: d.element.Symbol,
        color: function() {
          return (
            /* random hex color generator */
            `#${(Math.floor((Math.random() * 100) + 33).toString(16)) +
            (Math.floor((Math.random() * 100) + 33).toString(16)) +
            (Math.floor((Math.random() * 100) + 33).toString(16))}`
          );
        }(),
        data: d.points
      });
    });

    this.setState({ config: newConfig });
  }
  handleAdd(event) {
    const errorElement = document.getElementById('error');
    const inputElement = document.getElementById('new-symbol-input');
    const newSymbol = inputElement.value;
    const currentSymbols = this.state.symbols;

    inputElement.value = '';
    errorElement.classList.add('hidden');

    this.testValidSymbol(newSymbol).then((test) => {
      if (test || test.symbol) {
        this._add(test.symbol || newSymbol);
        currentSymbols.push(newSymbol);
        this.setState({ symbols: currentSymbols });
      }
      else {
        const errorElement = document.getElementById('error');
        errorElement.innerHTML = 'Invalid Stock Symbol';
        errorElement.classList.remove('hidden');
      }
    }).catch((testError) => console.error(testError));
  }
  handleRemove(event) {
    const symbol = event.target.classList[1];
    const currentSymbols = this.state.symbols.filter((x) => x !== symbol);

    this.setState({ symbols: currentSymbols });
    this._remove(symbol);
  }
  /* Test if an input stock symbol is valid and/or assume probable if close */
  testValidSymbol(symbol) {
    return new Promise((resolve, reject) => {
      const url = `${MARKIT_LOOKUP}/jsonp`;

      $({
        url,
        data: { input: symbol },
        dataType: 'jsonp',
        success: function(json) {
          if (!json || json.Message || !json.length > 0) {
            resolve(false);
            console.error(json.Message);
          } else if (json[0].Symbol !== symbol) resolve(false);
          else resolve(true);
        },
        error: function(response, status) {
          reject({ response, status });
        }
      });
    });
  }
  render() {
    if (this.state.symbols !== null) {
      return (
        React.createElement('div', { id: 'main-component' },
          React.createElement('div', { id: 'line-chart' },
          /* React-D3 Line Chart, formatted */
            React.createElement(HighChart, { config: this.props.config })
          ),
          React.createElement('div', { id: 'error', className: 'hidden' }),
          React.createElement(Stockade, { symbols: this.state.symbols, remove: this.handleRemove, add: this.handleAdd })
        )
      );
    } else {
      return (React.createElement('div', null));
    }
  }
}

Main.propTypes = {
  graphDimensions: React.PropTypes.object.isRequired,
  config: React.PropTypes.object.isRequired
}

ReactDOM.render(React.createElement(Main, { graphDimensions: userDimensions, config: highChartConfig }),
  document.getElementById('main'));
