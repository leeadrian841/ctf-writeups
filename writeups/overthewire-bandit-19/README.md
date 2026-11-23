# OverTheWire: Bandit Lvl 19 (Linux): Bandit (2026)

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
| Tags       | Linux |

## TL;DR
Privilege escalation through a setuid binary: `bandit20-do` runs any command as its owner, bandit20, so `./bandit20-do cat /etc/bandit_pass/bandit20` reads a password the current user cannot.

## Challenge
> To gain access to the next level, you should use the setuid binary in the home directory. Execute it without arguments to find out how to use it. The password for this level can be found in the usual place (/etc/bandit_pass), after you have used the setuid binary.

- Files: `bandit20-do` (setuid)
- Service: `bandit19@bandit.labs.overthewire.org:2220` (online)

## First look
{What you checked first and why. Paste key output as text, trimmed.}

```bash
ssh bandit19@bandit.labs.overthewire.org -p 2220
{Password for bandit19}

bandit19@bandit:~$ ls
bandit20-do
bandit19@bandit:~$ file bandit20-do
bandit20-do: setuid ELF 32-bit LSB executable, Intel i386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, BuildID[sha1]=263f71465a75a599f568ae40f1caca2a9e937892, for GNU/Linux 3.2.0, not stripped
```

## Dead ends
- Reading `bandit20-do` directly with `cat`: It failed with `Permission denied` -> Only `bandit20` has read permissions on that file
- Running `bandit20-do` without `./` or arguments: Typing `bandit20-do` alone fails with `command not found` -> The current directory is not in my `PATH`

## Solution
### Step 1: Find out what `bandit20-do` can do as a setuid binary
I tried to execute the `bandit20-do` to understand what it does and also who owned that. After running the file and checking the privilege, I found out that `bandit20-do` is owned by `bandit20` and executes the commands that are passed to it.

```bash
# See what bandit20-do can do as a setuid binary
bandit19@bandit:~$ ./bandit20-do
Run a command as another user.
  Example: ./bandit20-do whoami
bandit19@bandit:~$ ./bandit20-do whoami
bandit20
```

### Step 2: {what this step achieves}
Knowing that bandit20-do had local privilege to access `bandit20` directly, I can use it to access the directory where the password is being stored at `/etc/bandit_pass/bandit20`.

```bash
# Use bandit20-do to find out the password
bandit19@bandit:~$ ./bandit20-do cat /etc/bandit_pass/bandit20
{Password for bandit20}
```

### Approach when handling setuid binary
1. `ls -l` to confirm the `s` bit and see the owner. The owner is whose privileges you gain.
2. Run it with no args and read the usage. What does it let you do?
3. `strings binary` to see what it calls internally: other commands, file paths, helper names.
4. Ask the exploit question: can I influence what it runs, reads, or writes? A command argument, a `$PATH` lookup, a filename it opens, an input it parses.
5. If it does something useful directly, like here, just use it.

## Flag
`Password for bandit20`

## Lessons learned
- Understand the 1st of local privilege-escalation enumeration.
- Understand how setuid binaries can be exploited.

## References
- [setuid](https://en.wikipedia.org/wiki/Setuid)