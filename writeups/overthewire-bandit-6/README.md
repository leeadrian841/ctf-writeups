# OverTheWire: Bandit Lvl 6 (Linux): Bandit (2026)

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
Server-wide search by ownership: `find / -user bandit7 -group bandit6 -size 33c` locates the file anywhere on the system, and `2>/dev/null` hides the flood of "Permission denied" errors.

## Challenge
> The password for the next level is stored somewhere on the server and has all of the following properties:
> - Owned by user bandit7
> - Owned by group bandit6
> - 33 bytes in size

- Files: `file with all the properties` in the server
- Service: `bandit6@bandit.labs.overthewire.org:2220` (online)

## First look
When I started on this exercise, I found out that this is similiar to the previous level but in a bigger scale which is the whole server rather than a single directory. When I ran `ls` for the 1st time, it came out empty but there cannot be no files on a server.

So I had to check it out from the root `/` directory instead. There are really a lot of folders in the root directory and I cannot `ls` every folder again to search for the specific file. I had to use the `find` command like how I tackled the previous level.

```bash
ssh bandit6@bandit.labs.overthewire.org -p 2220
{Password for bandit6}

bandit6@bandit:~$ ls
bandit6@bandit:~$ ls -a
.  ..  .bash_logout  .bashrc  .profile
bandit6@bandit:~$ ls -A
.bash_logout  .bashrc  .profile
bandit6@bandit:~$ cd /
bandit6@bandit:/$ ls
behemoth  dev      formulaone  lib    libx32      maze   narnia  root  snap  tmp     var
bin       drifter  home        lib32  lost+found  media  opt     run   srv   usr     vortex
boot      etc      krypton     lib64  manpage     mnt    proc    sbin  sys   utumno
```

## Dead ends
- No dead ends since this is similiar to the previous one, Bandit Level 5

## Solution
### Use `find` again to find any file with specific properties
I can use the `find` command again for this exercise but I will change the options in order to search for the given parameters. So I have to search the entire root `/` directory for that file that matches the given parameters.

### 💡 How It Works
- `find /`: Starts searching from the root directory (`/`) to look everywhere on the server.
- `-user bandit7`: Filters the search for files owned by the user **bandit7**.
- `-group bandit6`: Filters for files belonging to the group **bandit6**.
- `-size 33c`: Searches for a file exactly **33 bytes** in size (the `c` stands for bytes/characters).
- `2>/dev/null`: Hides all the "Permission denied" error messages so your terminal stays clean and you only see the actual file path you are looking for.

```bash
bandit6@bandit:~$ find / -user bandit7 -group bandit6 -size 33c 2>/dev/null
/var/lib/dpkg/info/bandit7.password
bandit6@bandit:~$ cd /var/lib/dpkg/info
bandit6@bandit:/var/lib/dpkg/info$ file bandit7.password
bandit7.password: ASCII text
bandit6@bandit:/var/lib/dpkg/info$ head bandit7.password
{Password for bandit7}
bandit6@bandit:/var/lib/dpkg/info$ cat bandit7.password
{Password for bandit7}
```

### Winning Command
I was thinking of whether there is a better way to find the file and output the contents in just one command. There is a way to get the file and read the contents in just 1 command using `cat $({find the file})`.

Either `head` or `cat` works here but you never know what are the contents inside that unknown file so it is best to use `head` as a precaution.

```bash
bandit6@bandit:/$ head $(find / -user bandit7 -group bandit6 -size 33c 2>/dev/null)
{Password for bandit7}
bandit6@bandit:/$ cat $(find / -user bandit7 -group bandit6 -size 33c 2>/dev/null)
{Password for bandit7}
```

![{Describe what the screenshot shows}](img/{file}.png)

## Flag
`Password for bandit7`

## Lessons learned
- Understand how to use `find` command to find files with specific properties.

## References
- [10 ways to use the Linux find command](https://www.redhat.com/en/blog/linux-find-command)
- [find](https://man7.org/linux/man-pages/man1/find.1.html)