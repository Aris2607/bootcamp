import Header from "./components/Header";
import { useState } from "react";
import "./App.css";

const App = () => {
  const [content, setContent] = useState("ReactJS");
  return (
    <>
      <Header setContent={setContent} />
      <h1>This is {content}</h1>
    </>
  );
};

export default App;
