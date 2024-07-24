import * as readLine from "readline/promises";
import * as readline from "readline";
import { stdin as input, stdout as output } from "node:process";
import validator from "validator";
import chalk from "chalk";

const question = async () => {
  const rl = readLine.createInterface({ input, output });

  // * Pertanyaan Nama
  const answer = await rl.question("Siapa nama kamu? ");

  console.log(chalk.blue(`Terimakasih telah mampir ${answer}`));

  // * Pertanyaan nomor telepon
  const answer2 = await rl.question("Berapa nomor telepon kamu kamu? ");

  !validator.isMobilePhone(answer2, "id-ID")
    ? console.log(chalk.red("Nomor telepon tidak valid"))
    : console.log(chalk.blue(`Nomor telepon kamu adalah: ${answer2}`));

  // * Pertanyaan email
  const answer3 = await rl.question("Tuliskan email kamu: ");

  !validator.isEmail(answer3)
    ? console.log(chalk.red("Email tidak valid!"))
    : console.log(chalk.blue(`Email kamu adalah: ${answer3}`));

  rl.close();
};

const question2 = () => {
  const rl = readline.createInterface({ input, output });

  rl.question("Siapa nama kamu? ", (answer) => {
    console.log(`Terimakasih telah mampir ${answer}`);
    rl.question("Berapa nomor telepon kamu? ", (answer) => {
      console.log(`Nomor telepon kamu adalah: ${answer}`);
      rl.question("Tuliskan email kamu: ", (answer) => {
        console.log(`Email kamu adalah: ${answer}`);
        rl.close();
      });
    });
  });
};

question();
