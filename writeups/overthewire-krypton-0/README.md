# OverTheWire: Krypton Lvl 0 (Cryptography): Cryptography (2026)

| Field      | Value |
|------------|-------|
| Platform   | OverTheWire |
| Event      | Bandit |
| Date       | 2026 |
| Category   | Cryptography |
| Difficulty | Easy |
| Points     | N/A |
| Solves     | 0 |
| Author     | OverTheWire |
| Solved by  | leeadrian841 |
| Status     | Solved |
| Tags       | Cryptography |

## TL;DR
Base64 is encoding, not encryption: the `=` padding and limited alphabet identify the string, and decoding it (`base64 -d` on Linux or `[Convert]::FromBase64String` in PowerShell) gives the password directly.

## Challenge
> Welcome to Krypton! The first level is easy. The following string encodes the password using Base64:
> S1JZUFRPTklTR1JFQVQ=
> Use this password to log in to krypton.labs.overthewire.org with username krypton1 using SSH on port 2231. You can find the files for other levels in /krypton/

- String: `S1JZUFRPTklTR1JFQVQ=` (Encoded Base64)
- Service: `krypton1@krypton.labs.overthewire.org:2231` (online)

## First look
{What you checked first and why. Paste key output as text, trimmed.}

```
ssh krypton1@krypton.labs.overthewire.org -p 2231
Password: {Password for krypton1}

```

## Dead ends
- Tried to `cat` the `-` file normally: Didn't work -> The file is named using syntax such as operators & symbols.

## Solution
### Linux


### PowerShell (Windows)
You can also decode Base64 strings in PowerShell. Usually, UTF8 text encoding is used.

```Powershell
# How to decode Base64 string in Windows PowerShell
$EncodedText = "S1JZUFRPTklTR1JFQVQ="
[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($EncodedText))
```

__What if it is NOT Base64 encoded?__

You may come across strings that are not Base64 encoded. This error will appear when you decode any non-Base64 string.
If the string contains characters outside the standard Base64 alphabet (`A-Z`, `a-z`, `0-9`, `+`, `/`, `=`) or has an invalid length, `[System.Convert]::FromBase64String()` will immediately throw a terminating .NET exception.

```Error
Exception calling "FromBase64String" with "1" argument(s): "The input is not a valid Base-64 string as it contains a non-base 64 character, more than two padding characters, or an illegal character among the padding characters."
```

__What if it is Base64 encoded but uses the wrong text encoding?__

PowerShell will not throw an error if you use `[System.Text.Encoding]::UTF8.GetString()` on bytes that were actually encoded in UTF-16, ASCII, or Latin-1. Instead, it silently outputs garbled text (known as mojibake).

![{Describe what the screenshot shows}](img/{file}.png)

## Flag
`Password for krypton1`

## Lessons learned
- Checking the naming convention of files in Linux first.
- Understanding how to read files named using operators & symbols.
- Knowing how operators & symbols can affect the commands running in the terminal.

## References
- {Docs, papers, other writeups that helped, with links}
- Thanks to {author} for the challenge and {teammates} for {help}.
