// Writeup page: loads one markdown file and renders it.
(async () => {
  const { esc, fmtDate } = CTF;
  const $ = (id) => document.getElementById(id);
  const content = $("content");
  const fail = (msg) => (content.innerHTML = `<p class="notice my-5">${esc(msg)}<br><a href="./">Back to all writeups</a></p>`);

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

  // Every filled-in row of the README's field table, in README order.
  // Category and Tags are shown as the badge and the chips instead.
  const meta = w.fields
    .filter(([k]) => !["category", "tags", "techniques"].includes(k.toLowerCase()))
    .map(([k, v]) => [k, k.toLowerCase() === "date" ? fmtDate(v) : v]);

  $("head").innerHTML = `
    <header class="w-head" style="--cat:${esc(w.cat.color)}">
      <a class="cat-badge text-decoration-none" href="./#cat=${encodeURIComponent(w.cat.id)}">${esc(w.cat.name)}</a>
      <h1>${esc(w.title)}</h1>
      <ul class="w-meta list-unstyled d-flex flex-wrap column-gap-4 row-gap-1 mb-3">${meta.map(([k, v]) => `<li>${esc(k)}: <b>${esc(v)}</b></li>`).join("")}</ul>
      <div class="d-flex flex-wrap gap-2">${w.tags.map((t) => `<a class="chip text-decoration-none" href="./#tag=${encodeURIComponent(t)}">${esc(t)}</a>`).join("")}</div>
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

  // The field table is already shown in the page header, so leave it out of the article.
  const fieldTable = content.querySelector("table");
  if (fieldTable && /^field$/i.test(fieldTable.querySelector("th")?.textContent.trim() || "")) fieldTable.remove();

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

  // ---------- Terminal colouring ----------
  // Code blocks with no language (or console / terminal / shell / output) are
  // coloured as a terminal session: prompts, commands, flags, strings, labels
  // and {placeholders} each get their own colour.

  const COMMANDS = new Set(
    ("ssh scp sftp ls cat cd pwd find grep egrep awk sed sort uniq strings file xxd base64 tr cut head tail wc echo printf " +
      "sudo su id whoami uname chmod chown mkdir rm cp mv ln touch tar unzip gzip gunzip bzip2 7z openssl nc ncat netcat nmap " +
      "curl wget ping dig nslookup host telnet ftp python python3 pip pip3 perl ruby php node npm git gcc make gdb ltrace strace " +
      "objdump readelf docker hydra john hashcat gobuster ffuf nikto sqlmap msfconsole tcpdump tshark binwalk exiftool steghide " +
      "diff man export source env ps kill mount df du history which whereis locate crontab systemctl service apt apt-get").split(" ")
  );
  const span = (cls, text) => (text ? `<span class="${cls}">${esc(text)}</span>` : "");
  // Plain text with {placeholders} picked out.
  const withPlaceholders = (text, cls) =>
    text
      .split(/(\{[^{}\n]*\})/)
      .map((part, i) => (i % 2 ? span("t-ph", part) : cls ? span(cls, part) : esc(part)))
      .join("");
  // A command line: first word is the command, then flags, strings and arguments.
  const command = (text) => {
    let first = true;
    return (text.match(/"[^"]*"|'[^']*'|\{[^{}]*\}|\s+|[^\s]+/g) || [])
      .map((tok) => {
        if (/^\s+$/.test(tok)) return tok;
        if (/^\{.*\}$/.test(tok)) return span("t-ph", tok);
        if (first) return (first = false), span("t-cmd", tok);
        if (/^["']/.test(tok)) return span("t-str", tok);
        if (/^\$[\w{]/.test(tok)) return span("t-var", tok);
        if (/^-/.test(tok)) return span("t-flag", tok);
        // After a pipe or && the next word is a new command.
        if (["|", "&&", "||", ";"].includes(tok)) return (first = true), span("t-op", tok);
        if (/^\d?[<>]{1,2}$/.test(tok)) return span("t-op", tok);
        return span("t-arg", tok);
      })
      .join("");
  };
  const terminalLine = (line) => {
    let m;
    // user@host:path$ command
    if ((m = line.match(/^([\w.-]+@[\w.-]+)(:)([^$#]*)([$#])(\s?)(.*)$/))) {
      return span("t-user", m[1]) + span("t-sym", m[2]) + span("t-path", m[3]) + span("t-sym", m[4]) + m[5] + command(m[6]);
    }
    // # comment
    if (/^\s*#/.test(line)) return span("t-comment", line);
    // $ command, PS C:\> command
    if ((m = line.match(/^(\$|>|PS [^>]*>)(\s+)(.*)$/))) return span("t-sym", m[1]) + m[2] + command(m[3]);
    // A line that starts with a well-known command and has no prompt
    if ((m = line.match(/^(sudo\s+)?([\w.-]+)(\s|$)/)) && COMMANDS.has(m[2])) return command(line);
    // Label: value
    if ((m = line.match(/^([A-Za-z][\w ()-]{0,30}:)(\s.*|$)/))) return span("t-label", m[1]) + withPlaceholders(m[2], "t-out");
    return withPlaceholders(line, "t-out");
  };
  const TERMINAL_LANGS = new Set(["", "console", "terminal", "shell", "shell-session", "output", "text", "plaintext"]);

  // Blocks tagged bash / sh / zsh are usually a pasted session (prompt, command,
  // output), so they get the terminal colours too. Only a real script, with a
  // shebang or if / for / while / function, goes to highlight.js instead.
  const SHELL_LANGS = new Set(["bash", "sh", "zsh", "ksh", "fish"]);
  const isScript = (text) =>
    /^#!/.test(text) || /^\s*(if|then|else|elif|fi|for|while|until|do|done|case|esac|function)\b/m.test(text) || /^\s*[\w-]+\s*\(\)\s*\{/m.test(text);

  // Code blocks: syntax highlighting, language label, copy button.
  content.querySelectorAll("pre > code").forEach((code) => {
    const lang = ((code.className.match(/language-([^\s]+)/) || [])[1] || "").toLowerCase();
    const raw = code.textContent;
    if (TERMINAL_LANGS.has(lang) || /^\{.*\}$/.test(lang) || (SHELL_LANGS.has(lang) && !isScript(raw))) {
      code.innerHTML = raw.replace(/\n$/, "").split("\n").map(terminalLine).join("\n");
    } else if (lang === "error") {
      code.innerHTML = span("t-error", raw);
    } else if (hljs.getLanguage(lang)) {
      hljs.highlightElement(code);
    } else {
      // Unknown language name: let highlight.js work it out from the code itself.
      code.innerHTML = hljs.highlightAuto(raw).value;
    }

    const pre = code.parentElement;
    const box = document.createElement("div");
    box.className = "code";
    box.innerHTML = `<div class="code-bar"><span>${esc(/^\{.*\}$/.test(lang) ? "code" : lang || "terminal")}</span><button class="copy" type="button">Copy</button></div>`;
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
    $("toc").innerHTML = `<h2>On this page</h2><ol class="list-unstyled m-0">${heads
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

  // Same order as "Newest" on the home page, so Newer / Older step through levels in order.
  const ordered = [...data.writeups].sort(
    (a, b) => (b.date || "").localeCompare(a.date || "") || a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: "base" })
  );
  const i = ordered.indexOf(w);
  const link = (x, cls, label) =>
    `<div class="col ${cls}">${x ? `<a class="d-block h-100 p-3 text-decoration-none" href="${x.url}"><small class="d-block mb-1">${label}</small>${esc(x.title)}</a>` : ""}</div>`;
  $("w-nav").innerHTML = link(ordered[i - 1], "", "← Newer") + link(ordered[i + 1], "text-sm-end", "Older →");
})();
