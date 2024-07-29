import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";

const app = express();
const PORT = 3000;

// Determine the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  //   res.sendFile(path.join(__dirname, "index.html"));
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
  //   res.sendFile(path.join(__dirname, "about.html"));
});

app.get("/contact", (req, res) => {
  const contacts = [
    {
      name: "Aris",
      email: "mochamadaris112@gmail.com",
    },
    {
      name: "Eru",
      email: "eru@gmail.com",
    },
    {
      name: "Aries",
      email: "aries221@gmail.com",
    },
  ];
  res.render("contact", { contacts });
  //   res.sendFile(path.join(__dirname, "contact.html"));
});

// Updated route with proper parameter handling
app.get("/product/:productId", (req, res) => {
  const { category } = req.query;
  res.send(`Product ID: ${req.params.productId}, Category ID: ${category}`);
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).send("404 NOT FOUND");
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
