class MatrixDiagram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      padding: 5,
    }
  }

  componentDidMount () {
    // set SVG size
    const svg = d3.select(`#${this.props.svgId}`);
    const svgWidth = svg.style("width").replace("px", "");
    const svgHeight = svg.style("height").replace("px", "");
    const maxWH = Math.min(svgWidth, svgHeight);
    const graphSize = maxWH - this.state.padding * 2;
    this.setState({ svg, graphSize });
  }

  componentDidUpdate () {
    this.draw();
  }

  draw () {
    const matrix = this.props.network.matrix;
    const N = matrix.length;
    const cellSize = this.state.graphSize / N;

    for (let i = 0; i < N - 1; i++) {
      for (let j = i; j < N; j++) {
        if (i == j || matrix[i][j] > 0) {
          this.state.svg.append('rect').attrs({
            x: i * cellSize + this.state.padding,
            y: j * cellSize + this.state.padding,
            width: cellSize,
            height: cellSize,
            fill: this.props.color,
            opacity: 0.5
          });
          this.state.svg.append('rect').attrs({
            x: j * cellSize + this.state.padding,
            y: i * cellSize + this.state.padding,
            width: cellSize,
            height: cellSize,
            fill: this.props.color,
            opacity: 0.5
          });
        }
      }
    }
  }

  render () {
    return <svg id={this.props.svgId} />;
  }
}
