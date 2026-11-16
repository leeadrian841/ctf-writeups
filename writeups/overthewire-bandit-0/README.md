# OverTheWire: Bandit Lvl 0 (Linux): Bandit (2026)

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
The password for the next level is stored in a file called `readme` located in the home directory. Use this password to log into bandit1 using SSH. Whenever you find a password for a level, use SSH (on port 2220) to log into that level and continue the game.

## Challenge
> Find the password stored in a file called `readme` located in the home directory

- Files: `readme`
- Service: `bandit0@bandit.labs.overthewire.org:2220` (online)

## First look
I checked the list of files into the current directory using the command `ls`. This is to find what are the files in the current directory and this is excluding hidden files.
If we are looking for everything including hidden files, then we will need to use the same command but with `-a`.

```
ssh bandit0@bandit.labs.overthewire.org -p 2220
Password: {Password for Level 0}

bandit0@bandit:~$ ls
readme
bandit0@bandit:~$ file readme
readme: ASCII text
bandit0@bandit:~$ cat readme
{Password for Level 1}
```

## Dead ends
- None expected

## Solution
### Step 1: List the files or content in any directory
We have to check what are the files inside the current directory.

```bash
# List the files or content in any directory
bandit0@bandit:~$ ls
readme
```

### Step 2: Check the file's data type before running it
We should check any file's data type first even before running it. A file can contain anything inside, and it can be any malicious code too. Even threat actors can hack the system and gain access to any files and amend them. It is of best practices to check the contents of any file before running it.

```bash
# Check the file's actual data type before running it
bandit0@bandit:~$ file readme
readme: ASCII text
```

## Flag
`Password for Level 1`

## Lessons learned
- Checking unknown files before running them. You never know what these unknown files can contain.
- Never assume that every file is safe to execute or run.

## References
- None