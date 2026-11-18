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

- Files: `file with all the properties` in the `inhere` directory
- Service: `bandit5@bandit.labs.overthewire.org:2220` (online)

## First look
I checked what are inside the `inhere` directory first and found files inside the directory.
My main objective is to find out the file location of that file which has the specific properties.
I will need to find a specific commmand that is able to find files matching a given set of properties.

```bash
ssh bandit5@bandit.labs.overthewire.org -p 2220
Password: {Password for bandit5}

bandit5@bandit:$ ls
inhere
bandit5@bandit:$ cd inhere
bandit5@bandit:~/inhere$ ls
maybehere00  maybehere03  maybehere06  maybehere09  maybehere12  maybehere15  maybehere18
maybehere01  maybehere04  maybehere07  maybehere10  maybehere13  maybehere16  maybehere19
maybehere02  maybehere05  maybehere08  maybehere11  maybehere14  maybehere17
bandit5@bandit:~/inhere$ ls -R
.:
maybehere00  maybehere03  maybehere06  maybehere09  maybehere12  maybehere15  maybehere18
maybehere01  maybehere04  maybehere07  maybehere10  maybehere13  maybehere16  maybehere19
maybehere02  maybehere05  maybehere08  maybehere11  maybehere14  maybehere17

./maybehere00:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3

./maybehere01:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3

./maybehere02:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3

./maybehere03:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3

./maybehere04:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3

./maybehere05:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3

./maybehere06:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3

./maybehere07:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3

./maybehere08:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3

./maybehere09:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3

./maybehere10:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3

./maybehere11:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3

./maybehere12:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3

./maybehere13:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3

./maybehere14:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3

./maybehere15:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3

./maybehere16:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3

./maybehere17:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3

./maybehere18:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3

./maybehere19:
-file1  -file2  -file3  spaces file1  spaces file2  spaces file3
```

## Dead ends
- Run `cd` to every directory in `inhere` and check all files in each directory: Spent quite some time to check each directory but gave up instead -> Time-consuming to check all the contents in each directory

## Solution
### Use `find` to find any file with specific properties
I had to consider a more productive method to find that file with the specific properties so I have to use the `find` command instead. I just need to find the file that have these 3 properties:
- human-readable
- 1033 bytes in size
- not executable

The `find` command is the ideal method for this scenario.

### 💡 How It Works
- **`find inhere`**: Starts the search specifically inside the directory named `inhere` (instead of searching the entire server using `find /`).
- **`-type f`**: Restricts the search to regular **files** only, ignoring folders/directories.
- **`-size 1033c`**: Looks for a file that is exactly **1033 bytes** in size (the `c` stands for bytes).
- **`!`**: This is a **negation** operator. It means "NOT" or the opposite of whatever condition follows it.
- **`-perm /a+x`**: Checks for execution permissions (`+x`) for anyone/all users (`a`).
    - Combined with the `!`, `! -perm /a+x` means the file must **NOT be executable** by anyone.

```bash
bandit5@bandit:~/inhere$ find -type f -size 1033c ! -perm /a+x
./maybehere07/.file2
bandit5@bandit:~/inhere$ file ./maybehere07/.file2
./maybehere07/.file2: ASCII text, with very long lines (1000)
bandit5@bandit:~/inhere$ head ./maybehere07/.file2
{Password for bandit6}
bandit5@bandit:~/inhere$ cat ./maybehere07/.file2
{Password for bandit6}
```

### Winning Command
I was thinking of whether there is a better way to find the file and output the contents in just one command. There is a way to get the file and read the contents in just 1 command using `cat $({find the file})`.

Either `head` or `cat` works here but you never know what are the contents inside that unknown file so it is best to use `head` as a precaution.

```bash
# Find the file in "inhere" as the current directory with the mentioned parameters
bandit5@bandit:~/inhere$ head $(find -type f -size 1033c ! -perm /a+x)
{Password for bandit6}
bandit5@bandit:~/inhere$ cat $(find -type f -size 1033c ! -perm /a+x)
{Password for bandit6}

# Find the file in "inhere" directory with the mentioned parameters
bandit5@bandit:$ head $(find inhere -type f -size 1033c ! -perm /a+x)
{Password for bandit6}
bandit5@bandit:$ cat $(find inhere -type f -size 1033c ! -perm /a+x)
{Password for bandit6}
```

![{Describe what the screenshot shows}](img/{file}.png)

## Flag
`Password for bandit6`

## Lessons learned
- Understand how to use `find` command to find files with specific properties.

## References
- [10 ways to use the Linux find command](https://www.redhat.com/en/blog/linux-find-command)
- [find](https://man7.org/linux/man-pages/man1/find.1.html)