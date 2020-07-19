class RadialDiagram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      padding: 10,
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
    this.state.svg.selectAll("*").remove();

    const nodes = this.props.network.nodes;
    const links = this.props.network.links;

    const radianInterval = (2 * Math.PI) / nodes.size;
    const graphRadius = this.state.graphSize / 2;
    const centralPoint = {
      x: this.state.graphSize / 2 + this.state.padding,
      y: this.state.graphSize / 2 + this.state.padding
    }

    const getNodePosition = function (idx) {
      const radian = radianInterval * idx;
      const x = Math.sin(radian) * graphRadius + centralPoint.x;
      const y = Math.cos(radian) * graphRadius + centralPoint.y;
      return { x, y }
    }

    // draw edges 
    const lineFunction = d3.line()
      .x(function (d) { return d.x; })
      .y(function (d) { return d.y; })
      .curve(d3.curveBundle.beta(0.2));
    // d3.curveBundle.beta(0.25), curveBasis, curveMonotoneX, curveCatmullRom.alpha(1)

    for (let link of links) {
      const fromPosition = getNodePosition(link.from);
      const toPosition = getNodePosition(link.to);
      let lineData = (Math.abs(link.from - link.to) <= 1) ?
        [fromPosition, toPosition] :
        [fromPosition, centralPoint, toPosition];

      this.state.svg.append("path").attrs({
        d: lineFunction(lineData),
        fill: "none",
        stroke: Util.lightenColor(this.props.color),
        "stroke-width": 2,
        opacity: 0.5,
        id: `network_path-${i}`
      })
    }

    // draw nodes 
    for (let idx = 0; idx < nodes.size; idx++) {
      const nodePosition = getNodePosition(idx);
      this.state.svg.append('circle').attrs({
        cx: nodePosition.x,
        cy: nodePosition.y,
        r: CONSTANTS.RADIUS_RADIAL,
        fill: this.props.color,
      });
    }

  }

  render () {
    return <svg id={this.props.svgId} />;
  }
}
