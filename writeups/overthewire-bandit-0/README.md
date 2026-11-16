# OverTheWire - Bandit 0 (Linux): Bandit Level 0 (2026)

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
The password for the next level is stored in a file called readme located in the home directory. Use this password to log into bandit1 using SSH. Whenever you find a password for a level, use SSH (on port 2220) to log into that level and continue the game.

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
bandit0@bandit:~$ cat readme
{Password for Level 1}
```

## Dead ends
- {Idea}: {what happened} -> {why it didn't work}
- {Idea}: {what happened} -> {why it didn't work}

## Solution
### Step 1: {what this step achieves}
{Why you took this step, what you expected, what you saw.}

### Step 2: {what this step achieves}
{Reasoning first, then the minimum command or code.}

```{language}
# solve script: minimal, commented, no hardcoded secrets
{code}
```

![{Describe what the screenshot shows}](img/{file}.png)

## Flag
`Password for Level 1`

## Lessons learned
- {What you'd check first next time}
- {Tool or technique you learned}
- {What made the challenge click}

## References
- {Docs, papers, other writeups that helped, with links}
- Thanks to {author} for the challenge and {teammates} for {help}.
