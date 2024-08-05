import { URL } from "url";

const myUrl = new URL("/foo", "https://example.org/");

const newUrl = myUrl.username = "Abunda Risduar"

console.log(newUrl)

console.log(myUrl);
