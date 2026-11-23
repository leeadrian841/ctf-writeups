# OverTheWire: Bandit Lvl 12 (Linux): Bandit (2026)

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
Hexdump of a repeatedly compressed file: reverse the dump with `xxd -r`, then use `file` to identify each layer (gzip, bzip2, tar) and decompress it with the matching tool until plain text remains.

## Challenge
> The password for the next level is stored in the file data.txt, which is a hexdump of a file that has been repeatedly compressed. For this level it may be useful to create a directory under /tmp in which you can work. Use mkdir with a hard to guess directory name. Or better, use the command “mktemp -d”. Then copy the datafile using cp, and rename it using mv (read the manpages!)

- Files: `data.txt` (hexdump, repeatedly compressed)
- Service: `bandit12@bandit.labs.overthewire.org:2220` (online)

## First look
First thing that I did is to read up on what hex dump is and also how to handle hexdump files. After understanding how to handle hexdump files, I first `head` the hexdump file to understand the contents inside. I noticed that the first few lines contained `data2.bin`. I tried to `xxd` the `data.txt` file to a `data.bin` file and it worked.

```bash
ssh bandit12@bandit.labs.overthewire.org -p 2220
Password: {Password for bandit12}

bandit12@bandit:~$ mktemp -d
/tmp/tmp.UJlaSg7Kb6
bandit12@bandit:~$ cd /tmp/tmp.UJlaSg7Kb6
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ file data.txt
data.txt: ASCII text
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ head data.txt
00000000: 1f8b 0808 b83e b86a 0203 6461 7461 322e  .....>.j..data2.
00000010: 6269 6e00 0146 02b9 fd42 5a68 3931 4159  bin..F...BZh91AY
00000020: 2653 59fc 8b90 bd00 0019 ffff dde3 ddf7  &SY.............
00000030: feaf 7f1f ffdf fdeb bfff f6fb bf7f 8b7f  ................
00000040: 9ffb b7e8 ffd7 afe6 d7ff fdbd b001 3b56  ..............;V
00000050: a100 6800 1a1a 0068 34f5 0000 6869 a1a1  ..h....h4...hi..
00000060: a00c 9a06 8000 0d00 0000 0680 001a 00d1  ................
00000070: 91a3 4064 1e48 189e 9911 0000 00d0 1a0f  ..@d.H..........
00000080: 51a0 0d0d 0d34 0686 81a0 680d 0000 0190  Q....4....h.....
00000090: 34d0 184d 069a 068d 3d41 b503 40d3 6a00  4..M....=A..@.j.
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ xxd -r data.txt > data.bin
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ file data.bin
data.bin: gzip compressed data, was "data2.bin", last modified: Sat Sep 26 21:52:56 2026, max compression, from Unix, original size modulo 2^32 582
```

## Dead ends
- None

## Solution
### Step 1: `xxd` the hexdump
I `head` the hexdump file first to understand the contents inside `data.txt`. I noticed that the first few lines contained `data2.bin`. I tried to `xxd` the `data.txt` hexdump to a `data.bin` file and it worked.

```bash
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ file data.txt
data.txt: ASCII text
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ head data.txt
00000000: 1f8b 0808 b83e b86a 0203 6461 7461 322e  .....>.j..data2.
00000010: 6269 6e00 0146 02b9 fd42 5a68 3931 4159  bin..F...BZh91AY
00000020: 2653 59fc 8b90 bd00 0019 ffff dde3 ddf7  &SY.............
00000030: feaf 7f1f ffdf fdeb bfff f6fb bf7f 8b7f  ................
00000040: 9ffb b7e8 ffd7 afe6 d7ff fdbd b001 3b56  ..............;V
00000050: a100 6800 1a1a 0068 34f5 0000 6869 a1a1  ..h....h4...hi..
00000060: a00c 9a06 8000 0d00 0000 0680 001a 00d1  ................
00000070: 91a3 4064 1e48 189e 9911 0000 00d0 1a0f  ..@d.H..........
00000080: 51a0 0d0d 0d34 0686 81a0 680d 0000 0190  Q....4....h.....
00000090: 34d0 184d 069a 068d 3d41 b503 40d3 6a00  4..M....=A..@.j.
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ xxd -r data.txt > data.bin
```

### Step 2: Repeat cycles of decompressing and renaming files
Next, I `file` every new file to determine the file's true type before renaming and decompressing using the appropriate method. I kept repeating this process till I got a file that is ASCII text.

```bash
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ file data.bin
data.bin: gzip compressed data, was "data2.bin", last modified: Sat Sep 26 21:52:56 2026, max compression, from Unix, original size modulo 2^32 582
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ mv data.bin data.gz
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ ls
data.gz  data.txt
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ gunzip data.gz
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ ls
data  data.txt
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ file data
data: bzip2 compressed data, block size = 900k
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ mv data data.bz2
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ ls
data.bz2  data.txt
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ bunzip2 data.bz2
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ ls
data  data.txt
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ file data
data: gzip compressed data, was "data4.bin", last modified: Sat Sep 26 21:52:56 2026, max compression, from Unix, original size modulo 2^32 20480
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ ls
data  data.txt
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ mv data data.gz
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ ls
data.gz  data.txt
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ gunzip data.gz
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ ls
data  data.txt
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ file data
data: POSIX tar archive (GNU)
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ mv data data.tar
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ ls
data.tar  data.txt
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ tar xf data.tar
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ ls
data.tar  data.txt  data5.bin
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ file data5.bin
data5.bin: POSIX tar archive (GNU)
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ tar xf data.tar
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ ls
data.tar  data.txt  data5.bin
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ file data5.bin
data5.bin: POSIX tar archive (GNU)
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ mv data5.bin data5.tar
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ ls
data.tar  data.txt  data5.tar
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ tar xf data5.tar
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ ls
data.tar  data.txt  data5.tar  data6.bin
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ file data6.bin
data6.bin: bzip2 compressed data, block size = 900k
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ mv data6.bin data6.bz2
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ bunzip2 data6.bz2
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ ls
data.tar  data.txt  data5.tar  data6
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ file data6
data6: POSIX tar archive (GNU)
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ mv data6 data6.tar
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ ls
data.tar  data.txt  data5.tar  data6.tar
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ tar xf data6.tar
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ ls
data.tar  data.txt  data5.tar  data6.tar  data8.bin
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ file data8.bin
data8.bin: gzip compressed data, was "data9.bin", last modified: Sat Sep 26 21:52:56 2026, max compression, from Unix, original size modulo 2^32 49
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ mv data8.bin data8.gz
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ gunzip data8.gz
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ ls
data.tar  data.txt  data5.tar  data6.tar  data8
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ file data8
data8: ASCII text
bandit12@bandit:/tmp/tmp.UJlaSg7Kb6$ head data8
The password is {Password for bandit13}
```

## Flag
`The password is {Password for bandit13}`

## Lessons learned
- Understand the different file types and use different decompression methods.

## References
- [Hex Dump](https://en.wikipedia.org/wiki/Hex_dump)
- [How Hexdump works](https://opensource.com/article/19/8/dig-binary-files-hexdump)
- [hexdump(1) — Linux manual page](https://man7.org/linux/man-pages/man1/hexdump.1.html)