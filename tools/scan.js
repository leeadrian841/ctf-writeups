// Reads every writeups/<folder-name>/README.md and returns the list the site shows.
// The fields come from the README itself:
//   - title:   the "# Heading" line (the "(Category, pts): Event" suffix is dropped)
//   - fields:  the "| Field | Value |" table at the top
//   - summary: the first paragraph under "## TL;DR"
// Used by tools/build.js (GitHub Pages) and tools/serve.js (local preview).
const fs = require("fs");
const path = require("path");

// Unfilled template placeholders such as "{your handle}" and "n/a" count as empty.
const clean = (v) => {
  const s = String(v || "").trim();
  return /\{[^}]*\}/.test(s) || /^n\/?a$/i.test(s) ? "" : s;
};

const humanize = (slug) => slug.replace(/-/g, " ").replace(/\b[a-z]/g, (c) => c.toUpperCase());

const parse = (md, slug) => {
  const lines = md.replace(/^﻿/, "").split(/\r?\n/);

  // Title
  const h1 = (lines.find((l) => /^#\s+/.test(l)) || "").replace(/^#\s+/, "").trim();
  const short = h1.replace(/\s*\([^()]*\)\s*:.*$/, "");
  const title = clean(short) || humanize(slug);

  // Field table: the first markdown table in the file
  const rows = [];
  let inTable = false;
  for (const line of lines) {
    const m = line.match(/^\s*\|(.+)\|\s*$/);
    if (!m) {
      if (inTable) break;
      continue;
    }
    inTable = true;
    const cells = m[1].split("|").map((c) => c.trim());
    if (cells.length < 2 || /^:?-+:?$/.test(cells[0]) || /^field$/i.test(cells[0])) continue;
    rows.push([cells[0], clean(cells.slice(1).join("|"))]);
  }
  const get = (...names) => (rows.find(([k]) => names.includes(k.toLowerCase())) || [])[1] || "";

  // Summary
  const start = lines.findIndex((l) => /^##\s+TL;?DR\s*$/i.test(l));
  let summary = "";
  if (start !== -1) {
    const body = [];
    for (const l of lines.slice(start + 1)) {
      if (/^#/.test(l) || (body.length && !l.trim())) break;
      if (l.trim()) body.push(l.trim());
    }
    // Drop backticks and **bold** / _italic_ marks, but keep * and _ inside `code` (file ./*, bandit_pass).
    summary = clean(body.join(" ").split("`").map((s, i) => (i % 2 ? s : s.replace(/[*_]/g, ""))).join(""));
  }

  const points = get("points");
  return {
    slug,
    file: `writeups/${slug}/README.md`,
    title,
    category: get("category").toLowerCase(),
    platform: get("platform"),
    event: get("event"),
    date: get("date"),
    difficulty: get("difficulty"),
    status: get("status"),
    points: /^\d+/.test(points) ? parseInt(points, 10) : null,
    tags: get("tags", "techniques").split(",").map((t) => t.trim()).filter(Boolean),
    summary,
    // Every filled-in row, in README order, for the writeup page header.
    fields: rows.filter(([, v]) => v),
  };
};

const scan = (root) => {
  const dir = path.join(root, "writeups");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(dir, d.name, "README.md")))
    .map((d) => parse(fs.readFileSync(path.join(dir, d.name, "README.md"), "utf8"), d.name));
};

module.exports = { scan, parse };
