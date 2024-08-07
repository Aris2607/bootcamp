import { Component } from "react";
import Clock from "./Clock";
class Header extends Component {
  render() {
    return (
      <nav>
        <h1>Bootcamp batch 10</h1>
        <Clock />
        <ul>
          <li
            className={this.props.content === "home" ? "active" : ""}
            onClick={() => this.props.setContent("home")}
          >
            Home
          </li>
          <li
            className={this.props.content === "batch" ? "active" : ""}
            onClick={() => this.props.setContent("batch")}
          >
            Batch
          </li>
          <li
            className={this.props.content === "about" ? "active" : ""}
            onClick={() => this.props.setContent("about")}
          >
            About
          </li>
          <li
            className={this.props.content === "contact" ? "active" : ""}
            onClick={() => this.props.setContent("contact")}
          >
            Contact
          </li>
        </ul>
      </nav>
    );
  }
}

export default Header;
