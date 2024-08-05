import http from "http";
import url from "url";

http
  .createServer((req, res) => {
    const u = url.parse(req.url);
    res.end(u);
  })
  .listen(3000);

console.log("Server is running on port 3000");
