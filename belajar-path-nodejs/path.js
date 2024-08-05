import path from "path";

const filePath = "./data/contacts.json";

console.log(path.parse(filePath));
console.log(path.delimiter);
console.log(path.basename(filePath));
console.log(path.normalize(filePath));
console.log(path.toNamespacedPath(filePath));
