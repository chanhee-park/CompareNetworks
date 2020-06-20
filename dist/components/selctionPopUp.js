var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SelectionPopUp = function (_React$Component) {
  _inherits(SelectionPopUp, _React$Component);

  function SelectionPopUp(props) {
    _classCallCheck(this, SelectionPopUp);

    return _possibleConstructorReturn(this, (SelectionPopUp.__proto__ || Object.getPrototypeOf(SelectionPopUp)).call(this, props));
  }

  _createClass(SelectionPopUp, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { id: "selctionPopUp" },
        React.createElement(
          "div",
          { className: "title" },
          "Show Network Diagram in:"
        ),
        React.createElement(
          "div",
          { className: "options" },
          React.createElement(
            "div",
            { className: "options__button options__button--opt1" },
            "Left"
          ),
          React.createElement(
            "div",
            { className: "options__button options__button--opt2" },
            "Right"
          ),
          React.createElement(
            "div",
            { className: "options__button options__button--cancle" },
            "Cancle"
          )
        )
      );
    }
  }], [{
    key: "show",
    value: function show(network) {
      d3.select("#selctionPopUp").classed("hidden", false);
      Tooltip.drawDegreeHistogram(network.stat.degrees);
    }
  }, {
    key: "hidden",
    value: function hidden() {
      d3.select("#selctionPopUp").classed("hidden", true);
    }
  }]);

  return SelectionPopUp;
}(React.Component);