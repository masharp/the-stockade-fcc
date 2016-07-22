'use strict';

/* define modules to pack */
const React = require('react');


export default function Stock(props) {
  const symbol = props.symbol;

  return (
    React.createElement('div', { className: 'stock-card', id: `card-${symbol}` },
      React.createElement('i', { className: `stock-remove ${symbol}`, onClick: props.remove }, 'X'),
      React.createElement('br', null),
      React.createElement('span', { className: 'stock-card-symbol' }, symbol)
    )
  );
}

Stock.propTypes = {
  remove: React.PropTypes.func.isRequired,
  symbol: React.PropTypes.string.isRequired,
}
