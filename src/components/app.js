class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [0, 1],
    }
  }

  changeSelectedNetwork (network, i) {
    const newSelected = this.state.selected;
    newSelected[i] = network
    this.setState({ selected: newSelected });
  }

  // TODO: Scatter, Parallel, Tooltip의 함수들 Non-Static 하게 변경
  render () {
    return (
      <div className="app">
        <div className="row row--first">
          <div className="section section__scatter" id="svg_parent__scatter">
            < ScatterPlot networks={this.props.networks} selected={this.state.selected} />
          </div>

          <div className="section section__pcoord" id="svg_parent__pcoord">
            < PCoord networks={this.props.networks} selected={this.state.selected} />
          </div>
          <Tooltip />
        </div>

        <div className="row row--second">
          <div className="container container__diagram container__diagram--small">
            <div className="section section__diagram section__diagram--small">
              < Diagram network={this.props.networks[this.state.selected[0]]} idx='1' type='matrix' />
            </div>
            <div className="section section__diagram section__diagram--small">
              {/* TODO: < Diagram network={this.props.selectedNetworks[1]} /> */}
            </div>
          </div>

          <div className="container container__diagram container__diagram--large">
            <div className="section section__diagram section__diagram--large">
              {/* TODO: < Diagram network={this.props.selectedNetworks[2]} /> */}
            </div>
          </div>

          <div className="container container__diagram container__diagram--large">
            <div className="section section__diagram section__diagram--large">
              {/* TODO: < Diagram network={this.props.selectedNetworks[3]} /> */}
            </div>
          </div>

          <div className="container container__diagram container__diagram--small">
            <div className="section section__diagram section__diagram--small">
              < Diagram network={this.props.networks[this.state.selected[1]]} idx='4' type='matrix' />
            </div>
            <div className="section section__diagram section__diagram--small">
              {/* TODO: < Diagram network={this.props.selectedNetworks[5]} /> */}
            </div>
          </div>
        </div>

      </div>
    );
  }
}
