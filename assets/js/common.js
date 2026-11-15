// Shared data loading and helpers for both pages.
const CTF = (() => {
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const getJSON = async (path) => {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Could not load ${path} (${res.status})`);
    return res.json();
  };

  const slugOf = (file) => String(file || "").split("/").slice(-2, -1)[0] || "";

  // Loads site config, categories and the writeup list, and links them together.
  const load = async () => {
    const [site, categories, writeups] = await Promise.all([
      getJSON("data/site.json"),
      getJSON("data/categories.json"),
      getJSON("data/writeups.json"),
    ]);
    const catById = new Map(categories.map((c) => [c.id, c]));
    const diffById = new Map((site.difficulties || []).map((d, i) => [d.id, { ...d, rank: i }]));

    for (const w of writeups) {
      // An unknown category id still renders, with a neutral colour.
      w.cat = catById.get(w.category) || { id: w.category, name: w.category || "Uncategorised", color: "#a8b3c2" };
      w.diff = diffById.get(w.difficulty) || null;
      w.tags = w.tags || [];
      // The URL of a writeup is the name of the folder that holds its markdown file.
      w.slug = slugOf(w.file) || w.slug;
      w.url = encodeURIComponent(w.slug);
    }
    return { site, categories, writeups, catById, diffById };
  };

  const fmtDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso + (iso.length === 7 ? "-01" : "") + "T00:00:00");
    if (isNaN(d)) return iso;
    const opts = iso.length === 7 ? { year: "numeric", month: "short" } : { year: "numeric", month: "short", day: "numeric" };
    return d.toLocaleDateString("en-GB", opts);
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
  toTop.className = "to-top";
  toTop.innerHTML = '<span aria-hidden="true">↑</span> Back to top';
  toTop.addEventListener("click", () => window.scrollTo({ top: 0 }));
  document.body.appendChild(toTop);
  const onScroll = () => toTop.classList.toggle("show", window.scrollY > 150);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  return { esc, load, fmtDate, header };
})();
