class ScatterPlot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      svgId: 'svg__scatter',
      padding: 20,
      totalStats: ['D', 'degree_min', 'degree_max', 'degree_avg', 'T', 'T_max', 'T_avg', 'dist_max', 'dist_avg'],
      seletedStats: ['D', 'degree_min', 'degree_max', 'degree_avg', 'T', 'T_max', 'T_avg', 'dist_max', 'dist_avg'],
    }
  }

  componentDidMount () {
    // set SVG size
    const parentId = Util.getParentIdOfReactComp(this);
    const size = Util.getSizeOfDOM(parentId);
    const maxWH = Math.max(size.width, size.height);
    const grahpSize = maxWH - (this.state.padding * 2);
    const svg = d3.select(`#${this.state.svgId}`)
      .style("width", size.width + 'px')
      .style("height", size.height + 'px');

    // get difference between networks and points of each network
    const diff = NetComparator.getDiffByStats(this.props.networks, this.state.seletedStats);
    const points = ScatterPlot.getPoints(diff, grahpSize);

    // set these on state
    this.setState({ svg, grahpSize, diff, points });
  }

  componentDidUpdate () {
    // TODO: 네트워크 사이의 거리를 정하는 방법을 유저가 직접 지정할 수 있어야한다.
    ScatterPlot.draw(this.state.points, this.state.svg, this.state.padding);
  }

  // 네트워크간 차이(dist matrix)를 입력받아 각 네트워크  포인트의 포지션을 담는 배열을 반환한다. 
  static getPoints (diff, grahpSize) {
    const points = Util.pca(diff);
    const normPoints = ScatterPlot.getNormalizedPoints(points, grahpSize);
    return normPoints;
  }

  // normalize position of points (x축과 y축 개별적으로 정규화)
  static getNormalizedPoints (points, grahpSize) {
    const min = [+Infinity, +Infinity];
    const max = [-Infinity, -Infinity]
    points.forEach(p => {
      min[0] = Math.min(min[0], p[0]);
      max[0] = Math.max(max[0], p[0]);
      min[1] = Math.min(min[1], p[1]);
      max[1] = Math.max(max[1], p[1]);
    });
    const sub = [max[0] - min[0], max[1] - min[1]];
    return points.map(p => {
      const x = ((p[0] - min[0]) / sub[0]) * grahpSize;
      const y = ((p[1] - min[1]) / sub[1]) * grahpSize;
      return [x, y];
    });
  }

  // 스캐터플롯을 그린다.
  static draw (points, svg, padding) {
    svg.selectAll("*").remove();
    ScatterPlot.drawAxisLines(svg, 5);
    ScatterPlot.drawPoints(points, svg, padding);
    // TODO: 안내선
    // TODO: 확대 축소 클릭 호버 인터랙션
    return;
  }

  static drawPoints (points, svg, padding) {
    points.forEach((p, i) => {
      svg.append('circle').attrs({
        cx: p[0] + padding,
        cy: p[1] + padding,
        r: CONSTANTS.RADIUS_SCATTER,
        fill: CONSTANTS.COLOR_INSTANCE,
        opacity: CONSTANTS.OPACITY_INSTANCE_SCATTER,
        id: `network_circle-${i}`
      }).on("mouseover", () => {
        ScatterPlot.handleMouseOver(p, networks[i], i);
      }).on("mouseout", () => {
        ScatterPlot.handleMouseOut(p, i)
      });
    });
  }

  static drawAxisLines (svg, numberOfAxis) {
    // get svg box 
    const svgBBox = svg.node().getBoundingClientRect();
    const svgW = svgBBox.width;
    const svgH = svgBBox.height;

    // Draw Axis and Legend
    const axisW = svgW / (numberOfAxis + 1);
    const axisH = svgH / (numberOfAxis + 1);
    for (let i = 1; i <= numberOfAxis; i++) {
      // 가로 선
      svg.append('line').attrs({
        x1: 0,
        x2: svgW,
        y1: i * axisH,
        y2: i * axisH,
        stroke: CONSTANTS.COLOR_AXIS
      });
      // 세로 선 
      svg.append('line').attrs({
        x1: i * axisW,
        x2: i * axisW,
        y1: 0,
        y2: svgH,
        stroke: CONSTANTS.COLOR_AXIS
      });
    }
  }

  static handleMouseOver (point, network, idx) {
    d3.select(`#network_circle-${idx}`).attrs({
      fill: CONSTANTS.COLOR_HOVERED,
      r: CONSTANTS.RADIUS_SCATTER * 3,
      opacity: CONSTANTS.OPACITY_SELECTED
    });

    return;
    // Specify where to put label of text
    svg.append("text").attr({
      id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
      x: function () { return xScale(d.x) - 30; },
      y: function () { return yScale(d.y) - 15; }
    }).text(function () {
      return [d.x, d.y];  // Value of the text
    });
  }

  static handleMouseOut (point, idx) {
    d3.select(`#network_circle-${idx}`).attrs({
      fill: CONSTANTS.COLOR_INSTANCE,
      r: CONSTANTS.RADIUS_SCATTER,
      opacity: CONSTANTS.OPACITY_INSTANCE_SCATTER
    });

    return;
    // Select text by id and then remove
    d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();
  }

  render () {
    return <svg id={this.state.svgId} />;
  }
}
