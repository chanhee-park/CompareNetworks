class SelectionPopUp extends React.Component {
  constructor(props) {
    super(props);
  }

  static show (network) {
    d3.select("#selctionPopUp")
      .classed("hidden", false)
    Tooltip.drawDegreeHistogram(network.stat.degrees);
  }

  static hidden () {
    d3.select("#selctionPopUp").classed("hidden", true);
  }

  render () {
    return (
      <div id="selctionPopUp" >
        <div className="title">Show Network Diagram in:</div>
        <div className="options">
          <div className="options__button options__button--opt1">Left</div>
          <div className="options__button options__button--opt2">Right</div>
          <div className="options__button options__button--cancle">Cancle</div>
        </div>
      </div >
    );
  }

}