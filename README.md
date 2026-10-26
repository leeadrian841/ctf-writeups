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

Template: [WRITEUP_TEMPLATE.md](WRITEUP_TEMPLATE.md)

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
