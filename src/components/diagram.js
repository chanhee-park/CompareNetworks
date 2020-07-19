class Diagram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      svgId: `svg__diagram__${this.props.idx}`,
      color: CONSTANTS.COLOR_SELECTED[(this.props.idx) <= 3 ? 0 : 1],
    }
  }

  render () {
    switch (this.props.type) {
      case 'matrix':
        return <MatrixDiagram
          svgId={this.state.svgId}
          color={this.state.color}
          network={this.props.network}
        />;
        break;
      case 'node-link':
        return <NodeLinkDiagram
          svgId={this.state.svgId}
          color={this.state.color}
          network={this.props.network} />;
        break;
      case 'radial':
        return <RadialDiagram
          svgId={this.state.svgId}
          color={this.state.color}
          network={this.props.network}
        />;
        break;
    }
    return <div />
  }
}
