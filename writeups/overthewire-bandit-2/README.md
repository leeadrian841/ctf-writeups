# OverTheWire: Bandit Lvl 2 (Linux): Bandit (2026)

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
Filename with spaces and leading dashes: the shell splits unquoted spaces into separate arguments. Quoting the whole path (`cat "./--spaces in this filename--"`) passes it as one filename.

## Challenge
> The password for the next level is stored in a file called `--spaces in this filename--` located in the home directory.

- Files: `--spaces in this filename--`
- Service: `bandit2@bandit.labs.overthewire.org:2220` (online)

## First look
{What you checked first and why. Paste key output as text, trimmed.}

```bash
ssh bandit2@bandit.labs.overthewire.org -p 2220
Password: {Password for bandit2}

bandit2@bandit:~$ ls
--spaces in this filename--
bandit2@bandit:~$ bandit2@bandit:~$ cat ./--spaces in this filename--
bandit2@bandit:~$: command not found
```

## Dead ends
- Tried to `cat` the `./--spaces in this filename--` file normally: Didn't work -> The filename contains spaces. This is similar to the previous level but involves spaces.

## Solution
### The Quote Method
If a file contains spaces, running commands like this cause the Linux shell to throw errors like `command not found`. The Linux shell uses spaces to separate command arguments, unquoted spaces make the terminal treat each word as a separate file.

You can use either single or double quotes to handle such files with spaces.
__Double Quotes:__ Wrap the entire filename or path in double quotes so the shell reads it as a single item while still expanding variables like `$HOME`. Example: `cat "my file.txt"`
__Single Quotes:__ Wrap the filename in single quotes to preserve every character literally without expanding variables. Example: `rm 'my file.txt'`

```bash
# Single Quote Method
bandit2@bandit:~$ cat './--spaces in this filename--'
{Password for bandit3}

# Double Quote Method
bandit2@bandit:~$ cat "./--spaces in this filename--"
{Password for bandit3}
```

![{Describe what the screenshot shows}](img/{file}.png)

## Flag
`Password for bandit3`

## Lessons learned
- Understand how the Linux shell handles commands involving spaces, operators & symbols.

## References
- [Google Search - Spaces in Filename](https://www.google.com/search?q=spaces+in+filename)