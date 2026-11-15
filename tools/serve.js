// Minimal static server for local preview: node tools/serve.js
const http = require("http");
const fs = require("fs");
const path = require("path");
const { scan } = require("./scan");

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
    let file = path.join(root, rel);
    // /<folder-name> serves the writeup page, like the pages tools/build.js generates for GitHub Pages.
    const name = rel.replace(/^\/+|\/+$/g, "");
    if (name && !name.includes("/") && fs.existsSync(path.join(root, "writeups", name))) file = path.join(root, "writeup.html");
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end("Forbidden");
    // The writeup list is read fresh from the READMEs on every request.
    if (rel === "/data/writeups.json") {
      res.writeHead(200, { "Content-Type": types[".json"], "Cache-Control": "no-store" });
      return res.end(JSON.stringify(scan(root)));
    }
    fs.readFile(file, (err, buf) => {
      if (err) return res.writeHead(404).end("Not found");
      res.writeHead(200, { "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
      res.end(buf);
    });
  })
  .listen(port, () => console.log(`Serving on http://localhost:${port}`));
