class SelectionPopup extends React.Component {
  constructor(props) {
    super(props);
  }

  setLeft = () => {
    SelectionPopup.hidden();
    this.props.selectedChanger(0);
  }

  setRight = () => {
    SelectionPopup.hidden();
    this.props.selectedChanger(1);
  }

  static show () {
    d3.select("#selctionPopup")
      .classed("hidden", false);
  }

  static hidden () {
    d3.select("#selctionPopup").classed("hidden", true);
  }

  render () {
    return (
      <div className="popup hidden" id="selctionPopup" >
        <div className="popup__title">Show Network Diagram in</div>
        <div className="popup__options">
          <div className="popup__option_button popup__option_button--opt1" onClick={this.setLeft}>Left</div>
          <div className="popup__option_button popup__option_button--opt2" onClick={this.setRight}>Right</div>
          <div className="popup__option_button popup__option_button--cancle" onClick={SelectionPopup.hidden}>Cancle</div>
        </div>
      </div >
    );
  }
}