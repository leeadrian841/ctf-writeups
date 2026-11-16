# OverTheWire - Bandit Lvl 1 (Linux): Bandit (2026)

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
The password for the next level is stored in a file called `-` located in the home directory.

## Challenge
> Find the password for the next level is stored in a file called `-` located in the home directory

- Files: `-`
- Service: `bandit1@bandit.labs.overthewire.org:2220` (online)

## First look
{What you checked first and why. Paste key output as text, trimmed.}

```
ssh bandit1@bandit.labs.overthewire.org -p 2220
Password: {Password for bandit1}

bandit1@bandit:~$ ls
-
bandit1@bandit:~$ cat -

bandit1@bandit:~$ cat ./-
{Password for bandit2}
```

## Dead ends
- Tried to `cat` the `-` file normally: Didn't work -> The file is named using syntax such as operators & symbols.

## Solution
### Reading files named using operators using the path prefix `./` method
If a file starts with a hyphen (for example, `-rf` or `-help`), running a command like `rm -rf` or `cat -help` causes the terminal to read the filename as a command option or flag rather than a target file.
So you have to prepend `./` (the current directory indicator) to the filename such as `cat ./-` to read the `-` file.

```{language}
# solve script: minimal, commented, no hardcoded secrets
{code}
```

![{Describe what the screenshot shows}](img/{file}.png)

## Flag
`Password for bandit2`

## Lessons learned
- Checking the naming convention of files in Linux first.
- Understanding how to read files named using operators & symbols.
- Knowing how operators & symbols can affect the commands running in the terminal.

## References
- {Docs, papers, other writeups that helped, with links}
- Thanks to {author} for the challenge and {teammates} for {help}.
