import http from "http";

const PORT = 3000;

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const router = (req, res) => {
  switch (req.url) {
    case "/":
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Selamat datang di server!");
      break;
    case "/about":
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Ini adalah halaman tentang.");
      break;
    default:
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Halaman tidak ditemukan.");
      break;
  }
};

const server = http.createServer(
  (req, res) => logger(req, res),
  () => router(req, res)
);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
