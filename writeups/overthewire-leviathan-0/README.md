# OverTheWire: Leviathan Lvl 0 (Reverse Engineering): Reverse Engineering (2026)

| Field      | Value |
|------------|-------|
| Platform   | OverTheWire |
| Event      | Leviathan |
| Date       | 2026 |
| Category   | Reverse Engineering |
| Difficulty | Easy |
| Points     | N/A |
| Solves     | 0 |
| Author     | OverTheWire |
| Solved by  | leeadrian841 |
| Status     | Solved |
| Tags       | Reverse Engineering, Linux, Hidden Files, grep |

## TL;DR
Credentials left in a forgotten backup: a hidden `.backup` directory holds a 133 KB browser bookmarks file, and `grep password` on it finds a bookmark whose title contains the password for leviathan1.

## Challenge
> Leviathan has no per-level task. The game page only says that data for each level can be found in the home directories, and the first login is `leviathan0` / `leviathan0`.

- Files: `~/.backup/bookmarks.html` (hidden directory)
- Service: `leviathan0@leviathan.labs.overthewire.org:2223` (online)

## First look
There was no task for this level, so I started by looking around the home directory. A plain `ls` showed nothing, so I used `ls -la` to include hidden entries and show their owners and permissions.

The only unusual entry was `.backup`. Its permissions (`drwxr-x---`, owner `leviathan1`, group `leviathan0`) mean that I, as a member of the `leviathan0` group, can enter and read it, even though it belongs to the next level's user. Inside was a single file, `bookmarks.html`, which `file` identified as an HTML document of about 133 KB.

```bash
ssh leviathan0@leviathan.labs.overthewire.org -p 2223
Password: {Password for leviathan0}

leviathan0@leviathan:~$ ls -la
total 24
drwxr-xr-x   3 root       root       4096 Oct 25 13:39 .
drwxr-xr-x 150 root       root       4096 Oct 25 13:40 ..
drwxr-x---   2 leviathan1 leviathan0 4096 Oct 25 13:39 .backup
-rw-r--r--   1 root       root        220 Feb 13  2026 .bash_logout
-rw-r--r--   1 root       root       3851 Oct 25 13:21 .bashrc
-rw-r--r--   1 root       root        807 Feb 13  2026 .profile
leviathan0@leviathan:~$ file .backup
.backup: directory
leviathan0@leviathan:~$ cd .backup
leviathan0@leviathan:~/.backup$ ls -la
total 140
drwxr-x--- 2 leviathan1 leviathan0   4096 Oct 25 13:39 .
drwxr-xr-x 3 root       root         4096 Oct 25 13:39 ..
-rw-r----- 1 leviathan1 leviathan0 133259 Oct 25 13:39 bookmarks.html
leviathan0@leviathan:~/.backup$ file bookmarks.html
bookmarks.html: HTML document, ASCII text, with very long lines (302)
```

## Dead ends
- `cat bookmarks.html`: printed over 133 KB of HTML -> far too much to read by eye, so I needed to search the file instead.

## Solution
### Step 1: Find the hidden backup
Backup folders are a classic place for sensitive data to be left behind. `ls -la` revealed `.backup`, and its group permissions let `leviathan0` read it.

### Step 2: Search the bookmarks for a password
A bookmarks file is a list of saved links with titles, and people often save notes in those titles. Instead of reading the whole file, I searched it for the word `password`. One bookmark's link text contained the password for `leviathan1`.

```bash
# Search the bookmarks file for the word "password"
leviathan0@leviathan:~/.backup$ strings bookmarks.html | grep password
<DT><A HREF="http://leviathan.labs.overthewire.org/passwordus.html | This will be fixed later, the password for leviathan1 is {Password for leviathan1}" ADD_DATE="1155384634" LAST_CHARSET="ISO-8859-1" ID="rdf:#$2wIU71">password to leviathan1</A>
```

### Winning Command
`file` already showed that `bookmarks.html` is plain ASCII text, so `strings` is not needed: `grep` can search it directly. `-i` also catches `Password` or `PASSWORD`.

```bash
# Search the file directly, ignoring case
leviathan0@leviathan:~$ grep -i password ~/.backup/bookmarks.html
```

## Flag
`Password for leviathan1`

## Lessons learned
- Always list hidden files with `ls -la` first: names starting with a dot are where backups and configs hide.
- Read the permission and ownership columns: a directory owned by another user can still be readable through its group.
- Search large text files with `grep` for keywords like `password`, `pass` or `key` instead of reading them line by line.
- Credentials in backups, bookmarks or notes are a real-world finding too: "fix it later" secrets tend to stay.

## References
- [Leviathan](https://overthewire.org/wargames/leviathan/)
- [ls](https://man7.org/linux/man-pages/man1/ls.1.html)
- [grep](https://man7.org/linux/man-pages/man1/grep.1.html)
- [File permissions in Linux](https://www.redhat.com/en/blog/linux-file-permissions-explained)
- [CWE-312: Cleartext Storage of Sensitive Information](https://cwe.mitre.org/data/definitions/312.html)
