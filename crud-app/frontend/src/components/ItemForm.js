import React, { useState, useEffect } from "react";
import axios from "axios";

const ItemForm = ({ item, setItem, fetchItems }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description);
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (item) {
      axios
        .put(`http://localhost:5000/api/items/${item.id}`, {
          name,
          description,
        })
        .then(() => {
          setItem(null);
          fetchItems();
        });
    } else {
      axios
        .post("http://localhost:5000/api/items", { name, description })
        .then(() => fetchItems());
    }
    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      ></textarea>
      <button type="submit">{item ? "Update" : "Create"}</button>
    </form>
  );
};

export default ItemForm;
