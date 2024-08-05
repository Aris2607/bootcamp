import React, { useState } from "react";
import ItemForm from "./components/ItemForm";
import ItemList from "./components/ItemList";

const App = () => {
  const [item, setItem] = useState(null);

  const fetchItems = () => {
    // This will be used to refresh the item list after any operation
  };

  return (
    <div>
      <h1>CRUD App</h1>
      <ItemForm item={item} setItem={setItem} fetchItems={fetchItems} />
      <ItemList setItem={setItem} fetchItems={fetchItems} />
    </div>
  );
};

export default App;
