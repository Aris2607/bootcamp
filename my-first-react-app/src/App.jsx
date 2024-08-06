import Header from "./components/Header";
import { useState } from "react";
import "./App.css";
import UserComments from "./components/Comments";

const person = {
  name: "Mochamad Aris",
  batch: 10,
};

const Home = () => {
  return (
    <div className="home">
      <h1>
        Hi, nama saya {person.name}, Saya dari bootcamp batch {person.batch}
      </h1>
    </div>
  );
};
const Batch = () => <h1 className="batch-h1">Batch Page</h1>;
const About = () => <h1 className="about-h1">About Page</h1>;
const Contact = () => <h1 className="contact-h1">Contact Page</h1>;

const App = () => {
  const [content, setContent] = useState("home");

  const Content = () => {
    switch (content) {
      case "home":
        return <Home />;
      case "batch":
        return <Batch />;
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      default:
        return <Home />;
    }
  };
  return (
    <>
      <Header setContent={setContent} />
      <Content />
      <UserComments />
    </>
  );
};

export default App;
