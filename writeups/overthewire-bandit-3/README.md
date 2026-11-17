# OverTheWire: Bandit Lvl 3 (Linux): Bandit (2026)

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
The password for the next level is stored in a hidden file in the `inhere` directory.

## Challenge
> Find the password for the next level which is stored in a hidden file in the `inhere` directory.

- Files: `hidden file`
- Service: `bandit3@bandit.labs.overthewire.org:2220` (online)

## First look
I checked what are inside the `inhere` directory first and found nothing inside the directory. But hidden files wil not appear under the `ls` command. I have to use options for the `ls` command to look for hidden files in the `inhere` directory.

```bash
ssh bandit3@bandit.labs.overthewire.org -p 2220
Password: {Password for bandit3}

bandit3@bandit:~$ ls
inhere
bandit3@bandit:~$ cd inhere
bandit3@bandit:~/inhere$ ls
```

## Dead ends
- Tried to `ls` in the `inhere` directory normally: Didn't work -> The file that I am looking is a hidden file, not a normal file.

## Solution
### Use `ls` command with options
To look for hidden files, we need to use the `ls` command with options. There are 2 options that we can use to find hidden files. These are `-a` and `-A`.

`-a` shows all files, including hidden files that start with a dot (`.` and `..`).

`-A` lists hidden files, but excludes the current (`.`) and parent (`..`) directory entries.

```bash
# Using ls with options
bandit3@bandit:~/inhere$ ls -a
.  ..  ...Hiding-From-You
bandit3@bandit:~/inhere$ ls -la
total 12
drwxr-xr-x 2 root    root    4096 Oct 25 13:37 .
drwxr-xr-x 3 root    root    4096 Oct 25 13:37 ..
-rw-r----- 1 bandit4 bandit3   33 Oct 25 13:37 ...Hiding-From-You
bandit3@bandit:~/inhere$ ls -A
...Hiding-From-You
bandit3@bandit:~/inhere$ ls -lA
total 4
-rw-r----- 1 bandit4 bandit3 33 Oct 25 13:37 ...Hiding-From-You
bandit3@bandit:~/inhere$ cat ./...Hiding-From-You
{Password for bandit4}
```

![{Describe what the screenshot shows}](img/{file}.png)

## Flag
`Password for bandit4`

## Lessons learned
- Understand how to use Linux commands with options.

## References
- [Options](https://tldp.org/LDP/abs/html/options.html)