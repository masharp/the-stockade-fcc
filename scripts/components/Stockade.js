'use strict';

/* define modules to pack */
const React = require('react');

import Stock from './Stock';
import Blank from './Blank';


export default function Stockade(props) {
  let stockNodes = props.symbols.map((s, i) => {
    return (
      React.createElement(Stock, { symbol: s, remove: props.remove, key: `stock-${i}` })
    );
  });

  return (
    React.createElement('div', { id: 'stockade' }, stockNodes,
      React.createElement('br', null),
      React.createElement(Blank, { add: props.add })
    )
  )
};

Stockade.propTypes = {
  remove: React.PropTypes.func.isRequired,
  add: React.PropTypes.func.isRequired,
  symbols: React.PropTypes.array.isRequired,
}
