import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import morgan from "morgan";
import fs from "fs/promises";
import methodOverride from "method-override";
import { body, validationResult } from "express-validator";
import session from "express-session";
import flash from "connect-flash";

const app = express();
const PORT = 3000;

// Determine the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const read = async (filePath) => await fs.readFile(filePath, "utf-8");

const duplicateName = async (filePath, data, id = null) => {
  const fileBuffer = await read(filePath);
  const contacts = JSON.parse(fileBuffer);

  const duplicate = contacts.find(
    (contact) =>
      contact.name.toLowerCase() === data.name.toLowerCase() &&
      contact.id !== id
  );

  if (duplicate) {
    return {
      msg: "Nama sudah ada, silahkan pilih nama lain",
    };
  }
  return null;
};

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "aHqhpUsZdFW7tqjE",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

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

  res.render("contact", {
    contacts,
    title: "Contact",
    errors: [],
    formData: {},
    showModal: false,
    message: "OK",
    messageType: "Success",
  });
});

app.get("/contact/:idContact", async (req, res) => {
  const fileBuffer = await read(path.join(__dirname, "data", "contacts.json"));
  const contacts = JSON.parse(fileBuffer);
  const detailContact = contacts.find(
    (contact) => contact.id === parseInt(req.params.idContact)
  );

  res.render("detail", {
    detailContact,
    title: "Detail Contact",
    errors: [], // Tambahkan baris ini
    formData: {}, // Tambahkan baris ini
    isUpdate: false, // Tambahkan baris ini
    showModal: false,
  });
});

app.post(
  "/contact/add",
  [
    body("name").notEmpty().withMessage("Nama harus diisi"),
    body("email").isEmail().withMessage("Email tidak valid"),
    body("phone")
      .isMobilePhone("id-ID")
      .withMessage("Nomor telepon tidak valid"),
  ],
  async (req, res) => {
    let errors = validationResult(req).array();
    const formData = req.body;

    const duplicateError = await duplicateName(
      path.join(__dirname, "data", "contacts.json"),
      req.body
    );

    if (duplicateError) {
      errors.push(duplicateError);
    }

    if (errors.length > 0) {
      const fileBuffer = await read(
        path.join(__dirname, "data", "contacts.json")
      );
      const contacts = JSON.parse(fileBuffer);

      return res.render("contact", {
        contacts,
        title: "Contact",
        errors: errors,
        formData,
        showModal: true,
      });
    }

    try {
      const newContact = { id: Date.now(), ...req.body };
      const filePath = path.join(__dirname, "data", "contacts.json");
      const fileBuffer = await read(filePath);
      const contacts = JSON.parse(fileBuffer);

      contacts.push(newContact);
      await fs.writeFile(filePath, JSON.stringify(contacts, null, 2));

      req.flash("success_msg", "Kontak berhasil ditambahkan!");
      res.redirect("/contact");
    } catch (err) {
      console.error("Gagal menambahkan kontak:", err);
      req.flash("error_msg", "Gagal menambahkan kontak!");
      res.redirect("/contact");
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

app.put(
  "/contact/:idContact",
  [
    body("name").notEmpty().withMessage("Nama harus diisi!"),
    body("email").isEmail().withMessage("Email tidak valid!"),
    body("phone")
      .isMobilePhone("id-ID")
      .withMessage("Nomor telepon tidak valid!"),
  ],
  async (req, res) => {
    console.log("PUT route hit");

    const errors = validationResult(req);
    const formData = req.body;
    const idContact = req.params.idContact;

    console.log("Validation result:", errors.array());
    console.log("Form data:", formData);
    console.log("Contact ID:", idContact);

    if (!errors.isEmpty()) {
      console.log("Validation errors found");

      const fileBuffer = await read(
        path.join(__dirname, "data", "contacts.json")
      );
      const contacts = JSON.parse(fileBuffer);
      const detailContact = contacts.find(
        (contact) => contact.id === parseInt(idContact)
      );

      console.log("Detail contact:", detailContact);
      console.log("Rendering detail page with errors");

      return res.render("detail", {
        detailContact,
        title: "Detail Contact",
        errors: errors.array(),
        formData,
        showModal: true,
        isUpdate: true,
      });
    }

    try {
      console.log("No validation errors. Proceeding to update contact");

      const filePath = path.join(__dirname, "data", "contacts.json");
      const fileBuffer = await read(filePath);
      const contacts = JSON.parse(fileBuffer);

      const updatedContacts = contacts.map((contact) =>
        contact.id === parseInt(idContact)
          ? { ...contact, ...formData }
          : contact
      );

      console.log("Updated contacts:", updatedContacts);

      await fs.writeFile(filePath, JSON.stringify(updatedContacts, null, 2));
      console.log("Data updated successfully. Redirecting to /contact");
      res.redirect("/contact");
    } catch (err) {
      console.error("Gagal memperbarui kontak:", err);
      res.status(500).send("Gagal memperbarui kontak.");
    }
  }
);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).send("404 NOT FOUND");
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
