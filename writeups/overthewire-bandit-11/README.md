# OverTheWire: Bandit Lvl 11 (Linux): Bandit (2026)

| Field      | Value |
|------------|-------|
| Platform   | OverTheWire |
| Event      | Bandit |
| Date       | 2026 |
| Category   | Linux |
| Difficulty | Medium |
| Points     | N/A |
| Solves     | 0 |
| Author     | OverTheWire |
| Solved by  | leeadrian841 |
| Status     | Solved |
| Tags       | Linux |

## TL;DR
The password for the next level is stored in the file `data.txt`, where all lowercase (a-z) and uppercase (A-Z) letters have been rotated by 13 positions.

## Challenge
> Find the password for the next level which is stored in the file `data.txt`, where all lowercase (a-z) and uppercase (A-Z) letters have been rotated by 13 positions.

- Files: `data.txt` (ROT13)
- Service: `bandit11@bandit.labs.overthewire.org:2220` (online)

## First look
It was mentioned that the string was rotated by 13 positions. I have to understand what is ROT13 cipher and the logic behind it. After understanding how it works, I have to consider how to use `tr` to map `A-Z` to `N-M` for the ROT13 cipher.

```bash
ssh bandit11@bandit.labs.overthewire.org -p 2220
Password: {Password for bandit11}

bandit11@bandit:~$ ls
data.txt
bandit11@bandit:~$ file data.txt
data.txt: ASCII text
bandit11@bandit:~$ head data.txt
Gur cnffjbeq vf TEBbmJCB8DlA0zTewHxVQ0JPLxMvDkeA
```

### Theory
**Substitution** means replacing one character with another. Substitution ciphers have been known and used for a very long time. Some of the most known are the *Caesar* and *Vigenère* ciphers. However, these simple substitution ciphers are not secure anymore!

Rotating letters by 13 positions is known as the **ROT13** substitution cipher. It is nice because looking at the Latin alphabet with 26 letters, the encryption algorithm equals the decryption algorithm.

| INPUT | ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz |
| OUTPUT | NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm |

The Linux `tr` command, which stands for ’translate’, allows replacing characters with others. The base command syntax looks like the following `tr <old_chars> <new_chars>`.

### Popular ROT Ciphers
- **ROT13:** Rotates the 26 letters of the Latin alphabet (A–Z) by 13 places. Because 13 is half of 26, applying the same operation twice decrypts the message. It is widely used to hide spoilers or punchlines online.
- **ROT5:** Rotates only decimal digits (0–9) by 5 positions (e.g., 0 becomes 5, and 1 becomes 6).
- **ROT18:** Combines **ROT13** for letters and **ROT5** for numbers into a single operation.
- **ROT47:** Extends the rotation to 94 printable ASCII characters (from character 33 `!` to 126 `~`), scrambling numbers, symbols, and letters alike for stronger visual obfuscation.

<aside>
📋

The `tr` command is then used with specific mappings: uppercase letters A-Z are mapped to N-Z and A-M, and lowercase letters a-z are mapped to n-z and a-m.

</aside>

## Dead ends
- None

## Solution
### Use `tr` for ROT13
ROT13 works in such that `A-Z` is mapped to `N-M` by 13 positions. The correct mapping for `A-Z` will be `N-ZA-M` and for `a-z`, it will be `n-za-m`. So when you run `tr`, it will be something like this:
```bash
tr 'A-Za-z' 'N-ZA-Mn-za-m'
```

```bash
# Use tr for ROT13 cipher
bandit11@bandit:~$ cat data.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'
The password is {Password for bandit12}
```

![{Describe what the screenshot shows}](img/{file}.png)

## Flag
`The password is {Password for bandit12}`

## Lessons learned
- Understand the different ciphers and how they work.
- Learn how to decode and encode ciphers using `tr`.

## References
- [ROT13](https://en.wikipedia.org/wiki/ROT13)