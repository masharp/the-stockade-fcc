'use strict';

/* define modules to pack */
const React = require('react');


export default function Blank(props) {
  return (
    React.createElement('div', { className: 'stock-card', id: 'card-blank' },
      React.createElement('input', { id: 'new-symbol-input', type: 'text', placeholder: 'New Symbol..' }),
      React.createElement('br', null),
      React.createElement('input', { id: 'new-symbol-btn', type: 'button', value: 'Add', onClick: props.add })
    )
  );
}


Blank.propTypes = {
  add: React.PropTypes.func.isRequired,
}
