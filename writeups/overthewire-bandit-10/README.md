# OverTheWire: Bandit Lvl 10 (Linux): Bandit (2026)

| Field      | Value |
|------------|-------|
| Platform   | OverTheWire |
| Event      | Bandit |
| Date       | 2026 |
| Category   | Linux |
| Difficulty | Easy |
| Points     | N/A |
| Solves     | 0 |
| Author     | OverTheWire |
| Solved by  | leeadrian841 |
| Status     | Solved |
| Tags       | Linux |

## TL;DR
Base64 encoding: the trailing `=` padding gives it away, and `base64 -d data.txt` decodes it. Encoding is reversible by anyone and gives no secrecy.

## Challenge
> The password for the next level is stored in the file `data.txt`, which contains Base64 encoded data.

- Files: `data.txt` (Base64 encoded)
- Service: `bandit10@bandit.labs.overthewire.org:2220` (online)

## First look
I checked the contents of the `data.txt` file first and noticed that the string ends with `=`. This shows that it is Base64 encoded and you can use the `base64` command to decode it to find the password for `bandit11`.

```bash
ssh bandit10@bandit.labs.overthewire.org -p 2220
Password: {Password for bandit10}

bandit10@bandit:~$ ls
data.txt
bandit10@bandit:~$ file data.txt
data.txt: ASCII text
bandit10@bandit:~$ head data.txt
VGhlIHBhc3N3b3JkIGlzIHBZZk9ZNkh3VXNEajVyTDlVdnloVTdNQ212OHZONVJvCg==
```

## Dead ends
- None

## Solution
### Use `base64`
Base64 is a reversible binary-to-text encoding scheme that converts binary or text data into a printable ASCII character set (`A–Z`, `a–z`, `0–9`, `+`, `/`, with `=` for padding).

When I ran the `head` command for the `data.txt` file, I noticed that the end of the encoded string ends with `=`. This shows that it is Base64 encoded and you can use the `base64` command to decode it to find the password for `bandit11`.

```bash
# Decode it using base64
bandit10@bandit:~$ base64 -d data.txt
The password is {Password for bandit11}
```

![{Describe what the screenshot shows}](img/{file}.png)

## Flag
`The password is {Password for bandit11}`

## Lessons learned
- Check the contents of the file first with `file`, `head` or `tail`.
- Learn how to decode and encode using `Base64`.

## References
- [Base64](https://en.wikipedia.org/wiki/Base64)