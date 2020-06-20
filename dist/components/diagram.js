var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Diagram = function (_React$Component) {
  _inherits(Diagram, _React$Component);

  function Diagram(props) {
    _classCallCheck(this, Diagram);

    var _this = _possibleConstructorReturn(this, (Diagram.__proto__ || Object.getPrototypeOf(Diagram)).call(this, props));

    _this.state = {
      svgId: 'svg__diagram__' + _this.props.idx,
      color: CONSTANTS.COLOR_SELECTED[_this.props.idx <= 3 ? 0 : 1]
    };
    return _this;
  }

  _createClass(Diagram, [{
    key: 'render',
    value: function render() {
      switch (this.props.type) {
        case 'matrix':
          return React.createElement(MatrixDiagram, {
            svgId: this.state.svgId,
            color: this.state.color,
            network: this.props.network
          });
        case 'node-link':
          // TODO: return <NodeLinkDiagram/>;
          break;
        case 'dashboard':
          // TODO return <DashboardDiagram/>;
          break;
      }
      return React.createElement('div', null);
    }
  }]);

  return Diagram;
}(React.Component);