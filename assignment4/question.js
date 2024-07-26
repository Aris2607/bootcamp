import * as readLine from "readline/promises";
import { stdin as input, stdout as output } from "node:process";
import validator from "validator";
import chalk from "chalk";
import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";

// * Membaca file contacts
const readFile = async () => {
  const data = await fs.readFile(filePath, { encoding: "utf-8" });
  return data;
};

//  * Menambahkan contacts
const question = async () => {
  // * Path Direktori
  const dirPath = "./data";

  // * Path File
  const filePath = `${dirPath}/contacts.json`;

  // * Cek apakah direktori exists
  !existsSync(dirPath) ? mkdirSync(dirPath) : "";

  // * Cek apakah file exists
  !existsSync(filePath) ? await fs.writeFile(filePath, "[]") : "";

  let valid = true;
  var rl = readLine.createInterface({ input, output });

  // * Pertanyaan Nama
  const name = await rl.question("Siapa nama kamu? ");

  console.log(chalk.blue(`Terimakasih telah mampir ${name}`));

  do {
    // * Pertanyaan nomor telepon
    var phone = await rl.question("Berapa nomor telepon kamu kamu? ");
    valid = validator.isMobilePhone(phone, "id-ID");
    !valid
      ? console.log(chalk.red("Nomor telepon tidak valid"))
      : console.log(chalk.blue(`Nomor telepon kamu adalah: ${phone}`));
  } while (!valid);

  do {
    // * Pertanyaan email
    var email = await rl.question("Tuliskan email kamu: ");

    valid = validator.isEmail(email);
    !valid
      ? console.log(chalk.red("Email tidak valid!"))
      : console.log(chalk.blue(`Email kamu adalah: ${email}`));
  } while (!valid);

  const contact = {
    name,
    phone,
    email,
  };

  const fileBuffer = await readFile();

  const contacts = JSON.parse(fileBuffer);

  //  * Push data baru
  contacts.push(contact);

  await fs.writeFile(filePath, JSON.stringify(contacts, null, 2));
  console.log("Kontak berhasil ditambahkan!");

  rl.close();
};

question();
