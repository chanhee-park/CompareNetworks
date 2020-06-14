var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "app" },
        React.createElement(
          "div",
          { className: "row row--first" },
          React.createElement(
            "div",
            { className: "section section__scatter", id: "svg_parent__scatter" },
            React.createElement(ScatterPlot, { networks: this.props.networks })
          ),
          React.createElement("div", { className: "section section__pcoord" })
        ),
        React.createElement(
          "div",
          { className: "row row--second" },
          React.createElement(
            "div",
            { className: "container container__diagram container__diagram--small" },
            React.createElement("div", { className: "section section__diagram section__diagram--small" }),
            React.createElement("div", { className: "section section__diagram section__diagram--small" })
          ),
          React.createElement(
            "div",
            { className: "container container__diagram container__diagram--large" },
            React.createElement("div", { className: "section section__diagram section__diagram--large" })
          ),
          React.createElement(
            "div",
            { className: "container container__diagram container__diagram--large" },
            React.createElement("div", { className: "section section__diagram section__diagram--large" })
          ),
          React.createElement(
            "div",
            { className: "container container__diagram container__diagram--small" },
            React.createElement("div", { className: "section section__diagram section__diagram--small" }),
            React.createElement("div", { className: "section section__diagram section__diagram--small" })
          )
        )
      );
    }
  }]);

  return App;
}(React.Component);