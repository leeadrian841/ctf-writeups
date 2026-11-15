# Example: Repeating-Key XOR (Cryptography, 250 pts): Sample CTF 2026

> **This is a placeholder writeup** that shows how the template renders on the site. Replace it with a real one.

| Field      | Value |
|------------|-------|
| Platform   | Example Platform |
| Event      | Sample CTF 2026 |
| Date       | 2026-10-18 |
| Category   | crypto |
| Difficulty | Medium |
| Points     | 250 (dynamic) |
| Solves     | n/a |
| Author     | n/a |
| Solved by  | your-handle |
| Status     | Solved during event |
| Tags       | XOR, Known Plaintext, Python |

## TL;DR
The ciphertext is XORed with a short repeating key. The flag format is known, so the first bytes of plaintext are known, and XORing them with the ciphertext reveals the key.

## Challenge
> We encrypted the flag with our unbreakable cipher. Good luck.

- Files: `cipher.hex`

## First look
The file holds a hex string. The length matched a plausible flag length, which suggested a stream-style cipher and not a block cipher.

```
$ wc -c cipher.hex
53 cipher.hex
```

## Dead ends
- Single-byte XOR brute force: tried all 256 keys -> no readable output, so the key is longer than one byte.
- Base64 decode of the raw bytes -> invalid, ruled out layered encoding.

## Solution
### Step 1: Recover the key from known plaintext
XOR is its own inverse: `key = ciphertext XOR plaintext`. Every flag starts with `CTF{`, so four key bytes fall out directly.

### Step 2: Decrypt with the repeating key
The four recovered bytes spelled a word, and repeating it decrypted the whole message.

```python
# solve.py: recover a repeating XOR key from a known prefix
from itertools import cycle

ct = bytes.fromhex(open("cipher.hex").read().strip())
known = b"CTF{"

key = bytes(c ^ p for c, p in zip(ct, known))
print("key:", key)

pt = bytes(c ^ k for c, k in zip(ct, cycle(key)))
print(pt.decode())
```

## Flag
`CTF{example_flag}`

## Lessons learned
- Check for known plaintext before any brute force. A fixed flag format is free key material.
- A repeating key shorter than the message is never safe, however random it is.

## References
- [Cryptopals Set 1](https://cryptopals.com/sets/1)
