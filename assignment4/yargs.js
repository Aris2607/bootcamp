const yargs = require("yargs");

yargs.command({
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
    const contact = {
      name: argv.name,
      phone: argv.phone,
      email: argv.email,
    };

    console.log(contact);
  },
});

yargs.parse();
