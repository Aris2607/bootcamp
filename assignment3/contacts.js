import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import validator from "validator";
import chalk from "chalk";

// * Path Direktori
const dirPath = "./data";

// * Path File
const filePath = `${dirPath}/contacts.json`;

// * Cek apakah direktori exists
!existsSync(dirPath) ? mkdirSync(dirPath) : "";

// * Cek apakah file exists
!existsSync(filePath) ? await fs.writeFile(filePath, "[]") : "";

// * Membaca file contacts
const readFile = async () => {
  const data = await fs.readFile(filePath, { encoding: "utf-8" });
  return data;
};

// * Membuat pertanyaan
export const question = async (q) => {
  const rl = readline.createInterface({ input, output });
  const data = await new Promise((resolve) => {
    resolve(rl.question(q));
  });

  rl.close();
  return data;
};

// * Menyimpan data kontak
export const saveContact = async ({ ...data }) => {
  const contact = {
    name: data.name,
    phone: data.phone,
    email: data.email,
  };

  console.log(chalk.blue(`Your name is: ${data.name}`));

  // * Validasi mobile phone
  if (!validator.isMobilePhone(data.phone, "id-ID")) {
    console.log(chalk.red("Nomor telepon tidak valid"));
    return false;
  }

  console.log(chalk.blue(`Your mobile number is: ${data.phone}`));

  // * Validasi Email
  if (!validator.isEmail(data.email)) {
    console.log(chalk.red("Email tidak valid!"));
    return false;
  }

  console.log(chalk.blue(`Your email is: ${data.email}`));

  // * Membaca file contacts.json
  const fileBuffer = await readFile();

  const contacts = JSON.parse(fileBuffer);

  //  * Push data baru
  contacts.push(contact);

  // * Menulis ulang data kontak ke dalam file contacts.json
  await fs.writeFile(filePath, JSON.stringify(contacts, null, 2));
  console.log("Kontak berhasil ditambahkan!");
};
