

(function() {
  /* define browserify modules to pack */
  var ReactDOM = require("react-dom");
  var React = require("react");
  var Redux = require("redux");
  var Request = require("request");

  /* ------------------------ React Components -------------------------- */
  /* central controller for the app - contains main UI and user input elements */
  var Controller = React.createClass({ displayName: "Controller",
    getInitialState: function getInitialState() {
      return { };
    },
    render: function render() {
      return(
        React.createElement("div", { id: "main" }
        )
      );
    }
  });

  ReactDOM.render(React.createElement(Controller, { }), document.getElementById("loader"));
})();
