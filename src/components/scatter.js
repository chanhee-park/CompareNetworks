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
    const points = this.getPoints(diff, grahpSize, this.props.selected);

    // set these on state
    this.setState({ svg, grahpSize, diff, points });
  }

  componentDidUpdate () {
    // TODO: 네트워크 사이의 거리를 정하는 방법을 유저가 직접 지정할 수 있어야한다.
    this.draw(this.state.points, this.state.svg, this.state.padding);
  }

  // 네트워크간 차이(dist matrix)를 입력받아 각 네트워크 포인트의 포지션을 담는 배열을 반환한다. 
  getPoints (diff, grahpSize, selected) {
    // pca 차원 축소를 통해 포인트 위치 지정
    const points = Util.pca(diff);

    // 그래프 사이즈에 맞춰서 포지션 조정
    const normPoints = ScatterPlot.getNormalizedPoints(points, grahpSize);

    // 포인트 색상 지정
    for (let i = 0; i < normPoints.length; i++) {
      let color = CONSTANTS.COLOR_INSTANCE;
      if (i == selected[0]) {
        color = CONSTANTS.COLOR_SELECTED[0]
      } else if (i == selected[1]) {
        color = CONSTANTS.COLOR_SELECTED[1]
      }
      normPoints[i].color = color;
    }

    return normPoints;
  }

  // 스캐터플롯을 그린다.
  draw (points, svg, padding) {
    svg.selectAll("*").remove();
    this.drawAxisLines(svg, 5);
    this.drawPoints(points, svg, padding);
    // TODO: 확대 축소 인터랙션
    return;
  }

  drawPoints (points, svg, padding) {
    points.forEach((p, i) => {
      svg.append('circle').attrs({
        cx: p.x + padding,
        cy: p.y + padding,
        r: CONSTANTS.RADIUS_SCATTER,
        fill: p.color,
        stroke: '#777',
        'stroke-width': '0px',
        opacity: CONSTANTS.OPACITY_INSTANCE_SCATTER,
        id: `network_circle-${i}`
      }).on("mouseover", () => this.handleMouseOver(i, networks[i], d3.event.pageX, d3.event.pageY))
        .on("mouseout", () => this.handleMouseOut(i))
        .on("click", () => this.handleMouseClick(i));
    });
  }

  drawAxisLines (svg, numberOfAxis) {
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
      return { x, y };
    });
  }

  handleMouseOver = (idx, network, mouseX, mouseY) => {
    ScatterPlot.highlightCircle(`#network_circle-${idx}`);
    PCoord.highlightPath(`#network_path-${idx}`);
    Tooltip.show(mouseX, mouseY, network);
  }

  handleMouseOut = (idx) => {
    ScatterPlot.dehighlightCircle(`#network_circle-${idx}`);
    PCoord.dehighlightPath(`#network_path-${idx}`);
    Tooltip.hidden();
  }

  handleMouseClick = (idx) => {
    SelectionPopup.show(this.props.networks[idx]);
    this.props.clickedChanger(idx);
  }

  static highlightCircle (selector) {
    d3.select(selector).attrs({
      r: CONSTANTS.RADIUS_SCATTER * 3,
      opacity: CONSTANTS.OPACITY_SELECTED,
      'stroke-width': '2px',
    });
  }

  static dehighlightCircle (selector) {
    d3.select(selector).attrs({
      r: CONSTANTS.RADIUS_SCATTER,
      opacity: CONSTANTS.OPACITY_INSTANCE_SCATTER,
      'stroke-width': '0px',
    });
  }

  render () {
    return <svg id={this.state.svgId} />;
  }
}
