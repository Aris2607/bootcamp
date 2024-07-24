import fs from "fs";

fs.writeFileSync("test.txt", "Hello");

const data = fs.readFileSync("test.txt", "utf-8");

console.log(data);
