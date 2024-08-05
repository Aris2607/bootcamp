import express, { json } from "express";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import morgan from "morgan";
import fs from "fs/promises";

const app = express();
const PORT = 3000;

// Determine the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const read = async (filePath) => await fs.readFile(filePath, "utf-8");

app.set("view engine", "ejs");

app.use(expressLayouts);

app.set("layout", "layouts/layout");

app.use((req, res, next) => {
  console.log("Time:", Date.now());
  next();
});

app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "public"))); // Menambahkan ini

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/contact", async (req, res) => {
  const fileBuffer = await read(path.join(__dirname, "data", "contacts.json"));
  const contacts = JSON.parse(fileBuffer);
  console.log(contacts);
  res.render("contact", { contacts, title: "Contact" });
});

app.get("/other", (req, res) => {
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

  res.render("other", { contacts, title: "Other Page" });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).send("404 NOT FOUND");
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
