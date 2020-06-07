class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className="app">
        <div className="row row--first">
          <div className="section section__scatter">
            {/* TODO: < ScatterPlot networks={this.props.networks} /> */}
          </div>

          <div className="section section__pcoord">
            {/* TODO: < PCoord networks={this.props.networks} /> */}
          </div>
        </div>

        <div className="row row--second">
          <div className="container container__diagram container__diagram--small">
            <div className="section section__diagram section__diagram--small">
              {/* TODO: < Diagram network={this.props.selectedNetworks[0]} /> */}
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
              {/* TODO: < Diagram network={this.props.selectedNetworks[4]} /> */}
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
