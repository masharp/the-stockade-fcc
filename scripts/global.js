'use strict';

/* define modules to pack */
const ReactDOM = require('react-dom');
const React = require('react');
const Socket = require('socket.io-client')();
const HighChart = require('react-highcharts');
const $ = require('jquery').ajax;

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
    this._submit = this._submit.bind(this);
    this._remove = this._remove.bind(this);

    this.fetchStockData = this.fetchStockData.bind(this);
    this.configureChart = this.configureChart.bind(this);
    this.configureData = this.configureData.bind(this);
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
    this.setState({ symbols: initial.list, api: initial.url });
    this.fetchStockData();
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
  render() {
    if (this.state.symbols !== null) {
      return (
        React.createElement('div', { id: 'main' },
          React.createElement('div', { id: 'error', className: 'hidden' }),
          React.createElement('div', { id: 'line-chart' },
          /* React-D3 Line Chart, formatted */
            React.createElement(HighChart, { config: this.props.config })
          ),
          React.createElement(Stockade, { symbols: this.state.symbols })
        )
      );
    } else {
      return (React.createElement('div', null));
    }
  }
}

const Stockade = (props) => {
  let stockNodes = props.symbols.map((s) => {
    return (
      React.createElement(Stock, { symbol: s })
    )
  });

  return (
    React.createElement('div', { id: 'stockade' }, stockNodes)
  )
};

const Stock = (props) => React.createElement('span', null, `${props.symbol} `);

Main.propTypes = {
  graphDimensions: React.PropTypes.object.isRequired,
  config: React.PropTypes.object.isRequired
 }

ReactDOM.render(React.createElement(Main, { graphDimensions: userDimensions, config: highChartConfig }),
  document.getElementById('main'));
