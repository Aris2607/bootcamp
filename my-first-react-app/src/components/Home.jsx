import { Component } from "react";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(count) {
    this.setState({ count });
  }
  render() {
    return (
      <div className="content">
        <h1>
          Hi, nama saya {this.props.name}, Saya dari bootcamp batch
          {this.props.batch}
        </h1>
        <p>
          You Clicked {this.state.count} {this.state.count > 0 ? "times" : ""}
        </p>
        <button onClick={() => this.handleClick(this.state.count - 1)}>
          (-)
        </button>
        <button onClick={() => this.handleClick(this.state.count + 1)}>
          (+)
        </button>
      </div>
    );
  }
}

export default Home;
