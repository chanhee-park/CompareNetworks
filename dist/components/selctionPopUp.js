var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SelectionPopup = function (_React$Component) {
  _inherits(SelectionPopup, _React$Component);

  function SelectionPopup(props) {
    _classCallCheck(this, SelectionPopup);

    var _this = _possibleConstructorReturn(this, (SelectionPopup.__proto__ || Object.getPrototypeOf(SelectionPopup)).call(this, props));

    _this.setLeft = function () {
      SelectionPopup.hidden();
      _this.props.selectedChanger(0);
    };

    _this.setRight = function () {
      SelectionPopup.hidden();
      _this.props.selectedChanger(1);
    };

    return _this;
  }

  _createClass(SelectionPopup, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "popup hidden", id: "selctionPopup" },
        React.createElement(
          "div",
          { className: "popup__title" },
          "Show Network Diagram in"
        ),
        React.createElement(
          "div",
          { className: "popup__options" },
          React.createElement(
            "div",
            { className: "popup__option_button popup__option_button--opt1", onClick: this.setLeft },
            "Left"
          ),
          React.createElement(
            "div",
            { className: "popup__option_button popup__option_button--opt2", onClick: this.setRight },
            "Right"
          ),
          React.createElement(
            "div",
            { className: "popup__option_button popup__option_button--cancle", onClick: SelectionPopup.hidden },
            "Cancle"
          )
        )
      );
    }
  }], [{
    key: "show",
    value: function show() {
      d3.select("#selctionPopup").classed("hidden", false);
    }
  }, {
    key: "hidden",
    value: function hidden() {
      d3.select("#selctionPopup").classed("hidden", true);
    }
  }]);

  return SelectionPopup;
}(React.Component);