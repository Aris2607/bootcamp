import process from "process";

process.on("beforeExit", (code) => {
  console.log("This message will display before the program is stopped", code);
});

process.on("exit", (code) =>
  console.log(
    "This message will display while the program is stopped running",
    code
  )
);

console.log("This message will displayed first");
