import { Component } from "react";
import InputForm from "./InputForm";

class Batch extends Component {
  render() {
    return (
      <div className="content">
        <h1 className="batch-h1">Batch Page</h1>
        <InputForm />
      </div>
    );
  }
}

export default Batch;
