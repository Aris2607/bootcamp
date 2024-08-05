const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create
app.post("/api/items", (req, res) => {
  const item = req.body;
  const sql = "INSERT INTO items (name, description) VALUES (?, ?)";
  db.query(sql, [item.name, item.description], (err, result) => {
    if (err) throw err;
    res.send({ id: result.insertId, ...item });
  });
});

// Read
app.get("/api/items", (req, res) => {
  const sql = "SELECT * FROM items";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Update
app.put("/api/items/:id", (req, res) => {
  const id = req.params.id;
  const item = req.body;
  const sql = "UPDATE items SET name = ?, description = ? WHERE id = ?";
  db.query(sql, [item.name, item.description, id], (err, result) => {
    if (err) throw err;
    res.send({ id, ...item });
  });
});

// Delete
app.delete("/api/items/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM items WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send({ id });
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
