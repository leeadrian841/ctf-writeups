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
Searching a large file for a keyword: `data.txt` has nearly 100,000 lines, so `grep millionth data.txt` pulls out the one line that holds the password instead of scrolling through `cat`.

## Challenge
> The password for the next level is stored in the file `data.txt` next to the word `millionth`.

- Files: `data.txt`
- Service: `bandit7@bandit.labs.overthewire.org:2220` (online)

## First look
As usual, I checked for the actual type of the file first by running the `file` command. The file contains Unicode text, UTF-8 text and this means that it is human-readable and contains modern text supporting international scripts and emojis.

I also ran `head` to have a rough understanding of the contents inside the `data.txt` file. I noticed that every line had a keyword and password. So I just needed to look for that keyword `millionth` in the file and then output the entire line to get the password.

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
- Thinking of `cat` the `data.txt` file: Kept outputting text for some time actually -> It only ended after quite some time and looking through the text is a nightmare

## Solution
### Step 1: Check the number of lines in `data.txt`
I decided to check the number of lines in `data.txt` using the `wc -l` command. At this conjuncture, we don't know how many lines of text are in the file but we knew that there are many lines inside. We will need to check the file to understand the entire context.

```bash
bandit7@bandit:~$ wc -l < data.txt
98567
```

There are so many lines inside the `data.txt` file and the number is kind of unexpected for me. I cannot be searching every line manually to find the word `millionth` and this will take a lot of time to do so.

### Step 2: Use `grep` to search for the word `millionth`
We just need to find the `millionth` word in the `data.txt` file since the password is just next to the `millionth` word. I used the `grep` command to search for the `millionth` word and output that entire line where the `millionth` word is at.

There are a few methods to do so. I can just output the entire line by looking for the `millionth` word.

The other method is using the `grep` command with **regular expressions**. This is optional here since the challenge mentioned that the password is stored after the `millionth` word. What if the challenge didn't mention it? So it can be stored either before or after the `millionth` word. This is where **regular expressions** come in for such a situation.

```bash
# Use grep to print the line
bandit7@bandit:~$ grep millionth data.txt
millionth       {Password for bandit8}

# Use grep with regular expressions to print the line
bandit7@bandit:/$ grep -E -o "millionth\s+\S+" data.txt
millionth       {Password for bandit8}

# Use grep to print only the password
bandit7@bandit:/$ grep millionth data.txt | awk '{print $2}'
{Password for bandit8}
```

## Flag
`Password for bandit8`

## Lessons learned
- Understand the contents inside files.
- Learn how to use `grep` command to look for specific keywords in files.
- Learn how to handle unknown files and also look for specific clues in files.

## 🛠️ Essential `grep` Flags
### `i` (Ignore Case)
- **What it does:** Makes your search case-insensitive (it won't care if letters are UPPERCASE or lowercase).
- **Example:** If you don't remember if the word was "Millionth", "MILLIONTH", or "millionth":
```bash
grep -i "millionth" data.txt
```
### `n` (Show Line Numbers)
- **What it does:** Displays the exact line number in the file where the match was found.
- **Example:** Great for finding exactly where a password or config setting sits inside a massive file:
```bash
grep -n "millionth" data.txt
```
### `v` (Invert Match / Negative Search)
- **What it does:** Shows every single line **except** the ones that match your keyword. This is incredibly useful in future levels for filtering out spam or noise.
- **Example:** To see everything in a file *except* the lines containing "error":
```bash
grep -v "error" logfile.txt
```
### `w` (Match Whole Words Only)
- **What it does:** Avoids accidental matches inside longer words. For example, searching for "cat" won't accidentally return "ca**cat**ua" or "s**cat**ter".
- **Example:**
```bash
grep -w "cat" animals.txt
```

## References
- [grep command in Unix/Linux](https://www.geeksforgeeks.org/linux-unix/grep-command-in-unixlinux/)
- [grep](https://man7.org/linux/man-pages/man1/grep.1.html)
- [Grep Command in Linux – Usage, Options, and Syntax Examples](https://www.freecodecamp.org/news/grep-command-in-linux-usage-options-and-syntax-examples/)