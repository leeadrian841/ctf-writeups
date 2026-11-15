// Builds the site into _site/ for GitHub Pages: node tools/build.js
// Copies the repo and writes one page per writeup folder, so that
// writeups/<folder-name>/README.md is published at /<folder-name>.
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const out = path.join(root, "_site");
const skip = new Set([".git", ".github", "_site", "tools", "node_modules", ".claude"]);
const reserved = new Set(["index", "writeup", "assets", "data", "writeups", "404"]);

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);
for (const name of fs.readdirSync(root)) {
  if (!skip.has(name)) fs.cpSync(path.join(root, name), path.join(out, name), { recursive: true });
}

const site = JSON.parse(fs.readFileSync(path.join(root, "data/site.json"), "utf8"));
const writeups = JSON.parse(fs.readFileSync(path.join(root, "data/writeups.json"), "utf8"));
const template = fs.readFileSync(path.join(root, "writeup.html"), "utf8");

const seen = new Set();
for (const w of writeups) {
  const slug = path.posix.basename(path.posix.dirname(w.file || ""));
  const fail = (msg) => {
    console.error(`Error in data/writeups.json, "${w.title}": ${msg}`);
    process.exit(1);
  };
  if (!slug || slug === ".") fail(`"file" must be inside a folder, for example writeups/my-challenge/README.md`);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) fail(`folder name "${slug}" must use only lowercase letters, numbers and hyphens`);
  if (reserved.has(slug)) fail(`folder name "${slug}" is reserved by the site`);
  if (seen.has(slug)) fail(`folder name "${slug}" is used by more than one writeup`);
  if (!fs.existsSync(path.join(root, w.file))) fail(`file not found: ${w.file}`);
  seen.add(slug);

  // Real title and description in the HTML, so shared links preview properly.
  const title = `${w.title} | ${site.title}`;
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(w.summary || "")}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(w.summary || "")}">`,
    `<meta property="og:type" content="article">`,
  ].join("\n  ");
  fs.writeFileSync(path.join(out, `${slug}.html`), template.replace(/<title>.*?<\/title>/, () => head));
  console.log(`/${slug}`);
}
console.log(`Built ${seen.size} writeup page(s) into _site/`);
