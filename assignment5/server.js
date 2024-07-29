import http from "http";
import fs from "fs/promises";

const PORT = 3000;

const handleResponse = async (res, statusCode, contentType, filePath) => {
  try {
    const message = await fs.readFile(filePath, "utf-8");
    res.writeHead(statusCode, { "Content-Type": contentType });
    res.write(message);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/html" });
    res.write("<h1>404 NOT FOUND</h1>");
  } finally {
    res.end();
  }
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  switch (req.url) {
    case "/":
      handleResponse(res, 200, "text/html", "index.html");
      break;
    case "/contact":
      handleResponse(res, 200, "text/html", "contact.html");
    case "/about":
      handleResponse(res, 200, "text/html", "about.html");
      break;
    default:
      handleResponse(res, 404, "text/html", "<h1>404 Not Found</h1>");
  }
});

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
