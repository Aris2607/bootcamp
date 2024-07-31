import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import morgan from "morgan";
import fs from "fs/promises";
import methodOverride from "method-override";
import { body, validationResult } from "express-validator";

const app = express();
const PORT = 3000;

// Determine the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const read = async (filePath) => await fs.readFile(filePath, "utf-8");

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/contact", async (req, res) => {
  const fileBuffer = await read(path.join(__dirname, "data", "contacts.json"));
  const contacts = JSON.parse(fileBuffer);
  contacts.sort((a, b) => b.id - a.id);
  res.render("contact", { contacts, title: "Contact" });
});

app.get("/contact/:idContact", async (req, res) => {
  const fileBuffer = await read(path.join(__dirname, "data", "contacts.json"));
  const contacts = JSON.parse(fileBuffer);
  const detailContact = contacts.find(
    (contact) => contact.id === parseInt(req.params.idContact)
  );

  res.render("detail", { detailContact, title: "Detail Contact" });
});

app.post(
  "/contact/add",
  [
    body("name").notEmpty().withMessage("Nama harus diisi"),
    body("email").isEmail().notEmpty().withMessage("Email tidak valid"),
    body("phone")
      .isMobilePhone("id-ID")
      .notEmpty()
      .withMessage("Nomor telepon tidak valid"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newContact = { id: Date.now(), ...req.body };
      const filePath = path.join(__dirname, "data", "contacts.json");
      const fileBuffer = await read(filePath);
      const contacts = JSON.parse(fileBuffer);

      contacts.push(newContact);
      await fs.writeFile(filePath, JSON.stringify(contacts, null, 2));

      res.redirect("/contact");
    } catch (err) {
      console.error("Gagal menambahkan kontak:", err);
    }
  }
);

app.delete("/contact/:idContact", async (req, res) => {
  try {
    console.log("Delete request received for ID:", req.params.idContact);
    const filePath = path.join(__dirname, "data", "contacts.json");
    const fileBuffer = await read(filePath);
    const contacts = JSON.parse(fileBuffer);

    const filteredContacts = contacts.filter(
      (contact) => contact.id !== parseInt(req.params.idContact)
    );

    if (filteredContacts.length === contacts.length) {
      throw new Error("Nama kontak tidak ditemukan!");
    }

    await fs.writeFile(filePath, JSON.stringify(filteredContacts, null, 2));
    res.redirect("/contact");
  } catch (err) {
    console.error("Gagal menghapus kontak:", err);
    res.status(500).send("Gagal menghapus kontak.");
  }
});

app.put("/contact/:idContact", async (req, res) => {
  try {
    console.log("Update request received for ID:", req.params.idContact);
    const filePath = path.join(__dirname, "data", "contacts.json");
    const fileBuffer = await read(filePath);
    const contacts = JSON.parse(fileBuffer);

    const updatedContacts = contacts.map((contact) =>
      contact.id === parseInt(req.params.idContact)
        ? { ...contact, ...req.body }
        : contact
    );

    await fs.writeFile(filePath, JSON.stringify(updatedContacts, null, 2));
    res.redirect("/contact");
  } catch (err) {
    console.error("Gagal memperbarui kontak:", err);
    res.status(500).send("Gagal memperbarui kontak.");
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).send("404 NOT FOUND");
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
