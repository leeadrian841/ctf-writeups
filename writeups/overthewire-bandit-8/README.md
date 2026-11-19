# OverTheWire: Bandit Lvl 8 (Linux): Bandit (2026)

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
Finding the line that occurs only once: `uniq -u` only compares neighbouring lines, so the file must be sorted first (`sort data.txt | uniq -u`).

## Challenge
> The password for the next level is stored in the file `data.txt` and is the only line of text that occurs only once.

- Files: `data.txt`
- Service: `bandit8@bandit.labs.overthewire.org:2220` (online)

## First look
I checked the contents of the `data.txt` first and noticed that the lines may be longer than expected as seen using the `head` command.
The contents in the `data.txt` file can be messy and my main objective is to find an unique line of text that occurs only once.

```bash
ssh bandit8@bandit.labs.overthewire.org -p 2220
Password: {Password for bandit8}

bandit8@bandit:~$ ls
data.txt
bandit8@bandit:~$ file data.txt
data.txt: ASCII text
bandit8@bandit:~$ head data.txt
sGnoRpQPqcVpFphSKl8QK7PAAWRl75xc
12D8OH8V9CnJ6QL2GPlin7ssgRoZlbC2
zLcTGHXgASIc1Rq7Pp8KayszoFY5svHT
wAnwVnMnDTDUJkgXyZVAEvsyexjRiFEL
pO3o7gyGjJH3L7qxkjTXmaKrQrtwIEMO
YYRM8FxoVgFjh3b2uGNhD82sXeGFmM4a
pP0GhsUf5JJ7awCwAt3vchjuSKK505xj
NvKniZJxttTLrNiXfHuX8UIAeADypkT2
oGkk7DTDRb2PhBxyX1bAV7umcMhJP4Qv
XuLEF98boNFcawz35FwFnP7kAENhvPLx
```

## Dead ends
- Run `sort` to sort the content first and then run `uniq -u` to find the unique line: Didn't work after sorting the content first and then running `uniq -u` -> After running `sort`, the sorted content is not saved to the file. For `uniq` to work, it will require the sorted content instead.

## Solution
### Use both `sort` and `uniq` to find the unique line that appears once
For this to work perfectly, run both commands at the same time. You can combine multiple commands using `|`. __Example:__ `sort myfile.txt | uniq -u`

#### Theory
`uniq` is a command that filters input and writes to the output. Specifically, it filters based on identical lines. It has a flag `-u`, which filters for unique lines (lines that appear only ones). Another interesting functionality is, for example, that it can also count (`-c`) or only return duplicate lines (`-d`).

The command is often used with `sort`. For `uniq` to filter for unique lines, the lines need to be sorted. `sort` sorts the lines of a text file. Furthermore, it has flags for sorting in reverse (`-r`) and sorting numerically (`-n`).

```bash
# Using `sort` and `uniq` to find the unique line
bandit8@bandit:~$ sort data.txt | uniq -u
{Password for bandit9}
```

![{Describe what the screenshot shows}](img/{file}.png)

## Flag
`Password for bandit9`

## Lessons learned
- Understand how to use `sort` and `uniq` to identify unique text or lines in files.
- Chaining multiple commands using `|`.

## References
- [Piping & Redirection](https://ryanstutorials.net/linuxtutorial/piping.php)