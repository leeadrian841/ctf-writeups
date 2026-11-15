// Minimal static server for local preview: node tools/serve.js
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const port = process.env.PORT || 8080;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

http
  .createServer((req, res) => {
    let rel = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (rel.endsWith("/")) rel += "index.html";
    const file = path.join(root, rel);
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end("Forbidden");
    fs.readFile(file, (err, buf) => {
      if (err) return res.writeHead(404).end("Not found");
      res.writeHead(200, { "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
      res.end(buf);
    });
  })
  .listen(port, () => console.log(`Serving on http://localhost:${port}`));
