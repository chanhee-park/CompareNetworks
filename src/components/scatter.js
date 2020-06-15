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
    points.forEach(p => {
      svg.append('circle').attrs({
        cx: p[0] + padding,
        cy: p[1] + padding,
        r: 6,
        fill: CONSTANTS.COLOR_INSTANCE,
        opacity: CONSTANTS.OPACITY_NON_SCATTER,
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

  render () {
    return <svg id={this.state.svgId} />;
  }
}
