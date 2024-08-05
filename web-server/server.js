import http from "http";
import url from "url";
import fs from "fs/promises";
import path from "path";

const PORT = process.env.PORT || 3000;

const routes = {
  "/": {
    method: "GET",
    handler: (req, res) => sendHtmlFile(res, "home.html"),
  },
  "/user": {
    method: "GET",
    handler: (req, res) => sendHtmlFile(res, "user.html"),
  },
  "/about": {
    method: "GET",
    handler: (req, res) => sendHtmlFile(res, "about.html"),
  },
};

const sendResponse = (res, statusCode, message, contentType = "text") => {
  const contentTypes = {
    text: "text/plain",
    html: "text/html",
    json: "application/json",
  };
  res.writeHead(statusCode, { "Content-Type": contentTypes[contentType] });
  res.end(message);
};

const sendHtmlFile = async (res, filename) => {
  try {
    const filePath = path.join(process.cwd(), "views", filename);
    const content = await fs.readFile(filePath, "utf-8");
    sendResponse(res, 200, content, "html");
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
    sendResponse(res, 500, "Terjadi kesalahan internal server", "text");
  }
};

const handleRequest = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const route = routes[path];

  if (route && route.method === req.method) {
    route.handler(req, res);
  } else {
    sendResponse(res, 404, "404 Halaman Tidak Ditemukan");
  }
};

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}/`);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Aplikasi mungkin perlu ditutup di sini
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // Aplikasi mungkin perlu ditutup di sini
});
