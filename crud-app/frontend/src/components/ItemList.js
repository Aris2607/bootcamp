import React, { useState, useEffect } from "react";
import axios from "axios";

const ItemList = ({ setItem }) => {
  const [items, setItems] = useState([]);

  const fetchItems = () => {
    axios
      .get("http://localhost:5000/api/items")
      .then((response) => setItems(response.data));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/items/${id}`)
      .then(() => fetchItems());
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <button onClick={() => setItem(item)}>Edit</button>
          <button onClick={() => handleDelete(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
