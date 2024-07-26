import { createInterface } from "readline/promises";
import { stdin, stdout } from "process";
import { readFile as _readFile, writeFile } from "fs/promises";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import validator from "validator";
import chalk from "chalk";

// * Path Direktori
const dirPath = "./data";

// * Path File
const filePath = `${dirPath}/contacts.json`;

// * Cek apakah direktori exists
!existsSync(dirPath) ? mkdirSync(dirPath) : "";

// * Cek apakah file exists
!existsSync(filePath) ? await writeFile(filePath, "[]") : "";

// * Membaca file contacts
const readFile = async () => {
  try {
    const data = await _readFile(filePath, "utf-8");
    const jsonArray = JSON.parse(data);
    return jsonArray;
  } catch (err) {
    console.log(err);
  }
};

// * Function untuk Menulis data
const write = async (file, values) => {
  await writeFile(file, JSON.stringify(values, null, 2));
};

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
  const contact = {
    name,
    phone,
    email,
  };

  // * Membaca file contacts.json
  const contacts = await readFile();

  console.log(chalk.blue(`Your name is: ${name}`));

  // * Validasi mobile phone
  if (!validator.isMobilePhone(phone, "id-ID")) {
    console.log(chalk.red("Nomor telepon tidak valid"));
    return false;
  }

  console.log(chalk.blue(`Your mobile number is: ${phone}`));

  // * Validasi Email
  if (!validator.isEmail(email)) {
    console.log(chalk.red("Email tidak valid!"));
    return false;
  }

  console.log(chalk.blue(`Your email is: ${email}`));

  //  * Push data baru
  contacts.push(contact);

  // * Menulis ulang data kontak ke dalam file contacts.json
  // await writeFile(filePath, JSON.stringify(contacts, null, 2));
  await write(filePath, contacts);
  console.log("Kontak berhasil ditambahkan!");
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
  console.log(chalk.blue(`Berhasil menghapus kontak: ${name}`));
};

// * Menampilkan list dari seluruh kontak
const listContact = async () => {
  try {
    // * Membaca file contacts.json
    const contacts = await readFile();

    // * Membuat object baru untuk di tampilkan
    const contact = Object.values(contacts).map((contact, i) => {
      console.log(chalk.green(`Kontak ${i + 1}`));
      console.log(
        chalk.green(`Nama: ${contact.name}
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
    const contact = Object.values(contacts).find((contact) => {
      if (contact.name.toLowerCase() != name.toLowerCase()) {
        throw new Error(`Kontak ${name} tidak ditemukan!`);
      } else {
        return contact.name.toLowerCase() == name.toLowerCase();
      }
    });

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

    // * Membuat object baru dengan mengubah salah satu data kontak yang dipilih.
    // * Dan menggantinya dengan data baru
    const newContact = Object.values(contacts).map((contact) => {
      // ! Belum selesai, masih banyak hal yang harus dikembangkan
      // * Cek apakah kontak yang akan diubah tersedia
      // if (contact.name.toLowerCase() != oldName.toLowerCase()) {
      //   console.error(`Kontak ${oldName} tidak ditemukan!`);
      //   throw new Error("Kontak yang dipilih tidak tersedia!");
      // }
      if (contact.name.toLowerCase() == oldName.toLowerCase()) {
        contact.name = name;
        contact.phone = phone;
        contact.email = email;
      }
      return contact;
    });

    // * Pesan jika berhasil
    console.log(`Berhasil mengubah kontak ${oldName}`);

    write(filePath, newContact);
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
