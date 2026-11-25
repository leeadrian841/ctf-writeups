# OverTheWire: Bandit Lvl 18 (Linux): Bandit (2026)

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
| Tags       | Linux, SSH, Bash, .bashrc |

## TL;DR
Bypassing a booby-trapped `.bashrc`: the file logs you out as soon as an interactive shell starts, but SSH can run a single command without one (`ssh ... 'cat readme'`) or start a shell that skips `.bashrc` entirely (`bash --noprofile --norc`).

## Challenge
> The password for the next level is stored in a file `readme` in the homedirectory. Unfortunately, someone has modified `.bashrc` to log you out when you log in with SSH.

- Files: `readme`
- Service: `bandit18@bandit.labs.overthewire.org:2220` (online)

## First look
Logging in normally with the password from Level 17 printed `Byebye!` and closed the connection straight away, as the Level 17 note warned. The login itself works: the password is accepted. What fails is the shell that starts afterwards.

### Theory
- **`.bashrc`:** a script in the home directory that Bash runs every time it starts an **interactive** shell, such as the one you get after an SSH login. It is meant for aliases and prompt settings, but it can run any command, including one that logs you out.
- **Interactive vs non-interactive:** an interactive shell waits for you to type commands. When you run `ssh user@host 'command'`, SSH runs just that command, prints its output and disconnects, with no interactive shell. The standard `.bashrc` starts with a check that stops it early in a non-interactive shell, so the logout line at the end is never reached.
- **`ssh -t`:** forces SSH to create a terminal, which is needed to use an interactive program such as a shell through a command.
- **`bash --noprofile --norc`:** starts Bash without reading `.profile` / `.bash_profile` (`--noprofile`) or `.bashrc` (`--norc`), so none of the login scripts run.

## Dead ends
- `ssh -i /path/to/key ... 'cat readme'`: SSH warned `Identity file /path/to/key not accessible` and fell back to asking for the password -> there is no key for this level. The command worked only because of the `'cat readme'` part, not the key.

```bash
❯ ssh -i /path/to/key -p 2220 bandit18@bandit.labs.overthewire.org 'cat readme'
Warning: Identity file /path/to/key not accessible: No such file or directory.

bandit18@bandit.labs.overthewire.org's password: {Password for bandit18}
{Password for bandit19}
```

## Solution
I solved this in two ways. Both run from my own machine and avoid the interactive shell that triggers the logout.

### Method 1: Run commands directly over SSH (recommended)
Adding a command in quotes after the SSH login makes SSH run only that command, so `.bashrc` never reaches its logout line. I first listed the home directory to confirm the file's name, then read it.

```bash
# Look around and read the file in one connection
❯ ssh bandit18@bandit.labs.overthewire.org -p 2220 'ls; cat readme'

bandit18@bandit.labs.overthewire.org's password: {Password for bandit18}
readme
{Password for bandit19}
```

Once I knew the file name, a single command was enough:

```bash
# Read the password file directly
❯ ssh bandit18@bandit.labs.overthewire.org -p 2220 'cat readme'

bandit18@bandit.labs.overthewire.org's password: {Password for bandit18}
{Password for bandit19}
```

### Method 2: Start a shell that skips `.bashrc`
Method 1 gives only one command per connection. For a shell I can keep typing in, I asked SSH to start Bash with `--noprofile --norc`, so none of the startup scripts run. `-t` gives it a terminal so it behaves interactively.

The prompt changed to a plain `bash-5.3$`. That confirms no startup script ran: the usual `bandit18@bandit:~$` prompt is set in `.bashrc`.

```bash
# Interactive shell without .bashrc or .profile
❯ ssh bandit18@bandit.labs.overthewire.org -p 2220 -t 'bash --noprofile --norc'

bandit18@bandit.labs.overthewire.org's password: {Password for bandit18}
bash-5.3$ ls
readme
bash-5.3$ cat readme
{Password for bandit19}
```

### Which method is better?
| | Method 1: Run a command | Method 2: Shell without `.bashrc` |
|---|---|---|
| Command | `ssh ... 'cat readme'` | `ssh -t ... 'bash --noprofile --norc'` |
| What you get | Output of one command, then disconnect | A normal shell to keep working in |
| Best for | Grabbing a single file quickly | Exploring when you need several commands |

Method 1 is the fastest way to solve this level. Method 2 is worth knowing for when a login script blocks you and you need to keep working.

## Flag
`Password for bandit19`

## Lessons learned
- A failed login is not always a wrong password: here the login worked and `.bashrc` logged me out afterwards.
- `ssh user@host 'command'` runs a command without an interactive shell, which skips anything that only runs at login.
- `bash --noprofile --norc` (with `ssh -t`) gives a clean shell when a startup script is broken or hostile.
- Startup files such as `.bashrc` and `.profile` run automatically, which makes them an attack target: anyone who can edit them controls what happens at every login.

## References
- [ssh](https://man.openbsd.org/ssh)
- [Bash Startup Files](https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files.html)
- [Interactive Shells](https://www.gnu.org/software/bash/manual/html_node/Interactive-Shells.html)
