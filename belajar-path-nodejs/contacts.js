import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";

const dirPath = "./data";
const filePath = `${dirPath}/contacts.json`;

const write = (filePath, data) => fs.writeFile(filePath, data);
const read = async (filePath) => await fs.readFile(filePath, "utf-8");

!existsSync(dirPath) ? mkdirSync(dirPath) : "";
!existsSync(filePath) ? write(filePath, "[]") : "";

console.log(await read(filePath));
