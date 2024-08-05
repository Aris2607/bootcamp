import fs from "fs";
import { readFile as read } from "fs/promises";

const data = await read("./data.js");

console.info(data.toString());
