# OverTheWire: Bandit Lvl 13 (Linux): Bandit (2026)

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
| Tags       | Linux, SSH, Private Key, scp |

## TL;DR
Key-based SSH authentication: the home directory holds bandit14's private SSH key, so copying it to my own machine with `scp`, locking its permissions down and logging in with `ssh -i` gives a shell as bandit14 without ever knowing its password.

## Challenge
> The password for the next level is stored in `/etc/bandit_pass/bandit14` and can only be read by user `bandit14`. For this level, you don’t get the next password, but you get a private SSH key that can be used to log into the next level. Look at the commands that logged you into previous bandit levels, and find out how to use the key for this level.

- Files: `sshkey.private` (OpenSSH private key), `HINT`
- Service: `bandit13@bandit.labs.overthewire.org:2220` (online)

## First look
I listed the home directory and checked each file's type before opening anything. `sshkey.private` is an OpenSSH private key, which is the secret half of a key pair. Whoever holds it can log in as the user whose public key is trusted on the server, here `bandit14`.

```bash
ssh bandit13@bandit.labs.overthewire.org -p 2220
Password: {Password for bandit13}

bandit13@bandit:~$ ls
HINT  sshkey.private
bandit13@bandit:~$ file sshkey.private
sshkey.private: OpenSSH private key
bandit13@bandit:~$ file HINT
HINT: ASCII text
```

### Theory
- **SSH key pair:** a private key (kept secret by the user) and a public key (placed in `~/.ssh/authorized_keys` on the server). The server lets in anyone who can prove they hold the matching private key, so no password is needed.
- **`ssh -i <key>`:** tells SSH which private key file to use for the login.
- **`scp`:** "secure copy" copies files over SSH. `-P` (capital P) sets the port, unlike `ssh`, which uses lowercase `-p`.
- **Key permissions:** SSH refuses a private key that other users can read and stops with `UNPROTECTED PRIVATE KEY FILE!`. On Linux, `chmod 600` makes the key readable by its owner only. On Windows, `icacls` does the same job.

## Dead ends
- `ssh -i sshkey.private bandit14@localhost -p 2220` from inside bandit13: the connection is refused -> OverTheWire blocks SSH logins from the server to itself, so the key has to be used from my own machine.

## Solution
### Linux
The key only works from outside the server, so I opened a new terminal on my own machine. I copied the key down with `scp`, logging in as `bandit13` with its password. I then restricted the key's permissions so SSH would accept it, and logged in as `bandit14` with `ssh -i`. Once in as `bandit14`, I could read its own password file.

```bash
# Run on your own machine, in a new local terminal
# 1. Copy the key from bandit13's home directory (asks for bandit13's password)
scp -P 2220 bandit13@bandit.labs.overthewire.org:sshkey.private /tmp/sshkey.private

# 2. Make the key readable by you only, otherwise SSH refuses to use it
chmod 600 /tmp/sshkey.private

# 3. Log in as bandit14 with the key, no password needed
ssh -i /tmp/sshkey.private -p 2220 bandit14@bandit.labs.overthewire.org

bandit14@bandit:~$ cat /etc/bandit_pass/bandit14
{Password for bandit14}
```

### Windows PowerShell
The same steps work in PowerShell, because Windows 10 and 11 ship with OpenSSH. The only difference is the permissions step: Windows has no `chmod`, so `icacls` removes the inherited permissions and then grants read access to my user only.

```powershell
# Run on your own machine, in a new PowerShell window
# 1. Copy the key from bandit13's home directory (asks for bandit13's password)
scp -P 2220 bandit13@bandit.labs.overthewire.org:sshkey.private $env:USERPROFILE\sshkey.private

# 2. Remove inherited permissions, then give read access to your user only
icacls $env:USERPROFILE\sshkey.private /inheritance:r
processed file: C:\Users\alex\sshkey.private
Successfully processed 1 files; Failed processing 0 files
icacls $env:USERPROFILE\sshkey.private /grant:r "$($env:USERNAME):(R)"
processed file: C:\Users\alex\sshkey.private
Successfully processed 1 files; Failed processing 0 files

# 3. Log in as bandit14 with the key, no password needed
ssh -i $env:USERPROFILE\sshkey.private -p 2220 bandit14@bandit.labs.overthewire.org

bandit14@bandit:~$ cat /etc/bandit_pass/bandit14
{Password for bandit14}
```

## Flag
`Password for bandit14`

## Lessons learned
- A private key is as good as a password: anyone who copies it can log in as its owner, so it must never be left readable by others.
- `scp` and `ssh` use different port flags: `-P` for `scp`, `-p` for `ssh`.
- SSH checks the key file's permissions and refuses keys that are too open: `chmod 600` on Linux, `icacls` on Windows.
- Save the next level's password once logged in, so later logins don't depend on the key.

## References
- [SSH/OpenSSH/Keys](https://help.ubuntu.com/community/SSH/OpenSSH/Keys)
- [SSH/Transfer files](https://help.ubuntu.com/community/SSH/TransferFiles)
- [ssh](https://man.openbsd.org/ssh)
- [scp](https://man.openbsd.org/scp)
- [Key-based authentication in OpenSSH for Windows](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_keymanagement)
