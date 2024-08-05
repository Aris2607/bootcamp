import http from "http";

// Konfigurasi port
const PORT = process.env.PORT || 3000;

// Middleware untuk menangani logging
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// Middleware untuk menangani rute
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

// Membuat server
const server = http.createServer((req, res) => {
  logger(req, res, () => {
    router(req, res);
  });
});

// Menjalankan server
server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
