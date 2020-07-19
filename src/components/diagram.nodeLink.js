class NodeLinkDiagram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount () {
    const containerId = Util.getParentIdOfReactComp(this);
    const container = document.getElementById(containerId);

    const data = {
      nodes: this.generateVisNodes(),
      edges: this.generateVisEdges()
    };

    // option: https://visjs.github.io/vis-network/docs/network/#options
    const options = {
      autoResize: false,
      height: '95%',
      width: '100%',
      // https://visjs.github.io/vis-network/docs/network/edges.html
      edges: {
        color: {
          color: Util.lightenColor(this.props.color),
          opacity: 0.25,
        },
        width: 0.1
      },
      // https://visjs.github.io/vis-network/docs/network/nodes.html
      nodes: {
        color: this.props.color
      },
      // https://visjs.github.io/vis-network/docs/network/physics.html
      physics: {
        forceAtlas2Based: {
          gravitationalConstant: -26,
          centralGravity: 0.005,
          springLength: 230,
          springConstant: 0.18,
          avoidOverlap: 1.5
        },
        maxVelocity: 146,
        solver: 'forceAtlas2Based',
        timestep: 0.35,
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 25
        }
      }
    }

    this.setState({ container, data, options });
  }

  componentDidUpdate () {
    this.draw();
  }

  draw () {
    // TODO: 노드 위치 받아서/계산해서 SVG에 직접 그리기
    const visNetwork = this.generateVisNetwork();
    visNetwork.on("stabilizationIterationsDone", function () {
      visNetwork.setOptions({ physics: false });
    });
    console.log(visNetwork);
  }

  generateVisNetwork () {
    return new vis.Network(
      this.state.container,
      this.state.data,
      this.state.options
    );
  }

  generateVisNodes () {
    return new vis.DataSet([...this.props.network.nodes].map(node => (
      { id: node, label: node }
    )));
  }

  generateVisEdges () {
    const edgeMap = {};
    for (let link of this.props.network.links) {
      const from = Math.min(link.from, link.to);
      const to = Math.max(link.from, link.to);
      const key = `${from}-${to}`;
      if (key in edgeMap) {
        edgeMap[key].value += 1;
      } else {
        edgeMap[key] = { from, to, value: 1 };
      }
    }
    return new vis.DataSet(Object.values(edgeMap));
  }

  render () {
    return <svg id={this.props.svgId} />;
  }
}