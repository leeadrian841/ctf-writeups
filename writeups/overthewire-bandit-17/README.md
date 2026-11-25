# OverTheWire: Bandit Lvl 17 (Linux): Bandit (2026)

| Field      | Value |
|------------|-------|
| Platform   | OverTheWire |
| Event      | Bandit |
| Date       | 2026 |
| Category   | Linux |
| Difficulty | Medium |
| Points     | N/A |
| Solves     | 0 |
| Author     | OverTheWire |
| Solved by  | leeadrian841 |
| Status     | Solved |
| Tags       | Linux, diff, File Comparison |

## TL;DR
Comparing two files line by line: `diff` shows only the lines that changed between `passwords.old` and `passwords.new`, so the one line marked `+` (new) is the password for bandit18.

## Challenge
> There are 2 files in the home directory: `passwords.old` and `passwords.new`. The password for the next level is in `passwords.new` and is the only line that has been changed between `passwords.old` and `passwords.new`.

> NOTE: if you have solved this level and see ‘Byebye!’ when trying to log into `bandit18`, this is related to the next level, `bandit19`.

- Files: `passwords.old`, `passwords.new`
- Service: `bandit17@bandit.labs.overthewire.org:2220` (online)

## First look
The home directory holds two files that are almost identical: each is a long list of random 32-character strings, one per line. Only one line differs between them. Reading both by eye would take far too long, so I needed a tool that compares the files and prints only the differences.

```bash
ssh bandit17@bandit.labs.overthewire.org -p 2220
Password: {Password for bandit17}
```

### Theory
- **`diff <old> <new>`:** compares two files line by line and prints only what changed. Lines that are the same in both files are skipped.
- **`-u` (unified format):** the format used by Git and code reviews. It shows a few unchanged lines around each change for context, and marks each line:
  - `-` the line as it was in the old file (removed)
  - `+` the line as it is in the new file (added)
  - a space: unchanged context
- **`@@ -39,7 +39,7 @@`:** the hunk header. The change is in a block of 7 lines starting at line 39 in both files.

## Dead ends
- None

## Solution
### Step 1: Compare the two files with `diff -u`
I ran `diff -u` with the old file first and the new file second, so that `-` marks the old version of the changed line and `+` marks the new one. The output showed a single change at line 42: the old string was replaced by a new one. Since the password is in `passwords.new`, the `+` line is the password for `bandit18`.

```bash
bandit17@bandit:~$ diff -u passwords.old passwords.new
--- passwords.old       2026-10-25 13:37:12.088525916 +0000
+++ passwords.new       2026-10-25 13:37:12.097525941 +0000
@@ -39,7 +39,7 @@
 0SF2jblxIFg9CTxxkWQhmafDUKDw74eq
 sqrXekGmOSo5Roa8WLpQokDs31vZHdWN
 JrLhnujv94fl0EZlo1JoU15bKGxkJSxK
-1WJHmb0k7TH4piWp9Pd0lsruErLQZrR9
+{Password for bandit18}
 cawBRcR4rHI25OUCQxg7iGfKoFYg0KAL
 wHSvhbtj5noeLnLj5zn3ZEskwGvuKV4Y
 3jrBCc4hGemWQWFJdxiV3ld02gSZhCGT
```

### Step 2: Log in to the next level
I used the `+` line as the password for `bandit18`. As the challenge note warns, `bandit18` prints `Byebye!` and logs out straight away. That is the puzzle for the next level, not a wrong password.

```bash
ssh bandit18@bandit.labs.overthewire.org -p 2220
Password: {Password for bandit18}
```

### Winning Command
Without `-u`, `diff` marks lines from the second file with `>`. Filtering for that marker prints only the new line, with no context to read through.

```bash
# Print only the line that is new in passwords.new
bandit17@bandit:~$ diff passwords.old passwords.new | grep '^>'
> {Password for bandit18}
```

## Flag
`Password for bandit18`

## Lessons learned
- Use `diff` to compare files instead of reading them: it prints only what changed, however long the files are.
- Put the old file first and the new file second, so `-` / `<` is the old version and `+` / `>` is the new one.
- Unified diff (`-u`) is the same format Git uses, so reading it here also helps with reading code changes and patches.
- Being logged out straight away is not always a wrong password: check the level's notes before assuming the password is wrong.

## References
- [diff](https://man7.org/linux/man-pages/man1/diff.1.html)
- [Diff (Wikipedia)](https://en.wikipedia.org/wiki/Diff)
- [Comparing and merging files: unified format](https://www.gnu.org/software/diffutils/manual/html_node/Unified-Format.html)
