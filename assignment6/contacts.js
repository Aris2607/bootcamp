import { createInterface } from "readline/promises";
import { stdin, stdout } from "process";
import { existsSync, mkdirSync } from "fs";
import validator from "validator";
import chalk from "chalk";
import {
  readFile,
  write,
  nameValidation,
  nameNotFound,
} from "./util/contactsUtil.js";

// * Path Direktori
const dirPath = "./data";

// * Path File
const filePath = `${dirPath}/contacts.json`;

// * Cek apakah direktori exists
!existsSync(dirPath) ? mkdirSync(dirPath) : "";

// * Cek apakah file exists
!existsSync(filePath) ? await write(filePath, "[]") : "";

// * Function sudah tidak digunakan
const question = (q) => {
  const rl = createInterface({ stdin, stdout });
  return new Promise((resolve) => {
    rl.question(q, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

// * Validasi kontak
const validateContact = (name, phone, email) => {
  if (validator.isEmpty(name.trim())) {
    throw new Error("Nama tidak boleh kosong!");
  }
  if (!validator.isMobilePhone(phone, "id-ID")) {
    throw new Error("Nomor telepon tidak valid");
  }
  if (email && !validator.isEmail(email)) {
    throw new Error("Email tidak valid!");
  }
};

// * Menyimpan kontak
const saveContact = async (data, filePath) => {
  try {
    validateContact(name, phone, email);

    const contacts = await readFile();

    if (await nameValidation(name)) {
      throw new Error(
        `Kontak ${name} sudah terdaftar! Silahkan pilih nama lain`
      );
    }

    contacts.push({ name, phone, email });
    await write(filePath, contacts);
    console.log(chalk.green("Kontak berhasil ditambahkan!"));
  } catch (err) {
    console.error(chalk.red("Error:", err.message));
  }
};

// * Menghapus kontak
const removeContact = async (name) => {
  try {
    const contacts = await readFile();
    const filteredContacts = contacts.filter(
      (contact) => contact.name.toLowerCase() !== name.toLowerCase()
    );

    if (filteredContacts.length === contacts.length) {
      throw new Error("Nama kontak tidak ditemukan!");
    }

    await write(filePath, filteredContacts);
    console.log(chalk.green(`Berhasil menghapus kontak: ${name}`));
  } catch (err) {
    console.error(chalk.red("Error:", err.message));
  }
};

// * Menampilkan seluruh data kontak
const listContact = async () => {
  try {
    const contacts = await readFile();
    contacts.forEach((contact, i) => {
      console.log(chalk.blue(`Kontak ${i + 1}`));
      console.log(
        chalk.blue(`Nama: ${contact.name}\nMobile: ${contact.phone}\n`)
      );
    });
  } catch (err) {
    console.error(chalk.red("Gagal memuat list kontak:", err.message));
  }
};

// * Menampilkan detail dari kontak
const detailContact = async (name) => {
  try {
    // * Membaca file contacts.json
    const contacts = await readFile();

    // * Mencari data kontak untuk ditampilkan menggunakan method .find
    const contact = Object.values(contacts).find(
      (contact) => contact.name.toLowerCase() == name.toLowerCase()
    );

    // * Cek jika nama tidak ditemukan
    if (await nameNotFound(name)) {
      throw new Error(`Kontak ${name} tidak ditemukan!`);
    }

    // * Menampilkan detail kontak
    console.log(
      chalk.blue(`Detail Kontak: 
Nama: ${contact.name}
Mobile: ${contact.phone}
Email: ${contact.email}`)
    );
  } catch (error) {
    console.error("Gagal memuat detail kontak:", error.message);
  }
};

// * Mengubah data kontak
const updateContact = async (oldName, name, phone, email = "") => {
  try {
    const contacts = await readFile();
    const index = contacts.findIndex(
      (contact) => contact.name.toLowerCase() === oldName.toLowerCase()
    );

    if (index === -1) {
      throw new Error(`Kontak ${oldName} tidak ditemukan!`);
    }

    validateContact(name, phone, email);

    if (
      (await nameValidation(name)) &&
      name.toLowerCase() !== oldName.toLowerCase()
    ) {
      throw new Error(`Kontak ${name} sudah ada! Silahkan pilih nama lain`);
    }

    contacts[index] = { ...contacts[index], name, phone, email };
    await write(filePath, contacts);
    console.log(chalk.green(`Berhasil mengubah kontak: ${oldName}`));
  } catch (error) {
    console.error(chalk.red("Gagal mengubah data:", error.message));
  }
};

export default {
  saveContact,
  removeContact,
  listContact,
  detailContact,
  updateContact,
};
