// Creates writeups/<folder-name>/README.md from ctf-writeup-template.md and opens it in VS Code.
// Usage: node tools/new-writeup.js <folder-name>   (or the "New writeup" task in VS Code)
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const root = path.join(__dirname, "..");
const name = (process.argv[2] || "").trim();

// Same rules as tools/build.js, because the folder name becomes the page URL.
const NAME_OK = new RegExp("^[a-z0-9][a-z0-9-]*$");
const reserved = new Set(["index", "writeup", "assets", "data", "writeups", "404"]);
if (!NAME_OK.test(name) || reserved.has(name)) {
  console.error(`"${name}" is not a valid folder name. Use lowercase letters, numbers and hyphens, e.g. overthewire-bandit-16.`);
  process.exit(1);
}

const file = path.join(root, "writeups", name, "README.md");
// Never overwrite a writeup that already exists.
if (fs.existsSync(file)) {
  console.error(`writeups/${name}/README.md already exists, so nothing was changed.`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(file), { recursive: true });
fs.copyFileSync(path.join(root, "ctf-writeup-template.md"), file);
console.log(`Created writeups/${name}/README.md`);

// Open it in the current VS Code window. If the code command isn't available, the file is still created.
// The path is quoted because it can contain spaces; the folder name itself was validated above.
spawn(`code --reuse-window "${file}"`, { shell: true, stdio: "ignore", detached: true }).on("error", () => {}).unref();
