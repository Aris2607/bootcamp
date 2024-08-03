import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import morgan from "morgan";
// import fs from "fs/promises";
import methodOverride from "method-override";
import { body, validationResult } from "express-validator";
// import session from "express-session";
// import flash from "connect-flash";
// import { db } from "./db.js";
import pg from "pg";

const { Pool } = pg;
const client = new Pool({
  user: "postgres",
  password: "hiragana1",
  host: "localhost",
  port: "5432",
  database: "postgres",
});

// * Koneksi ke database
client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database", err);
  });

const app = express();
const PORT = 3000;

// * Determine the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// * Read File
// const read = async (filePath) => await fs.readFile(filePath, "utf-8");

// * Validasi duplikat nama
const duplicateName = async (name, id = null) => {
  try {
    const query = id
      ? 'SELECT * FROM public."Contact" WHERE name = $1 AND id != $2'
      : 'SELECT * FROM public."Contact" WHERE name = $1';
    const params = id ? [name, id] : [name];

    const result = await client.query(query, params);
    if (result.rows.length > 0) {
      return { msg: "Nama sudah ada, silahkan pilih nama lain" };
    }
    return null;
  } catch (err) {
    console.error("Error checking duplicate name:", err);
    return { msg: "Error checking duplicate name" };
  }
};

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// app.use(
//   session({
//     secret: "aHqhpUsZdFW7tqjE",
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// app.use(flash());

// * Route Home
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// * Route About Page
app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// * Route Contact Page
app.get("/contact", async (req, res) => {
  try {
    // * Query
    const result = await client.query(
      'SELECT * FROM public."Contact" ORDER BY id DESC'
    );
    res.render("contact", {
      contacts: result.rows,
      title: "Contact",
      errors: [],
      formData: {},
      showModal: false,
      message: "OK",
      messageType: "Success",
    });
  } catch (err) {
    console.error(err);
  }
});

// * Route Detail Kontak
app.get("/contact/:idContact", async (req, res) => {
  try {
    const result = await client.query(
      'SELECT * FROM public."Contact" WHERE id = $1',
      [req.params.idContact]
    );
    res.render("detail", {
      detailContact: result.rows[0],
      title: "Detail Contact",
      errors: [],
      formData: {},
      isUpdate: false,
      showModal: false,
    });
  } catch (err) {
    console.error("Error executing query", err);
  }
});

// * Route Menambahkan Kontak
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

    try {
      const duplicateError = await duplicateName(req.body.name);
      if (duplicateError) {
        errors.push(duplicateError);
      }

      if (errors.length > 0) {
        const result = await client.query('SELECT * FROM public."Contact"');
        return res.render("contact", {
          contacts: result.rows,
          title: "Contact",
          errors,
          formData,
          showModal: true,
        });
      }

      await client.query(
        'INSERT INTO public."Contact" (name, phone, email) VALUES ($1, $2, $3)',
        [req.body.name, req.body.phone, req.body.email]
      );

      // req.flash("success_msg", "Kontak berhasil ditambahkan!");
      res.redirect("/contact");
    } catch (err) {
      console.error("Gagal menambahkan kontak:", err);
      // req.flash("error_msg", "Gagal menambahkan kontak!");
      res.redirect("/contact");
    }
  }
);

// * Route Menghapus Kontak
app.delete("/contact/:idContact", async (req, res) => {
  try {
    const result = await client.query(
      'DELETE FROM public."Contact" WHERE id = $1',
      [req.params.idContact]
    );
    res.redirect("/contact");
  } catch (err) {
    console.error("Gagal menghapus kontak:", err);
    res.status(500).send("Gagal menghapus kontak.");
  }
});

// * Route Mengubah Kontak
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
    let errors = validationResult(req).array();
    const formData = req.body;
    const idContact = req.params.idContact;

    const duplicateError = await duplicateName(req.body.name, req.body.id);
    if (duplicateError) {
      errors.push(duplicateError);
    }

    if (errors.length > 0) {
      const result = await client.query(
        'SELECT * FROM public."Contact" WHERE id = $1',
        [idContact]
      );
      return res.render("detail", {
        detailContact: result.rows[0],
        title: "Detail Contact",
        errors,
        formData,
        showModal: true,
        isUpdate: true,
      });
    }

    try {
      await client.query(
        'UPDATE public."Contact" SET name = $1, phone = $2, email = $3 WHERE id = $4',
        [formData.name, formData.phone, formData.email, idContact]
      );
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
