import yargs from "yargs";
import contacts from "./contacts.js";
import { hideBin } from "yargs/helpers";

yargs(hideBin(process.argv))
  .command({
    command: "add",
    describe: "Menambahkan kontak",
    builder: {
      name: {
        describe: "Name",
        demandOption: true,
        type: "string",
      },
      phone: {
        describe: "Phone",
        demandOption: true,
        type: "string",
      },
      email: {
        describe: "Email",
        demandOption: false,
        type: "string",
      },
    },
    handler(argv) {
      contacts.saveContact(argv.name, argv.phone, argv.email);
    },
  })
  .command({
    command: "remove",
    describe: "Menghapus kontak",
    builder: {
      name: {
        describe: "Name",
        demandOption: true,
        type: "string",
      },
    },
    handler(argv) {
      contacts.removeContact(argv.name);
    },
  })
  .command({
    command: "list",
    describe: "Menampilkan list kontak",
    builder: {},
    handler(argv) {
      contacts.listContact();
    },
  })
  .command({
    command: "detail",
    describe: "Menampilkan detail kontak",
    builder: {
      name: {
        describe: "Name",
        demandOption: true,
        type: "string",
      },
    },
    handler(argv) {
      contacts.detailContact(argv.name);
    },
  })
  .command({
    command: "update",
    describe: "Mengubah kontak",
    builder: {
      oldName: {
        describe: "Old Name",
        demandOption: true,
        type: "string",
      },
      name: {
        describe: "Name",
        demandOption: true,
        type: "string",
      },
      phone: {
        describe: "Phone",
        demandOption: true,
        type: "string",
      },
      email: {
        describe: "Email",
        demandOption: false,
        type: "string",
      },
    },
    handler(argv) {
      contacts.updateContact(argv.oldName, argv.name, argv.phone, argv.email);
    },
  })
  .parse();
