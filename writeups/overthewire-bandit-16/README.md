# OverTheWire: Bandit Lvl 16 (Linux): Bandit (2026)

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
| Tags       | Linux, Networking, nmap, SSL/TLS, SSH |

## TL;DR
Port scanning and service detection: `nmap -sV` across ports 31000–32000 found five listeners, and only one spoke SSL/TLS without echoing input back. Sending the current password there with `openssl s_client` returned bandit17's private SSH key instead of a password.

## Challenge
> Submit the current level's password to one port on localhost between 31000 and 32000. First find which ports have a server listening, then which of those speak SSL/TLS. Only one server gives the next credentials; the others just send back whatever they receive.

- Files: None for this level
- Service: `bandit16@bandit.labs.overthewire.org:2220` (online)

## First look
This level builds on Level 15, but the port is unknown: it is somewhere in a range of 1,001 ports. Trying each one by hand with `openssl s_client` would take far too long, so I needed a **port scanner**. `nmap` checks which ports are open and, with `-sV`, also probes each one to identify the service behind it.

```bash
bandit16@bandit:~$ nmap -sV -p 31000-32000 localhost
Starting Nmap 7.98 ( https://nmap.org ) at 2026-10-26 07:38 +0000
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00018s latency).
Other addresses for localhost (not scanned): ::1
Not shown: 996 closed tcp ports (conn-refused)
PORT      STATE SERVICE     VERSION
31046/tcp open  echo
31518/tcp open  ssl/echo
31691/tcp open  echo
31790/tcp open  ssl/unknown
31960/tcp open  echo
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port31790-TCP:V=7.98%T=SSL%I=7%D=10/26%Time=6ADF038A%P=x86_64-pc-linux-
SF:gnu%r(GenericLines,32,"Wrong!\x20Please\x20enter\x20the\x20correct\x20c
SF:urrent\x20password\.\n")%r(GetRequest,32,"Wrong!\x20Please\x20enter\x20
SF:the\x20correct\x20current\x20password\.\n")%r(HTTPOptions,32,"Wrong!\x2
SF:0Please\x20enter\x20the\x20correct\x20current\x20password\.\n")%r(RTSPR
SF:equest,32,"Wrong!\x20Please\x20enter\x20the\x20correct\x20current\x20pa
SF:ssword\.\n")%r(Help,32,"Wrong!\x20Please\x20enter\x20the\x20correct\x20
SF:current\x20password\.\n")%r(FourOhFourRequest,32,"Wrong!\x20Please\x20e
SF:nter\x20the\x20correct\x20current\x20password\.\n")%r(LPDString,32,"Wro
SF:ng!\x20Please\x20enter\x20the\x20correct\x20current\x20password\.\n")%r
SF:(SIPOptions,32,"Wrong!\x20Please\x20enter\x20the\x20correct\x20current\
SF:x20password\.\n");

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 122.73 seconds
```

The scan found five open ports, and the `SERVICE` column already narrows them down:

| Port | Service | Meaning |
|------|---------|---------|
| 31046, 31691, 31960 | `echo` | Plain text, and they send back whatever they receive. Not the target. |
| 31518 | `ssl/echo` | Speaks SSL/TLS, but also only echoes. Not the target. |
| **31790** | `ssl/unknown` | Speaks SSL/TLS, and `nmap` could not identify it. |

The fingerprint for port 31790 confirms it: to every probe `nmap` sent, the service replied `Wrong! Please enter the correct current password.` That is the service that checks passwords.

### Theory
- **Port scanning:** connecting to a range of ports to see which have a program listening. It is usually the first step of reconnaissance, on a lab machine or in a real penetration test.
- **`nmap -p 31000-32000 localhost`:** scans only the given port range on this machine.
- **`-sV` (version detection):** after finding an open port, `nmap` sends test messages and compares the replies with known services. This is how it told `echo` and `ssl/echo` apart from the unknown service. It is slower: this scan took about two minutes.
- **Service fingerprint:** when `nmap` cannot name a service, it prints the raw replies (the `SF:` lines). Reading them often tells you what the service does.

## Dead ends
- None

## Solution
### Step 1: Send the password to port 31790 over TLS
The service on port 31790 speaks TLS, so I used `openssl s_client` as in Level 15. The home directory is not writable, so I made my own working folder in `/tmp` first. I saved the reply to `raw17.txt` because I expected a long output. `-ign_eof` keeps the connection open after `echo` finishes, so the reply still arrives.

The server answered `Correct!`, followed by an **OpenSSH private key** instead of a password. Like in Level 13, this key logs in as the next user, `bandit17`.

```bash
bandit16@bandit:/tmp/adrian16$ echo {Password for bandit16} | openssl s_client -connect localhost:31790 -ign_eof > raw17.txt
...
read R BLOCK
Correct!
-----BEGIN OPENSSH PRIVATE KEY-----
{Private SSH key for bandit17: 36 lines, removed}
-----END OPENSSH PRIVATE KEY-----

closed
```

<details>
<summary>Full output</summary>

```bash
bandit16@bandit:~$ mkdir -p /tmp/adrian16 && cd /tmp/adrian16
bandit16@bandit:/tmp/adrian16$ echo {Password for bandit16} | openssl s_client -connect localhost:31790 -ign_eof > raw17.txt
Connecting to 127.0.0.1
CONNECTED(00000003)
Can't use SSL_get_servername
depth=0 CN=SnakeOil
verify error:num=18:self-signed certificate
verify return:1
depth=0 CN=SnakeOil
verify return:1
---
Certificate chain
 0 s:CN=SnakeOil
   i:CN=SnakeOil
   a:PKEY: RSA, 4096 (bit); sigalg: sha256WithRSAEncryption
   v:NotBefore: Jun 10 03:59:50 2024 GMT; NotAfter: Jun  8 03:59:50 2034 GMT
---
Server certificate
-----BEGIN CERTIFICATE-----
MIIFBzCCAu+gAwIBAgIUBLz7DBxA0IfojaL/WaJzE6Sbz7cwDQYJKoZIhvcNAQEL
BQAwEzERMA8GA1UEAwwIU25ha2VPaWwwHhcNMjQwNjEwMDM1OTUwWhcNMzQwNjA4
MDM1OTUwWjATMREwDwYDVQQDDAhTbmFrZU9pbDCCAiIwDQYJKoZIhvcNAQEBBQAD
ggIPADCCAgoCggIBANI+P5QXm9Bj21FIPsQqbqZRb5XmSZZJYaam7EIJ16Fxedf+
jXAv4d/FVqiEM4BuSNsNMeBMx2Gq0lAfN33h+RMTjRoMb8yBsZsC063MLfXCk4p+
09gtGP7BS6Iy5XdmfY/fPHvA3JDEScdlDDmd6Lsbdwhv93Q8M6POVO9sv4HuS4t/
jEjr+NhE+Bjr/wDbyg7GL71BP1WPZpQnRE4OzoSrt5+bZVLvODWUFwinB0fLaGRk
GmI0r5EUOUd7HpYyoIQbiNlePGfPpHRKnmdXTTEZEoxeWWAaM1VhPGqfrB/Pnca+
vAJX7iBOb3kHinmfVOScsG/YAUR94wSELeY+UlEWJaELVUntrJ5HeRDiTChiVQ++
wnnjNbepaW6shopybUF3XXfhIb4NvwLWpvoKFXVtcVjlOujF0snVvpE+MRT0wacy
tHtjZs7Ao7GYxDz6H8AdBLKJW67uQon37a4MI260ADFMS+2vEAbNSFP+f6ii5mrB
18cY64ZaF6oU8bjGK7BArDx56bRc3WFyuBIGWAFHEuB948BcshXY7baf5jjzPmgz
mq1zdRthQB31MOM2ii6vuTkheAvKfFf+llH4M9SnES4NSF2hj9NnHga9V08wfhYc
x0W6qu+S8HUdVF+V23yTvUNgz4Q+UoGs4sHSDEsIBFqNvInnpUmtNgcR2L5PAgMB
AAGjUzBRMB0GA1UdDgQWBBTPo8kfze4P9EgxNuyk7+xDGFtAYzAfBgNVHSMEGDAW
gBTPo8kfze4P9EgxNuyk7+xDGFtAYzAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3
DQEBCwUAA4ICAQAKHomtmcGqyiLnhziLe97Mq2+Sul5QgYVwfx/KYOXxv2T8ZmcR
Ae9XFhZT4jsAOUDK1OXx9aZgDGJHJLNEVTe9zWv1ONFfNxEBxQgP7hhmDBWdtj6d
taqEW/Jp06X+08BtnYK9NZsvDg2YRcvOHConeMjwvEL7tQK0m+GVyQfLYg6jnrhx
egH+abucTKxabFcWSE+Vk0uJYMqcbXvB4WNKz9vj4V5Hn7/DN4xIjFko+nREw6Oa
/AUFjNnO/FPjap+d68H1LdzMH3PSs+yjGid+6Zx9FCnt9qZydW13Miqg3nDnODXw
+Z682mQFjVlGPCA5ZOQbyMKY4tNazG2n8qy2famQT3+jF8Lb6a4NGbnpeWnLMkIu
jWLWIkA9MlbdNXuajiPNVyYIK9gdoBzbfaKwoOfSsLxEqlf8rio1GGcEV5Hlz5S2
txwI0xdW9MWeGWoiLbZSbRJH4TIBFFtoBG0LoEJi0C+UPwS8CDngJB4TyrZqEld3
rH87W+Et1t/Nepoc/Eoaux9PFp5VPXP+qwQGmhir/hv7OsgBhrkYuhkjxZ8+1uk7
tUWC/XM0mpLoxsq6vVl3AJaJe1ivdA9xLytsuG4iv02Juc593HXYR8yOpow0Eq2T
U5EyeuFg5RXYwAPi7ykw1PW7zAPL4MlonEVz+QXOSx6eyhimp1VZC11SCg==
-----END CERTIFICATE-----
subject=CN=SnakeOil
issuer=CN=SnakeOil
---
No client certificate CA names sent
Peer signing digest: SHA256
Peer signature type: rsa_pss_rsae_sha256
Negotiated TLS1.3 group: X25519MLKEM768
---
SSL handshake has read 3191 bytes and written 1613 bytes
Verification error: self-signed certificate
---
New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
Protocol: TLSv1.3
Server public key is 4096 bit
This TLS version forbids renegotiation.
Compression: NONE
Expansion: NONE
No ALPN negotiated
Early data was not sent
Verify return code: 18 (self-signed certificate)
---
---
Post-Handshake New Session Ticket arrived:
SSL-Session:
    Protocol  : TLSv1.3
    Cipher    : TLS_AES_256_GCM_SHA384
    Session-ID: BB1EC9B0346D0A7F7121C4C06057AD40E7817BC7387BBBF92F929D56E666FA61
    Session-ID-ctx:
    Resumption PSK: BAD667972B4EA2F7B79055658F7C1DEFD345397516833F79B067470485F1A3CF442E5F4EFEDA947A9E5F641E386043D0
    PSK identity: None
    PSK identity hint: None
    SRP username: None
    TLS session ticket lifetime hint: 300 (seconds)
    TLS session ticket:
    0000 - 53 95 93 e7 81 99 54 ac-c5 a6 e7 ce 31 44 b3 a6   S.....T.....1D..
    0010 - e5 08 5a d1 e9 48 39 a5-da a0 e3 76 00 a6 e6 ca   ..Z..H9....v....
    0020 - 99 d2 90 60 a5 88 e0 6c-95 f6 6e 72 89 17 c5 60   ...`...l..nr...`
    0030 - 54 90 24 f5 57 f4 b8 be-3a c2 a0 d8 9d ed 4a c9   T.$.W...:.....J.
    0040 - ce 6e 1a 6b 92 0c 7d 42-e5 49 a1 6d 47 60 24 c5   .n.k..}B.I.mG`$.
    0050 - ad 32 ae 99 0c a7 f7 d8-c2 9e 53 fe 4c de b1 77   .2........S.L..w
    0060 - e0 fc f6 f0 8d 71 2d fc-6f 4f 36 ca a8 73 b1 57   .....q-.oO6..s.W
    0070 - b9 2b c1 16 56 4d 55 c7-f7 66 25 80 75 18 6b 5e   .+..VMU..f%.u.k^
    0080 - 88 0e a7 01 20 45 eb 07-66 1a 20 9b b4 e6 e0 ec   .... E..f. .....
    0090 - 46 80 28 b5 23 41 9f 75-9d 58 b5 79 f2 47 21 94   F.(.#A.u.X.y.G!.
    00a0 - 65 25 d2 4f dd a1 ab 92-af d1 b5 d8 a7 e5 35 8c   e%.O..........5.
    00b0 - 7b 42 07 dd a5 62 9b 94-42 a4 c6 e5 43 44 0d ae   {B...b..B...CD..
    00c0 - 68 f8 1b 7f 67 28 2b d6-0e c7 56 5e c5 f5 b8 c4   h...g(+...V^....
    00d0 - a6 b5 e1 20 f5 9c 09 86-56 18 8a 05 56 58 cc 78   ... ....V...VX.x

    Start Time: 1793000699
    Timeout   : 7200 (sec)
    Verify return code: 18 (self-signed certificate)
    Extended master secret: no
    Max Early Data: 0
---
read R BLOCK
---
Post-Handshake New Session Ticket arrived:
SSL-Session:
    Protocol  : TLSv1.3
    Cipher    : TLS_AES_256_GCM_SHA384
    Session-ID: 9A82E55AC220322D60FDC150505BCADEA2E97EB99CC2E21297D6E789E4854D26
    Session-ID-ctx:
    Resumption PSK: 1B3B64176261638A65EEF6E614C244D92E6A93AD0A2BFB3FA79B2B9D8FD07DA20D66D3C8C9944350E775FA8B86ADBB9D
    PSK identity: None
    PSK identity hint: None
    SRP username: None
    TLS session ticket lifetime hint: 300 (seconds)
    TLS session ticket:
    0000 - 53 95 93 e7 81 99 54 ac-c5 a6 e7 ce 31 44 b3 a6   S.....T.....1D..
    0010 - 39 25 2d c8 f7 5b d0 09-dd b4 72 e2 1f 95 6f e6   9%-..[....r...o.
    0020 - e3 a1 6d 8d 29 a8 c0 1a-c6 70 83 95 71 ee 5e a5   ..m.)....p..q.^.
    0030 - dd cf 3a 31 68 0d 68 d0-1f 9a 08 ec dd b6 bc b1   ..:1h.h.........
    0040 - 17 05 d0 77 11 79 28 93-08 3d 5e 2a 27 50 3c 72   ...w.y(..=^*'P<r
    0050 - cd 98 44 d1 54 42 40 43-bc cd f6 08 bc e8 bf 13   ..D.TB@C........
    0060 - e9 ec 99 98 8f f8 db 6d-0c b0 1b 68 09 b1 35 f5   .......m...h..5.
    0070 - 23 61 e2 ce 73 ba 0d 63-5f 09 5c 0c cf 3c b9 ba   #a..s..c_.\..<..
    0080 - 58 d6 6a a6 68 30 2e 8f-d1 cc 78 80 7c 3a 97 e7   X.j.h0....x.|:..
    0090 - c0 6f bb 5e 6a 25 02 fe-7f 6c fd 2b 9e d3 1a bd   .o.^j%...l.+....
    00a0 - aa bc ba dc 90 60 a4 6d-f2 4d 58 88 3b b8 59 ab   .....`.m.MX.;.Y.
    00b0 - b9 fa 40 92 d1 82 bf 2a-7f 6e 98 f1 a2 50 68 db   ..@....*.n...Ph.
    00c0 - 8b 69 f4 db 34 3b 54 b5-c6 17 29 74 e6 10 4f db   .i..4;T...)t..O.
    00d0 - 77 ee 51 a9 01 12 eb 57-f7 0a 76 b2 f6 f8 3a c4   w.Q....W..v...:.

    Start Time: 1793000699
    Timeout   : 7200 (sec)
    Verify return code: 18 (self-signed certificate)
    Extended master secret: no
    Max Early Data: 0
---
read R BLOCK
Correct!
-----BEGIN OPENSSH PRIVATE KEY-----
{Private SSH key for bandit17: 36 lines, removed}
-----END OPENSSH PRIVATE KEY-----

closed
```

</details>

### Step 2: Extract the key into its own file
`raw17.txt` holds the whole TLS session, not just the key. `sed -n '/BEGIN/,/END/p'` prints only the lines from the `BEGIN` marker to the `END` marker, which is exactly the key. I checked the first and last lines to make sure nothing was cut off.

```bash
bandit16@bandit:/tmp/adrian16$ sed -n '/-----BEGIN OPENSSH PRIVATE KEY-----/,/-----END OPENSSH PRIVATE KEY-----/p' raw17.txt > sshkey17.private
bandit16@bandit:/tmp/adrian16$ head -1 sshkey17.private
-----BEGIN OPENSSH PRIVATE KEY-----
bandit16@bandit:/tmp/adrian16$ tail -1 sshkey17.private
-----END OPENSSH PRIVATE KEY-----
```

### Step 3: Log in as bandit17 with the key
As in Level 13, the key has to be used from my own machine, so I copied it down with `scp`. SSH refuses a private key that other users can read, so I locked its permissions before logging in.

#### Linux
```bash
# In a new terminal on your own machine
❯ scp -P 2220 bandit16@bandit.labs.overthewire.org:/tmp/adrian16/sshkey17.private /tmp/sshkey17.private
❯ chmod 600 /tmp/sshkey17.private
❯ ssh -i /tmp/sshkey17.private -p 2220 bandit17@bandit.labs.overthewire.org

bandit17@bandit:~$ cat /etc/bandit_pass/bandit17
{Password for bandit17}
```

#### Windows PowerShell
On Windows, `icacls` replaces `chmod`. Before using the key, I ran `ssh-keygen -y`, which works out the public key from a private key. It only succeeds if the file is a complete, valid key, so it is a quick check that the copy and the `sed` extraction worked.

```powershell
# In a new PowerShell window on your own machine
❯ scp -P 2220 bandit16@bandit.labs.overthewire.org:/tmp/adrian16/sshkey17.private $env:USERPROFILE\sshkey17.private
❯ ssh-keygen -y -f $env:USERPROFILE\sshkey17.private
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC91JrDyPUVDYOO1tA8aIRW2oQbmS3eDvW4OWLGDja9E3Yy9ZFWcZC3iT1P20NZqKyef7ojhEKSETPDbfVYDopVzRJ3T7r/oKnUSCnijiX7F/mA82jsDY6qOo3rseHLojvUYGPJQGenq8S2QjdZmZm27GkIw/IdLLubnqWKkkV10oQ5QJfbWE1ZbLZIBlAUG5vczWGtxqvlwDikIUnYCaNKw4/jJFt0RGHe9lMY2Mp7bH7N7iN/b9j+412aLF1oAy4Py2jhh/snKVcv/6iHNqw5gzSI0W+vyCQ45zXXG5M11sY2a7UV/dWnWq0k0HrTQRasG30fjGXv9ZfARDT/cRumNTEabdnJRTkWYPgIaHWX3DgWowP5FP1PcBW7Nfw0zUWIgCRAx7RvfioXuJON1Nz7ZV7tjBpqSbv0lgWfCKth31A5HGaOpQ74fpif3EsWalGQWO9V/c1+96RG1XkWbuV73CuKleWNnWGQd8fp5yEzekg2IkkeJkCAH8IM9VF0uG0= rudy@localhost
❯ icacls $env:USERPROFILE\sshkey17.private /inheritance:r
processed file: C:\Users\alex\sshkey17.private
Successfully processed 1 files; Failed processing 0 files
❯ icacls $env:USERPROFILE\sshkey17.private /grant:r "$($env:USERNAME):(R)"
processed file: C:\Users\alex\sshkey17.private
Successfully processed 1 files; Failed processing 0 files

❯ ssh -i $env:USERPROFILE\sshkey17.private -p 2220 bandit17@bandit.labs.overthewire.org
bandit17@bandit:~$ cat /etc/bandit_pass/bandit17
{Password for bandit17}
```

## Flag
`Password for bandit17`

## Lessons learned
- When the port is unknown, scan for it: `nmap -p <range>` finds open ports, and `-sV` identifies what is running on each.
- Read the scan results critically: services marked `echo` or `ssl/echo` can be ruled out, which leaves one candidate.
- Unidentified services are worth a closer look: the fingerprint in `nmap`'s output already showed the `Wrong! Please enter the correct current password.` prompt.
- A level's "credentials" are not always a password: here they were a private SSH key, used the same way as in Level 13.
- Work in your own folder under `/tmp` on shared machines, and use `sed -n '/start/,/end/p'` to cut a block out of a larger output.

## References
- [nmap](https://nmap.org/book/man.html)
- [Nmap: Service and version detection](https://nmap.org/book/man-version-detection.html)
- [Port scanner](https://en.wikipedia.org/wiki/Port_scanner)
- [openssl s_client](https://docs.openssl.org/master/man1/openssl-s_client/)
- [sed](https://www.gnu.org/software/sed/manual/sed.html)
- [ssh-keygen](https://man.openbsd.org/ssh-keygen)
