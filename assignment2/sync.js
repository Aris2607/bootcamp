import * as readline from "readline";
import { stdin as input, stdout as output } from "process";

const rl = readline.createInterface({ input, output });

rl.question("What is your favorite food? ", (answer) => {
  console.log(`Oh, so your favorite food is ${answer}`);
  rl.close();
});
