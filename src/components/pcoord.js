class PCoord extends React.Component {
  constructor(props) {
    // TODO: 축에 boxplot 추가
    // TODO: 축 위에 히스토그램 추가: 필터링 기능 제공
    // TODO: 유저가 축 선택 (축 별로 히스토그램 보여주기)
    super(props);
    this.state = {
      svgId: 'svg__pcoord',
      totalStats: [
        'N', 'E', 'D', 'degree_min', 'degree_max', 'degree_avg',
        'T', 'T_max', 'T_avg', 'dist_max', 'dist_avg'
      ],
      seletedStats: [
        'N', 'E', 'D', 'degree_min', 'degree_max', 'degree_avg',
        'T', 'T_max', 'T_avg', 'dist_max', 'dist_avg'
      ],
    }
  }

  componentDidMount () {
    // set SVG size
    const parentId = Util.getParentIdOfReactComp(this);
    const size = Util.getSizeOfDOM(parentId);
    const grahpW = size.width;
    const grahpH = size.height;
    const svg = d3.select(`#${this.state.svgId}`)
      .style("width", grahpW + 'px')
      .style("height", grahpH + 'px');

    // set these on state
    this.setState({ svg, grahpW, grahpH });
  }

  componentDidUpdate () {
    PCoord.draw(this.props.networks, this.state.seletedStats, this.props.selected, this.state.svg);
  }

  // Parallel Coordinate를 그린다.
  static draw (networks, statNames, selected, svg) {
    svg.selectAll("*").remove();
    const statsMinMax = PCoord.getMinMaxOfStats(networks, statNames);

    // get svg box and graph size
    const svgBBox = svg.node().getBoundingClientRect(),
      svgW = svgBBox.width,
      svgH = svgBBox.height,
      paddingW = 50,
      paddingH = 30,
      drawBoxW = svgW - paddingW * 2,
      drawBoxH = svgH - paddingH * 2;

    // Draw Axis and Legend
    const xInterval = drawBoxW / (statNames.length - 1);
    statNames.forEach((key, i) => {
      const x = i * xInterval + paddingW;

      // 세로 선
      svg.append('line').attrs({
        x1: x,
        x2: x,
        y1: paddingH,
        y2: paddingH + drawBoxH,
        stroke: CONSTANTS.COLOR_AXIS,
        'stroke-width': 2,
      });

      // 통계치 이름
      svg.append('text').text(key).attrs({
        x: x,
        y: paddingH + drawBoxH + 10,
        'text-anchor': 'middle',
        'alignment-baseline': 'hanging',
        'font-size': 14
      });

      // 가로선과 통계 수치
      const numOfHorLine = 4;
      const yInterval = drawBoxH / (numOfHorLine - 1);
      const statMin = statsMinMax[key].min;
      const statMax = statsMinMax[key].max;
      const valInterval = (statMax - statMin) / (numOfHorLine - 1);
      for (let j = 0; j < numOfHorLine; j++) {
        const y = j * yInterval + paddingH;
        let val = (numOfHorLine - j - 1) * valInterval + statMin;
        val = (val < 1) ? Number((val).toFixed(3)) : parseInt(val);

        // 가로선
        svg.append('line').attrs({
          x1: x - 10,
          x2: x + 10,
          y1: y,
          y2: y,
          stroke: CONSTANTS.COLOR_AXIS,
        });

        // 통계 수치
        svg.append('text').text(val).attrs({
          x: x + 15,
          y: y,
          'text-anchor': 'start',
          'alignment-baseline': 'centeral',
          'font-size': 9
        });
      }
    });

    // Draw Paths for each Network 
    const lineFunction = d3.line()
      .x(function (d) { return d.x; })
      .y(function (d) { return d.y; })
      .curve(d3.curveMonotoneX);
    // curveLinear, curveBasis, curveMonotoneX, curveCatmullRom.alpha(1)

    networks.forEach((n, i) => {
      // Set Line Data
      const lineData = [];
      statNames.forEach((k, j) => {
        const smin = statsMinMax[k].min;
        const smax = statsMinMax[k].max;
        const valRel = 1 - (n.stat[k] - smin) / (smax - smin + Number.MIN_VALUE);
        lineData.push({
          x: j * xInterval + paddingW,
          y: valRel * drawBoxH + paddingH
        });
      });

      let color = CONSTANTS.COLOR_INSTANCE;
      if (i == selected[0]) {
        color = CONSTANTS.COLOR_SELECTED[0]
      } else if (i == selected[1]) {
        color = CONSTANTS.COLOR_SELECTED[1]
      }

      // Draw Line
      svg.append("path")
        .attrs({
          d: lineFunction(lineData),
          fill: "none",
          stroke: color,
          "stroke-width": CONSTANTS.STROKE_WIDTH_PCOORD,
          opacity: CONSTANTS.OPACITY_INSTANCE_PCOORD,
          id: `network_path-${i}`
        }).on("mouseover", () => {
          PCoord.handleMouseOver(i, n, d3.event.pageX, d3.event.pageY);
        }).on("mouseout", () => {
          PCoord.handleMouseOut(i);
        });
    });
  }

  static handleMouseOver (idx, network, mouseX, mouseY) {
    ScatterPlot.highlightCircle(`#network_circle-${idx}`);
    PCoord.highlightPath(`#network_path-${idx}`);
    Tooltip.show(mouseX, mouseY, network);
  }

  static handleMouseOut (idx) {
    ScatterPlot.dehighlightCircle(`#network_circle-${idx}`);
    PCoord.dehighlightPath(`#network_path-${idx}`);
    Tooltip.hidden();
  }

  static highlightPath (selector) {
    d3.select(selector).attrs({
      "stroke-width": CONSTANTS.STROKE_WIDTH_PCOORD * 5,
      opacity: CONSTANTS.OPACITY_SELECTED
    });
  }

  static dehighlightPath (selector) {
    d3.select(selector).attrs({
      "stroke-width": CONSTANTS.STROKE_WIDTH_PCOORD,
      opacity: CONSTANTS.OPACITY_INSTANCE_PCOORD
    });
  }

  static getMinMaxOfStats (networks, statNames) {
    const statistics = networks.map(n => n.stat);
    const statsByKey = Util.getArraiesByKey(statistics, statNames);
    const ret = {};
    for (let statName of statNames) {
      const minmaxValue = Util.minmax(statsByKey[statName]);
      ret[statName] = {
        min: minmaxValue.min,
        max: minmaxValue.max,
      };
    }
    return ret;
  }

  render () {
    return <svg id={this.state.svgId} />;
  }
}
