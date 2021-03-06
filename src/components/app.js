class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: 0,
      selected: [59, 75],
    }
  }

  changeClickedNetwork = (networkIdx) => {
    this.setState({ clicked: networkIdx });
  }

  changeSelectedNetwork = (i) => {
    const newSelected = this.state.selected;
    newSelected[i] = this.state.clicked;
    this.setState({ selected: newSelected });
  }

  // TODO: Scatter, Parallel, Tooltip의 함수들 Non-Static 하게 변경
  render () {
    return (
      <div className="app">
        <div className="row row--first">
          <div className="section section__scatter" id="svg_parent__scatter">
            < ScatterPlot networks={this.props.networks} selected={this.state.selected} clickedChanger={this.changeClickedNetwork} />
          </div>

          <div className="section section__pcoord" id="svg_parent__pcoord">
            < PCoord networks={this.props.networks} selected={this.state.selected} clickedChanger={this.changeClickedNetwork} />
          </div>
          <Tooltip />
          <SelectionPopup clickedIdx={this.state.clicked} selectedChanger={this.changeSelectedNetwork} />
        </div>

        <div className="row row--second">
          <div className="container container__diagram container__diagram--small">
            <div className="section section__diagram section__diagram--small" id="diagram-1">
              < Diagram network={this.props.networks[this.state.selected[0]]} idx='1' type='matrix' />
            </div>
            <div className="section section__diagram section__diagram--small" id="diagram-2">
              < Diagram network={this.props.networks[this.state.selected[0]]} idx='2' type='radial' />
            </div>
          </div>

          <div className="container container__diagram container__diagram--large">
            <div className="section section__diagram section__diagram--large" id="diagram-3">
              < Diagram network={this.props.networks[this.state.selected[0]]} idx='3' type='node-link' />
            </div>
          </div>

          <div className="container container__diagram container__diagram--large">
            <div className="section section__diagram section__diagram--large" id="diagram-4">
              < Diagram network={this.props.networks[this.state.selected[1]]} idx='4' type='node-link' />
            </div>
          </div>

          <div className="container container__diagram container__diagram--small">
            <div className="section section__diagram section__diagram--small" id="diagram-5">
              < Diagram network={this.props.networks[this.state.selected[1]]} idx='5' type='matrix' />
            </div>
            <div className="section section__diagram section__diagram--small" id="diagram-6">
              < Diagram network={this.props.networks[this.state.selected[1]]} idx='6' type='radial' />
            </div>
          </div>
        </div>

      </div>
    );
  }
}
