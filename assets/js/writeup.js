// Writeup page: loads one markdown file and renders it.
(async () => {
  const { esc, fmtDate } = CTF;
  const $ = (id) => document.getElementById(id);
  const content = $("content");
  const fail = (msg) => (content.innerHTML = `<p class="notice">${esc(msg)}<br><a href="./">Back to all writeups</a></p>`);

  let data;
  try {
    data = await CTF.load();
  } catch (err) {
    return fail(err.message);
  }
  CTF.header(data.site);

  // /ctf-writeups/<folder-name> opens that writeup. writeup.html?w=<folder-name> still works as a fallback.
  const last = decodeURIComponent(location.pathname.replace(/\/+$/, "").split("/").pop()).replace(/\.html$/, "");
  const slug = new URLSearchParams(location.search).get("w") || (last === "writeup" ? "" : last);
  const w = data.writeups.find((x) => x.slug === slug);
  if (!w) return fail("Writeup not found.");

  document.title = `${w.title} | ${data.site.title}`;

  // ---------- Header ----------

  const meta = [
    ["Platform", w.platform],
    ["Event", w.event],
    ["Date", fmtDate(w.date)],
    ["Difficulty", w.difficulty],
    ["Points", w.points],
  ].filter(([, v]) => v);

  $("head").innerHTML = `
    <header class="w-head" style="--cat:${esc(w.cat.color)}">
      <a class="badge" href="./#cat=${encodeURIComponent(w.cat.id)}" style="text-decoration:none">${esc(w.cat.name)}</a>
      <h1>${esc(w.title)}</h1>
      <ul class="w-meta">${meta.map(([k, v]) => `<li>${k}: <b>${esc(v)}</b></li>`).join("")}</ul>
      <div class="chips">${w.tags.map((t) => `<a class="chip" href="./#tag=${encodeURIComponent(t)}" style="text-decoration:none">${esc(t)}</a>`).join("")}</div>
    </header>`;

  // ---------- Markdown ----------

  let md;
  try {
    const res = await fetch(w.file, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Could not load ${w.file} (${res.status})`);
    md = await res.text();
  } catch (err) {
    return fail(err.message);
  }

  // The page header already shows the title, so drop the leading "# Title" line.
  md = md.replace(/^﻿?\s*#\s+.*\r?\n/, "");

  marked.setOptions({ gfm: true });
  content.innerHTML = DOMPurify.sanitize(marked.parse(md));

  // Relative image and link paths are written relative to the markdown file, so resolve them from there.
  const base = new URL(w.file, location.href);
  const isRelative = (u) => u && !/^([a-z][a-z0-9+.-]*:|\/\/|#|\/)/i.test(u);
  content.querySelectorAll("img[src]").forEach((img) => {
    const src = img.getAttribute("src");
    if (isRelative(src)) img.src = new URL(src, base).href;
    img.loading = "lazy";
  });
  content.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (isRelative(href)) a.href = new URL(href, base).href;
    if (/^https?:/i.test(a.href) && a.host !== location.host) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
  });

  // Tables scroll sideways on narrow screens.
  content.querySelectorAll("table").forEach((t) => {
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    t.replaceWith(wrap);
    wrap.appendChild(t);
  });

  // Code blocks: syntax highlighting, language label, copy button.
  content.querySelectorAll("pre > code").forEach((code) => {
    const lang = (code.className.match(/language-([\w+-]+)/) || [])[1] || "";
    if (lang && hljs.getLanguage(lang)) hljs.highlightElement(code);

    const pre = code.parentElement;
    const box = document.createElement("div");
    box.className = "code";
    box.innerHTML = `<div class="code-bar"><span>${esc(lang || "output")}</span><button class="copy" type="button">Copy</button></div>`;
    pre.replaceWith(box);
    box.appendChild(pre);

    const btn = box.querySelector(".copy");
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        btn.textContent = "Copied";
      } catch {
        btn.textContent = "Failed";
      }
      setTimeout(() => (btn.textContent = "Copy"), 1500);
    });
  });

  // ---------- Table of contents ----------

  const used = new Set();
  const heads = [...content.querySelectorAll("h2, h3")];
  heads.forEach((h) => {
    let id = h.textContent.trim().toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") || "section";
    while (used.has(id)) id += "-2";
    used.add(id);
    h.id = id;
  });

  if (heads.length > 1) {
    $("toc").innerHTML = `<h2>On this page</h2><ol>${heads
      .map((h) => `<li class="lvl${h.tagName[1]}"><a href="#${h.id}">${esc(h.textContent)}</a></li>`)
      .join("")}</ol>`;

    const links = new Map([...$("toc").querySelectorAll("a")].map((a) => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          links.forEach((a) => a.classList.remove("active"));
          links.get(e.target.id)?.classList.add("active");
        }
      },
      { rootMargin: "0px 0px -75% 0px" }
    );
    heads.forEach((h) => spy.observe(h));
  }

  if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();

  // ---------- Previous / next ----------

  const ordered = [...data.writeups].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const i = ordered.indexOf(w);
  const link = (x, cls, label) =>
    x ? `<a class="${cls}" href="${x.url}"><small>${label}</small>${esc(x.title)}</a>` : "";
  $("w-nav").innerHTML = link(ordered[i - 1], "prev", "← Newer") + link(ordered[i + 1], "next", "Older →");
})();
