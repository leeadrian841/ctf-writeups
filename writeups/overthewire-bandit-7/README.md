# OverTheWire: Bandit Lvl 7 (Linux): Bandit (2026)

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
The password for the next level is stored in the file `data.txt` next to the word `millionth`.

## Challenge
> Find the password for the next level which is stored in the file `data.txt` next to the word `millionth`.

- Files: `data.txt`
- Service: `bandit7@bandit.labs.overthewire.org:2220` (online)

## First look
As usual, I checked for the actual type of the file first by running the `file` command. The file contains Unicode text, UTF-8 text and this means that it is human-readable and contains modern text supporting international scripts and emojis.

```bash
bandit7@bandit:~$ ls
data.txt
bandit7@bandit:~$ file data.txt
data.txt: Unicode text, UTF-8 text
bandit7@bandit:~$ head data.txt
canvasing       JC4IdewxEgusyiN9Rmp8aHA07Iz6shpX
dumbly  BXX9C4e4gkRO0812T3z6ofU70UG0Alp2
strainers       Uf0gjRsjfG0tknaccHwzpNotmWIDaRrV
witchery        yc4xZP2mmPFL95xLelPKbwHfN98pEpU6
deepening       cXLLjlPtWm7KujVduNMUduJrDPDxUiix
persuading      yJSqjx4Vt1M3attfIEgLKl1rkd56TrQv
mounds  TpXmZ4TSejuBEkvQ1yGpaiqsvYxcLK6p
pioneer's       w4t8SVUEW0A4heZuhU4aJCcxN5zN3fMx
recants JkjtSxR3dyhi8HVj9pYvIcYlfSSeW5Ft
geniality's     A63nLiOBNnXlrxWufjHXxlGskWbz8eCl
```

## Dead ends
- {Idea}: {what happened} -> {why it didn't work}
- {Idea}: {what happened} -> {why it didn't work}

## Solution
### Step 1: {what this step achieves}
{Why you took this step, what you expected, what you saw.}

### Step 2: {what this step achieves}
{Reasoning first, then the minimum command or code.}

```bash
# solve script: minimal, commented, no hardcoded secrets
bandit7@bandit:/$ grep -E -o "millionth\s+\S+" data.txt
millionth     {Password for bandit8}
```

![{Describe what the screenshot shows}](img/{file}.png)

## Flag
`Password for bandit8`

## Lessons learned
- {What you'd check first next time}
- {Tool or technique you learned}
- {What made the challenge click}

## References
- {Docs, papers, other writeups that helped, with links}
- Thanks to {author} for the challenge and {teammates} for {help}.