# OverTheWire: Bandit Lvl 1 (Linux): Bandit (2026)

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
Dash-named file: `cat -` treats `-` as standard input, so the command just waits for typing. Prefixing the name with `./` makes the shell pass it as a file path instead of an option.

## Challenge
> The password for the next level is stored in a file called `-` located in the home directory.

- Files: `-`
- Service: `bandit1@bandit.labs.overthewire.org:2220` (online)

## First look
I checked the list of files into the current directory using the command `ls`. This is to find what are the files in the current directory and this is excluding hidden files.
I read the `-` file normally like how I usually read any file just like this: `cat myfile.txt`.
But it just got stuck there with no response.

```
ssh bandit1@bandit.labs.overthewire.org -p 2220
Password: {Password for bandit1}

bandit1@bandit:~$ ls
-
bandit1@bandit:~$ cat -

```

## Dead ends
- Tried to `cat` the `-` file normally: Didn't work -> The file is named using syntax such as operators & symbols.

## Solution
### Reading files named using operators using the path prefix `./` method
If a file starts with a hyphen (for example, `-rf` or `-help`), running a command like `rm -rf` or `cat -help` causes the terminal to read the filename as a command option or flag rather than a target file.
So you have to prepend `./` (the current directory indicator) to the filename such as `cat ./-` to read the `-` file.

```bash
# Correct Method to read files named with operators & symbols
bandit1@bandit:~$ cat ./-
{Password for bandit2}

# Can be used with other commands too
touch ./-myfile
cat ./-myfile
mv ./-myfile ./newfile
rm ./-myfile
```

![{Describe what the screenshot shows}](img/{file}.png)

## Flag
`Password for bandit2`

## Lessons learned
- Check the naming convention of files in Linux first.
- Understand how to read files named using operators & symbols.
- Know how operators & symbols can affect the commands running in the terminal.

## References
- [Google Search - Dashed Filename](https://www.google.com/search?q=dashed+filename)
- [Advanced Bash-Scripting Guide: Special Characters](https://linux.die.net/abs-guide/special-chars.html)