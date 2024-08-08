import Header from "./components/Header";
import { Component } from "react";
import "./App.css";
import { faker } from "@faker-js/faker";
import Comments, { CommentSection } from "./components/Comments";
import Home from "./components/Home";
import Batch from "./components/Batch";
import About from "./components/About";
import Contact from "./components/Contact";
import InputForm from "./components/InputForm";
import axios from "axios";
import UnsplashSearch from "./components/UnsplashSearch";

const person = {
  name: "Mochamad Aris",
  batch: 10,
};

const commentsData = [
  {
    id: 1,
    name: faker.person.fullName(),
    imgURL: faker.image.avatar(),
    content: faker.lorem.sentence(),
    time: faker.date.soon().toString(),
  },
  {
    id: 2,
    name: faker.person.fullName(),
    imgURL: faker.image.avatar(),
    content: faker.lorem.sentence(),
    time: faker.date.soon().toString(),
  },
  {
    id: 3,
    name: faker.person.fullName(),
    imgURL: faker.image.avatar(),
    content: faker.lorem.sentence(),
    time: faker.date.soon().toString(),
  },
  {
    id: 4,
    name: faker.person.fullName(),
    imgURL: faker.image.avatar(),
    content: faker.lorem.sentence(),
    time: faker.date.soon().toString(),
  },
  {
    id: 5,
    name: faker.person.fullName(),
    imgURL: faker.image.avatar(),
    content: faker.lorem.sentence(),
    time: faker.date.soon().toString(),
  },
];

const UserComments = commentsData.map((user) => (
  <Comments key={user.id} user={user} />
));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "home",
    };
    this.setContent = this.setContent.bind(this);
  }

  setContent(content) {
    this.setState({ content });
  }
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
        case "unsplash":
          return <UnsplashSearch />;
        default:
          return <Home name={person.name} batch={person.batch} />;
      }
    };
    return (
      <div className="container">
        <Header content={this.state.content} setContent={this.setContent} />
        <Content />
        <CommentSection UserComments={UserComments} />
        <UnsplashSearch />
      </div>
    );
  }
}

export default App;
