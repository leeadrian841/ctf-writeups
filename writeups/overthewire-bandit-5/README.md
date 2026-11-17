# OverTheWire: Bandit Lvl 5 (Linux): Bandit (2026)

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
The password for the next level is stored in a file somewhere under the inhere directory and has all of the following properties:
- human-readable
- 1033 bytes in size
- not executable

## Challenge
> Find the password for the next level which is stored in a file somewhere under the inhere directory and has all the properties.

- Files: `file with all the properties`
- Service: `bandit5@bandit.labs.overthewire.org:2220` (online)

## First look
I checked what are inside the `inhere` directory first and found files inside the directory.
My main objective is to find out what are the contents in these files since the files can contain anything like secret keys, data or even malicious software.
I will need to run a commmand to check the contents of any file.

```bash
ssh bandit5@bandit.labs.overthewire.org -p 2220
Password: {Password for bandit5}

bandit4@bandit:$ ls
inhere
bandit4@bandit:$ cd inhere
bandit4@bandit:~/inhere$ ls
-file00  -file01  -file02  -file03  -file04  -file05  -file06  -file07  -file08  -file09
```

## Dead ends
- Run `file` to find out the contents of each file: Had to `file` each file to find out the contents inside -> Time-consuming to `file` each file

## Solution
### Use `file` command with `*` wildcard
In a Linux shell, the `*` (asterisk) wildcard matches zero or more of any characters in a filename or directory path. When you run a command containing `*`, the shell automatically expands it into a list of all matching filenames before executing the command (a process called globbing).

#### Common Examples
- __Match all files:__ Running `ls *` lists every non-hidden file and folder in your current directory
- __Match by extension:__ Running `rm *.log` deletes all files ending in `.log`, such as `app.log` and `error.log`.
- __Match by prefix:__ Running `mv report* archive/` moves any file starting with report, including `report`, `report.pdf`, and `report_final.docx`.
- __Match characters in the middle:__ Running `cat data_*_2026.csv` displays the contents of files like `data_sales_2026.csv` and `data_hr_2026.csv`.
- __Match across subdirectories:__ Running `ls /var/log/*/*.log` finds `.log files` located one folder deep inside `/var/log/`.

```bash
# Using the `file` with `*` wildcard
bandit4@bandit:~/inhere$ file ./*
./-file00: data
./-file01: data
./-file02: OpenPGP Secret Key
./-file03: data
./-file04: data
./-file05: data
./-file06: Non-ISO extended-ASCII text, with NEL line terminators
./-file07: ASCII text
./-file08: data
./-file09: data
bandit4@bandit:~/inhere$ cat ./-file07
{Password for bandit5}
```

![{Describe what the screenshot shows}](img/{file}.png)

## Flag
`Password for bandit5`

## Lessons learned
- Understand how to use Linux commands with `*` wildcard.

## References
- [Wildcards](https://tldp.org/LDP/GNU-Linux-Tools-Summary/html/x11655.htm)
- [Examples of wildcard characters](https://support.microsoft.com/en-us/access/examples-of-wildcard-characters)