# CTF Writeups

Hands-on writeups from Capture the Flag challenges and retired lab machines.
Each writeup documents the full path: recon, hypothesis, what failed, root cause, and mitigation.

**Author:** Adrian Lee · [Portfolio](https://leeadrian841.github.io) · [LinkedIn](https://www.linkedin.com/in/YOUR-HANDLE)

**Start here:** [Featured writeup title](platforms/htb/box-name/README.md). Best example of my methodology.

---

## Writeup Index

| Date | Platform | Challenge | Category | Difficulty | Key Techniques |
|------|----------|-----------|----------|------------|----------------|
| 2026-10 | HackTheBox | [Box Name](platforms/htb/box-name/README.md) | Web | Easy | SQLi, privilege escalation via SUID |
| 2026-10 | TryHackMe | [Room Name](platforms/thm/room-name/README.md) | Forensics | Medium | PCAP analysis, IOC extraction |
| 2026-09 | picoCTF | [Challenge Name](events/picoctf-2026/challenge-name/README.md) | Crypto | Easy | XOR key recovery |

Categories: Web · Pwn · Reverse Engineering · Crypto · Forensics · OSINT · Misc

---

## Writeup Structure

Every writeup follows the same analyst-report format:

1. **Objective.** Target, scope, and what success looks like.
2. **Reconnaissance.** Enumeration and initial observations.
3. **Hypotheses and dead ends.** What I tried, why it failed, what it ruled out.
4. **Exploitation.** The working path, step by step.
5. **Root cause.** The underlying weakness, mapped to CWE and MITRE ATT&CK where relevant.
6. **Mitigation.** How a defender closes it.
7. **Lessons learned.** What I'd do faster next time.

Template: [ctf-writeup-template.md](ctf-writeup-template.md)

---

## Website

This repo is also a website on GitHub Pages. The home page shows every writeup as a tile with search, filters and sort. Each tile opens the rendered markdown.

**Add a writeup**

Copy [ctf-writeup-template.md](ctf-writeup-template.md) to `writeups/<folder-name>/README.md`, fill it in and push. That is the only step: the site reads everything from the README. Images go in `writeups/<folder-name>/img/`.

| Shown on the site | Comes from |
|-------------------|------------|
| Title | The `# Heading` line. The `(Category, pts): Event` part is dropped. |
| Platform, event, date, difficulty, points, status | The matching rows of the `Field / Value` table |
| Category | The `Category` row: a category `id` or name from [data/categories.json](data/categories.json) |
| Technique chips | The `Tags` row, separated by commas |
| Summary on the tile | The first paragraph under `## TL;DR` |

Write the date as `YYYY-MM-DD` so sorting works. Rows left as `{placeholders}` or `n/a` are hidden. Any extra row you add to the table appears in the writeup page header.

The folder name is the URL: `writeups/my-challenge/` is published at `https://leeadrian841.github.io/ctf-writeups/my-challenge`. Use lowercase letters, numbers and hyphens.

**Add a category**

Add an object to [data/categories.json](data/categories.json). It appears in the filters as soon as a writeup uses it.

```json
{ "id": "cloud", "name": "Cloud", "color": "#38bdf8", "description": "AWS, Azure and GCP misconfigurations." }
```

**Adjust the layout**

The pages use [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/) for layout and responsive behaviour, so most adjustments are class changes in `index.html` and `writeup.html`. For example, tiles per row are set by `row-cols-1 row-cols-md-2 row-cols-xxl-3` on the grid. Colours, fonts and the base text size are variables at the top of [assets/css/style.css](assets/css/style.css).

**Other settings**

Site title, intro text, header links and difficulty levels live in [data/site.json](data/site.json).

**Preview locally**

```bash
node tools/serve.js
```

Then open `http://localhost:8080`.

---

## Repository Layout

```
ctf-writeups/
├── platforms/
│   ├── htb/            # HackTheBox (retired machines only)
│   └── thm/            # TryHackMe
├── events/
│   └── <event-year>/   # Time-boxed CTF competitions
├── notes/              # Cheat sheets, payloads, tool syntax
├── WRITEUP_TEMPLATE.md
└── LICENSE
```

---

## Publishing Policy

- Writeups cover **retired machines and completed events only**.
- No active-challenge solutions. No flags for live content.
- No challenge binaries, packet captures, or malware samples are stored here.

---

## Tools

Kali Linux · Nmap · Burp Suite · Ghidra · Wireshark · CyberChef · pwntools

---

## License

Writeups are licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Reuse and share with credit.
