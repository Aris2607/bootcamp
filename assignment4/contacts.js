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

// ! Deprecated. Function sudah tidak digunakan lagi
// * Membuat pertanyaan
const question = async (q) => {
  const rl = createInterface({ stdin, stdout });
  const data = await new Promise((resolve) => {
    resolve(rl.question(q));
  });

  rl.close();
  return data;
};

// * Menyimpan data kontak
const saveContact = async (name, phone, email) => {
  try {
    const contact = {
      name,
      phone,
      email,
    };

    // * Membaca file contacts.json
    const contacts = await readFile();
    const trimmedName = name.trim();

    // * Validasi nama
    if (validator.isEmpty(trimmedName)) {
      throw new Error("Nama tidak boleh kosong!");
    }

    if (await nameValidation(name)) {
      throw new Error(
        `Kontak ${name} sudah terdaftar! Silahkan pilih nama lain`
      );
    } else {
      console.log(`Nama tersedia...`);
    }

    // * Validasi mobile phone
    if (!validator.isMobilePhone(phone, "id-ID")) {
      console.log(chalk.red("Nomor telepon tidak valid"));
      return false;
    }

    console.log(chalk.blue(`Nomor kamu: ${phone}`));

    // * Validasi Email
    if (!validator.isEmail(email)) {
      console.log(chalk.red("Email tidak valid!"));
      return false;
    }

    console.log(chalk.blue(`Email kamu: ${email}`));

    //  * Push data baru
    contacts.push(contact);

    // * Menulis ulang data kontak ke dalam file contacts.json
    await write(filePath, contacts);
    console.log(chalk.green("Kontak berhasil ditambahkan!"));
  } catch (err) {
    console.error("Error:", err.message);
  }
};

// * Menghapus kontak
const removeContact = async (name) => {
  //* Membaca file contacts.json
  const contacts = await readFile();

  // * Filter data contacts.json supaya mengecualikan nama yang ingin dihapus
  const contact = Object.values(contacts).filter(
    (contact) => !(contact.name.toLowerCase() == name.toLowerCase())
  );

  // * Cek apakah length dari object baru sama dengan object lama.
  // * Jika beda akan bernilai true, dan jika sama maka akan false
  if (contact.length === Object.values(contacts).length) {
    console.error(
      "Gagal menghapus kontak. Nama yang dimasukkan mungkin tidak ada!"
    );
    return false;
  }

  // * Menimpa object lama dengan object baru
  await write(filePath, contact);
  console.log(chalk.green(`Berhasil menghapus kontak: ${name}`));
};

// * Menampilkan list dari seluruh kontak
const listContact = async () => {
  try {
    // * Membaca file contacts.json
    const contacts = await readFile();

    // * Membuat object baru untuk di tampilkan
    const contact = Object.values(contacts).map((contact, i) => {
      console.log(chalk.blue(`Kontak ${i + 1}`));
      console.log(
        chalk.blue(`Nama: ${contact.name}
Mobile: ${contact.phone} \n`)
      );
    });

    return contact;
  } catch (err) {
    console.error("Gagal memuat list kontak: ", err);
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
    // * Membaca file contacts.json
    const contacts = await readFile();

    // * Mendapatkan index dari object lama yang ingin diubah
    const getIndex = Object.values(contacts).findIndex(
      (contact) => contact.name.toLowerCase() == oldName.toLowerCase()
    );

    if (getIndex == -1) {
      throw new Error(`Kontak ${oldName} tidak ditemukan!`);
    } else {
      const newContact = Object.values(contacts).map((contact) => {
        if (contact.name.toLowerCase() == oldName.toLowerCase()) {
          contact.name = name;
          contact.phone = phone;
          contact.email = email;
        }

        return contact;
      });

      // * Validasi nama
      if (await nameValidation(name)) {
        throw new Error(`Kontak ${name} sudah ada! Silahkan pilih nama lain`);
      }
      write(filePath, newContact);
    }

    // * Pesan jika berhasil
    console.log(chalk.green(`Berhasil mengubah kontak: ${oldName}`));
  } catch (error) {
    console.error("Gagal mengubah data: ", error.message);
  }
};

export default {
  saveContact,
  removeContact,
  listContact,
  detailContact,
  updateContact,
};
