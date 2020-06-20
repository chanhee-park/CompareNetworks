class Tooltip extends React.Component {
  constructor(props) {
    super(props);
  }

  // TODO: 툴팁 우측에 네트워크 다이어그램 추가.

  static show (x, y, network) {
    d3.select("#tooltip")
      .style("left", (x + 20) + "px")
      .style("top", (y + 10) + "px")
      .classed("hidden", false)
      .select("#description")
      .html(Tooltip.getTooltipTxt(network));
    Tooltip.drawDegreeHistogram(network.stat.degrees);
  }

  static hidden () {
    d3.select("#tooltip").classed("hidden", true);
  }

  static getTooltipTxt (network) {
    return `
    <div class="key-val-set">
      <div class="key">Number of Nodes:</div>
      <div class="val">${network.stat.N}</div>
    </div>
    <div class="key-val-set">
      <div class="key">Number of Edges:</div>
      <div class="val">${network.stat.E}</div>
    </div>
    <div class="key-val-set">
      <div class="key">Density(Edeg-Node Ratio):</div>
      <div class="val">${Number((network.stat.D).toFixed(4))}</div>
    </div>
    <div class="key-val-set">
      <div class="key">Degree Histogram</div>
      <div class="val"><svg id="degreesHistogram"></svg></div>
    </div>
    `;
  }

  static drawDegreeHistogram (degrees) {
    // svg size
    const SVG_W = 450,
      SVG_H = 200;
    // padding size
    const PADDING_L = 20,
      PADDING_R = 10,
      PADDING_B = 30,
      PADDING_T = 30;
    // render zone size
    const RENDER_W = SVG_W - PADDING_L - PADDING_R,
      RENDER_H = SVG_H - PADDING_B - PADDING_T;

    const svg = d3.select(`#degreesHistogram`)
      .style("width", SVG_W)
      .style("height", SVG_H);

    // 축 그리기
    svg.append('line').attrs({
      // 세로 축
      x1: PADDING_L,
      x2: PADDING_L,
      y1: 0,
      y2: RENDER_H + PADDING_T,
      stroke: CONSTANTS.COLOR_AXIS
    });

    svg.append('line').attrs({
      // 가로 축
      x1: SVG_W,
      x2: PADDING_L,
      y1: RENDER_H + PADDING_T,
      y2: RENDER_H + PADDING_T,
      stroke: CONSTANTS.COLOR_AXIS
    });

    // 그래프 그리기
    const maxDegree = Math.max(...Object.keys(degrees));
    const maxSize = Math.max(...Object.values(degrees));
    const interval = RENDER_W / maxDegree;

    // 보조 텍스트
    const numOfText = 2;
    for (let i = 0; i <= numOfText; i++) {
      const degreeVal = parseInt(maxDegree * i / numOfText);
      const sizeVal = parseInt(maxSize * i / numOfText);
      svg.append('text').text(degreeVal).attrs({
        // 가로 축 텍스트 (degree)
        x: interval * degreeVal + PADDING_L,
        y: RENDER_H + PADDING_T + 10,
        'text-anchor': 'end',
        'alignment-baseline': 'hanging'
      });
      if (i == 0) continue; // 0은 가로 축 세로축 겹치니깐 한번만 그린다.
      svg.append('text').text(sizeVal).attrs({
        // 세로 축 텍스트 (size = number of nodes)
        x: PADDING_L - 10,
        y: RENDER_H - ((sizeVal / maxSize) * RENDER_H - PADDING_T),
        'text-anchor': 'middle',
        'alignment-baseline': 'central'
      });

    }

    // 바 차트
    for (const [degree, size] of Object.entries(degrees)) {
      const rectH = (size / maxSize) * RENDER_H;
      svg.append('rect').attrs({
        x: interval * degree + PADDING_L,
        y: RENDER_H - rectH + PADDING_T,
        width: interval,
        height: rectH,
        fill: CONSTANTS.COLOR_INSTANCE,
        opacity: '0.75'
      });
    }


  }

  render () {
    return (
      <div id="tooltip" className="hidden">
        <div className="title">Hovered Network</div>
        <div className="description" id="description" />
      </div >
    );
  }
}
