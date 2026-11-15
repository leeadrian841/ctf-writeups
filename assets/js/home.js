// Home page: card grid with search, filters and sort.
(async () => {
  const { esc, fmtDate } = CTF;
  const $ = (id) => document.getElementById(id);
  const grid = $("grid");

  let data;
  try {
    data = await CTF.load();
  } catch (err) {
    grid.innerHTML = `<p class="empty">${esc(err.message)}<br>Serve the site over HTTP (GitHub Pages or a local server), not from file://.</p>`;
    return;
  }
  const { site, categories, writeups } = data;

  CTF.header(site);
  $("intro").textContent = site.tagline;
  $("intro-links").innerHTML = (site.links || [])
    .map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`)
    .join("");

  // ---------- State ----------

  const SORTS = {
    newest: { label: "Newest", fn: (a, b) => (b.date || "").localeCompare(a.date || "") },
    oldest: { label: "Oldest", fn: (a, b) => (a.date || "").localeCompare(b.date || "") },
    title: { label: "Title A-Z", fn: (a, b) => a.title.localeCompare(b.title) },
    category: { label: "Category", fn: (a, b) => a.cat.name.localeCompare(b.cat.name) || a.title.localeCompare(b.title) },
    difficulty: { label: "Difficulty", fn: (a, b) => (a.diff?.rank ?? 99) - (b.diff?.rank ?? 99) || a.title.localeCompare(b.title) },
    points: { label: "Points", fn: (a, b) => (b.points || 0) - (a.points || 0) },
  };

  // Each filter group: key used in the URL, label, and how to read the value(s) from a writeup.
  const GROUPS = [
    { key: "cat", label: "Category", get: (w) => [w.cat.id] },
    { key: "diff", label: "Difficulty", get: (w) => (w.difficulty ? [w.difficulty] : []) },
    { key: "platform", label: "Platform", get: (w) => (w.platform ? [w.platform] : []) },
    { key: "tag", label: "Techniques", get: (w) => w.tags },
  ];

  const state = { q: "", sort: "newest", match: "all", sel: Object.fromEntries(GROUPS.map((g) => [g.key, new Set()])) };
  const expanded = new Set(); // groups showing all chips
  const CHIP_LIMIT = 12;

  // ---------- URL hash <-> state ----------

  const readHash = () => {
    const p = new URLSearchParams(location.hash.slice(1));
    state.q = p.get("q") || "";
    state.sort = SORTS[p.get("sort")] ? p.get("sort") : "newest";
    state.match = p.get("match") === "any" ? "any" : "all";
    for (const g of GROUPS) state.sel[g.key] = new Set((p.get(g.key) || "").split("|").filter(Boolean));
  };

  const writeHash = () => {
    const p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.sort !== "newest") p.set("sort", state.sort);
    if (state.match !== "all") p.set("match", state.match);
    for (const g of GROUPS) if (state.sel[g.key].size) p.set(g.key, [...state.sel[g.key]].join("|"));
    const s = p.toString();
    history.replaceState(null, "", s ? "#" + s : location.pathname + location.search);
  };

  // ---------- Filtering ----------

  const haystack = new Map(
    writeups.map((w) => [w, [w.title, w.summary, w.cat.name, w.platform, w.event, w.difficulty, ...w.tags].join(" ").toLowerCase()])
  );

  const matches = (w) => {
    const terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    const text = haystack.get(w);
    if (!terms.every((t) => text.includes(t))) return false;

    for (const g of GROUPS) {
      const sel = state.sel[g.key];
      if (!sel.size) continue;
      const vals = g.get(w);
      // Techniques follow the All/Any toggle. Other groups hold one value per writeup, so any match counts.
      const ok = g.key === "tag" && state.match === "all" ? [...sel].every((v) => vals.includes(v)) : vals.some((v) => sel.has(v));
      if (!ok) return false;
    }
    return true;
  };

  // ---------- Rendering ----------

  const card = (w) => {
    const shown = w.tags.slice(0, 5);
    const extra = w.tags.length - shown.length;
    const meta = [w.platform, w.event, fmtDate(w.date)].filter(Boolean).map(esc).join(" · ");
    const diff = w.difficulty ? `<span class="diff" style="--d:${esc(w.diff?.color || "")}">${esc(w.difficulty)}</span>` : "";
    const pts = w.points ? ` · ${esc(w.points)} pts` : "";
    return `
      <a class="card reveal" href="writeup.html?w=${encodeURIComponent(w.slug)}" style="--cat:${esc(w.cat.color)}">
        <div class="card-top">
          <h2>${esc(w.title)}</h2>
          <span class="badge">${esc(w.cat.name)}</span>
        </div>
        <div class="card-meta">${meta}</div>
        <div class="card-meta">${diff}${pts}${w.sample ? ' <span class="sample-note">sample</span>' : ""}</div>
        ${w.summary ? `<p class="card-summary">${esc(w.summary)}</p>` : ""}
        <div class="chips">
          ${shown.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}
          ${extra > 0 ? `<span class="chip more">+${extra}</span>` : ""}
        </div>
      </a>`;
  };

  const observer =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), observer.unobserve(e.target))),
          { rootMargin: "0px 0px -5% 0px" }
        )
      : null;

  const renderGrid = () => {
    const list = writeups.filter(matches).sort(SORTS[state.sort].fn);
    const total = writeups.length;
    $("results-meta").textContent =
      list.length === total ? `${total} writeup${total === 1 ? "" : "s"}` : `${list.length} of ${total} writeups`;

    grid.innerHTML = list.length
      ? list.map(card).join("")
      : `<p class="empty">No writeups match these filters.</p>`;

    grid.querySelectorAll(".reveal").forEach((el) => (observer ? observer.observe(el) : el.classList.add("in")));
  };

  const renderFilters = () => {
    const html = GROUPS.map((g) => {
      // Count how many writeups carry each value.
      const counts = new Map();
      for (const w of writeups) for (const v of g.get(w)) counts.set(v, (counts.get(v) || 0) + 1);

      let items;
      if (g.key === "cat") {
        // Categories keep the order of categories.json. Empty ones are hidden.
        items = categories.filter((c) => counts.has(c.id)).map((c) => ({ value: c.id, label: c.name, color: c.color, title: c.description }));
        for (const v of counts.keys()) if (!data.catById.has(v)) items.push({ value: v, label: v });
      } else if (g.key === "diff") {
        items = [...counts.keys()]
          .sort((a, b) => (data.diffById.get(a)?.rank ?? 99) - (data.diffById.get(b)?.rank ?? 99))
          .map((v) => ({ value: v, label: v, color: data.diffById.get(v)?.color }));
      } else {
        items = [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a) || a.localeCompare(b)).map((v) => ({ value: v, label: v }));
      }
      if (!items.length) return "";

      const sel = state.sel[g.key];
      const showAll = expanded.has(g.key) || items.length <= CHIP_LIMIT;
      const visible = showAll ? items : items.filter((it, i) => i < CHIP_LIMIT || sel.has(it.value));

      const chips = visible
        .map(
          (it) => `
          <button class="chip" type="button" data-group="${g.key}" data-value="${esc(it.value)}" aria-pressed="${sel.has(it.value)}"${it.title ? ` title="${esc(it.title)}"` : ""}>
            ${it.color ? `<span class="dot" style="--c:${esc(it.color)}"></span>` : ""}${esc(it.label)} <span class="n">${counts.get(it.value)}</span>
          </button>`
        )
        .join("");
      const more = items.length > CHIP_LIMIT ? `<button class="chip more" type="button" data-expand="${g.key}">${showAll ? "Show fewer" : `Show all ${items.length}`}</button>` : "";

      return `<div class="filter-group"><h3>${g.label} <span>${items.length}</span></h3><div class="chips">${chips}${more}</div></div>`;
    }).join("");

    $("filter-groups").innerHTML = html;

    const n = GROUPS.reduce((sum, g) => sum + state.sel[g.key].size, 0);
    $("filter-count").hidden = !n;
    $("filter-count").textContent = n;
    document.querySelectorAll('input[name="match"]').forEach((r) => (r.checked = r.value === state.match));
  };

  const renderSort = () => {
    $("sort-label").textContent = SORTS[state.sort].label;
    $("sort-menu").innerHTML = Object.entries(SORTS)
      .map(([k, s]) => `<li role="none"><button type="button" role="menuitemradio" aria-checked="${k === state.sort}" data-sort="${k}">${s.label}</button></li>`)
      .join("");
  };

  const update = () => {
    writeHash();
    renderFilters();
    renderSort();
    renderGrid();
  };

  // ---------- Events ----------

  $("q").addEventListener("input", (e) => {
    state.q = e.target.value.trim();
    writeHash();
    renderGrid();
  });

  const filtersBtn = $("filters-btn");
  filtersBtn.addEventListener("click", () => {
    const open = filtersBtn.getAttribute("aria-expanded") !== "true";
    filtersBtn.setAttribute("aria-expanded", open);
    $("filters").hidden = !open;
  });

  $("filter-groups").addEventListener("click", (e) => {
    const exp = e.target.closest("[data-expand]");
    if (exp) {
      const k = exp.dataset.expand;
      expanded.has(k) ? expanded.delete(k) : expanded.add(k);
      renderFilters();
      return;
    }
    const chip = e.target.closest("[data-group]");
    if (!chip) return;
    const sel = state.sel[chip.dataset.group];
    sel.has(chip.dataset.value) ? sel.delete(chip.dataset.value) : sel.add(chip.dataset.value);
    update();
  });

  document.querySelectorAll('input[name="match"]').forEach((r) =>
    r.addEventListener("change", () => {
      state.match = r.value;
      update();
    })
  );

  $("clear").addEventListener("click", () => {
    for (const g of GROUPS) state.sel[g.key].clear();
    state.q = "";
    $("q").value = "";
    update();
  });

  const sortBtn = $("sort-btn");
  const sortMenu = $("sort-menu");
  const setSortOpen = (open) => {
    sortBtn.setAttribute("aria-expanded", open);
    sortMenu.hidden = !open;
  };
  sortBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    setSortOpen(sortMenu.hidden);
  });
  sortMenu.addEventListener("click", (e) => {
    const b = e.target.closest("[data-sort]");
    if (!b) return;
    state.sort = b.dataset.sort;
    setSortOpen(false);
    update();
  });
  document.addEventListener("click", (e) => !e.target.closest(".sort") && setSortOpen(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setSortOpen(false));

  window.addEventListener("hashchange", () => {
    readHash();
    $("q").value = state.q;
    renderFilters();
    renderSort();
    renderGrid();
  });

  // ---------- Start ----------

  readHash();
  $("q").value = state.q;
  if (GROUPS.some((g) => state.sel[g.key].size)) {
    filtersBtn.setAttribute("aria-expanded", "true");
    $("filters").hidden = false;
  }
  renderFilters();
  renderSort();
  renderGrid();
})();
