import Header from "./components/Header";
import { Component } from "react";
import "./App.css";
import Home from "./components/Home";
import Batch from "./components/Batch";
import About from "./components/About";
import Contact from "./components/Contact";
import Gallery from "./components/Gallery";
import VideoGallery from "./components/VideoGallery";
import TestVideo from "./components/TestVideo";

const person = {
  name: "Mochamad Aris",
  batch: 10,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "home",
    };
  }

  setContent = (content) => {
    this.setState({ content });
  };
  render() {
    const Content = () => {
      switch (this.state.content) {
        case "home":
          return <Home person={person} />;
        case "batch":
          return <Batch />;
        case "about":
          return <About />;
        case "contact":
          return <Contact />;
        case "gallery":
          return <Gallery />;
        case "video":
          return <VideoGallery />;
        default:
          return <Home name={person.name} batch={person.batch} />;
      }
    };
    return (
      <div className="container">
        <Header content={this.state.content} setContent={this.setContent} />
        <Content />
      </div>
    );
  }
}

export default App;
