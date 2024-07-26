import { readFile as _readFile, writeFile } from "fs/promises";

// * Path Direktori
const dirPath = "./data";

// * Path File
const filePath = `${dirPath}/contacts.json`;

// * Membaca file contacts
export const readFile = async () => {
  try {
    const data = await _readFile(filePath, "utf-8");
    const jsonArray = JSON.parse(data);
    return jsonArray;
  } catch (err) {
    console.log(err);
  }
};

// * Function untuk Menulis data
export const write = async (file, values) => {
  await writeFile(file, JSON.stringify(values, null, 2));
};

// * Validasi nama
// * return true jika terjadi duplikat nama
export const nameValidation = async (name) => {
  const contacts = await readFile();
  let duplicate = false;

  const contact = Object.values(contacts).map(
    (contact) => contact.name.toLowerCase() == name.toLowerCase()
  );

  for (let i = 0; i <= contact.length; i++) {
    if (contact[i] == true) {
      duplicate = true;
    }
  }

  return duplicate;
};

// * Validasi jika nama tidak ditemukan
// * return true jika nama tidak ditemukan
export const nameNotFound = async (name) => {
  const contacts = await readFile();
  let notFound = true;

  Object.values(contacts).find((contact) => {
    if (contact.name.toLowerCase() == name.toLowerCase()) {
      notFound = false;
    }
  });

  return notFound;
};
