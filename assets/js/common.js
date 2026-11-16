// Shared data loading and helpers for both pages.
const CTF = (() => {
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const getJSON = async (path) => {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Could not load ${path} (${res.status})`);
    return res.json();
  };

  // Loads site config, categories and the writeup list, and links them together.
  // data/writeups.json is not a file in the repo: it is generated from the
  // README in each writeups/<folder-name>/ by tools/scan.js.
  const load = async () => {
    const [site, categories, writeups] = await Promise.all([
      getJSON("data/site.json"),
      getJSON("data/categories.json"),
      getJSON("data/writeups.json"),
    ]);
    const catById = new Map(categories.map((c) => [c.id, c]));
    const diffById = new Map((site.difficulties || []).map((d, i) => [d.id, { ...d, rank: i }]));

    for (const w of writeups) {
      // The README's Category row may hold a category id ("crypto") or its name ("Cryptography").
      const key = (w.category || "").toLowerCase();
      // An unknown category still renders, with a neutral colour.
      w.cat = categories.find((c) => c.id.toLowerCase() === key || c.name.toLowerCase() === key) ||
        { id: key || "uncategorised", name: w.category || "Uncategorised", color: "#a8b3c2" };
      const diff = [...diffById.values()].find((d) => d.id.toLowerCase() === (w.difficulty || "").toLowerCase());
      w.difficulty = diff ? diff.id : w.difficulty;
      w.diff = diff || null;
      w.tags = w.tags || [];
      w.fields = w.fields || [];
      // The URL of a writeup is the name of its folder.
      w.url = encodeURIComponent(w.slug);
    }
    return { site, categories, writeups, catById, diffById };
  };

  // The Date row accepts a year or a year and month:
  //   2026     -> 2026
  //   2026-02  -> Feb-2026
  // A full date (2026-02-14) still works and shows as 14-Feb-2026.
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fmtDate = (value) => {
    const m = String(value || "").trim().match(/^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?$/);
    if (!m) return value || "";
    const [, year, month, day] = m;
    const name = month && MONTHS[Number(month) - 1];
    if (!name) return year;
    return day ? `${Number(day)}-${name}-${year}` : `${name}-${year}`;
  };

  const header = (site) => {
    const brand = document.querySelector("[data-brand]");
    if (brand) brand.textContent = site.title.toLowerCase().replace(/\s+/g, "-");
    const foot = document.querySelector("[data-footer]");
    if (foot) foot.textContent = `© ${new Date().getFullYear()} ${site.author} · Writeups licensed CC BY 4.0 · Retired machines and completed events only`;
  };

  // Floating "Back to top" button, shown once the page is scrolled.
  const toTop = document.createElement("button");
  toTop.type = "button";
  toTop.className = "to-top btn rounded-pill";
  toTop.innerHTML = '<span aria-hidden="true">↑</span> Back to top';
  toTop.addEventListener("click", () => window.scrollTo({ top: 0 }));
  document.body.appendChild(toTop);
  const onScroll = () => toTop.classList.toggle("show", window.scrollY > 150);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  return { esc, load, fmtDate, header };
})();
