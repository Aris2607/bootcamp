import { question, saveContact } from "./contacts.js";

const main = async () => {
  const name = await question("What is your name? ");
  const phone = await question("Your mobile number?  ");
  const email = await question("Your email address? ");

  saveContact({ name, phone, email });
};

main();
