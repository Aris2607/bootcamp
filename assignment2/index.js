import fs from "fs/promises";

await fs.writeFile("data.txt", "Test");

const readData = async () => {
  try {
    const data = await fs.readFile("data.txt", "utf-8");
    console.log(data);
  } catch (err) {
    console.error("Error: ", err);
  }
};

readData();
