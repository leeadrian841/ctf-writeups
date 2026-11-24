# OverTheWire: Bandit Lvl 15 (Linux): Bandit (2026)

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
| Tags       | Linux, Networking, SSL/TLS, OpenSSL |

## TL;DR
Talking to a TLS-encrypted service: the service on port 30001 only accepts TLS connections, so `openssl s_client` handles the encryption in place of `nc`. When the password is piped in, `-ign_eof` keeps the connection open long enough to read the reply.

## Challenge
> The password for the next level can be retrieved by submitting the password of the current level to port 30001 on localhost using SSL/TLS encryption.

- Files: None for this level
- Service: `bandit15@bandit.labs.overthewire.org:2220` (online)

## First look
This level is the same as Level 14, except the service on port 30001 expects **SSL/TLS encryption**. `nc` sends plain text, so it cannot talk to this service. I needed a client that performs the TLS handshake first and then lets me send data through the encrypted channel. `openssl s_client` does exactly that.

### Theory
- **SSL/TLS:** the encryption layer behind HTTPS. Before any data is sent, the client and server perform a *handshake*: the server presents its certificate, they agree on a cipher, and from then on everything is encrypted.
- **Certificate:** proves the server's identity. This server uses a **self-signed** certificate (`CN=SnakeOil`, issued by itself), so `openssl` reports `verify error:num=18:self-signed certificate`. In a lab this is expected and harmless. On a real website it would be a red flag.
- **`openssl s_client -connect host:port`:** a generic TLS client. It prints the handshake details, then sends whatever is typed or piped into it over the encrypted connection.
- **`-ign_eof`:** by default, `s_client` closes the connection as soon as its input ends. `-ign_eof` keeps it open after the input ends, so the server's reply still arrives.
- **`-quiet`:** hides the certificate and session details and turns on `-ign_eof` automatically.

## Dead ends
- `nc localhost 30001` with the password, as in Level 14: no password came back -> the service expects a TLS handshake first, and `nc` sends plain text.

## Solution
I solved it in two ways: interactively, then as a single piped command.

### Method 1: Interactive `openssl s_client`
I connected, waited for the handshake output to finish, then pasted the password and pressed Enter. The server replied `Correct!` followed by the password for `bandit16`.

The full output is long because `s_client` prints the certificate, the handshake summary and two TLS 1.3 session tickets before it reads any input. The key lines are near the end:

```bash
bandit15@bandit:~$ openssl s_client -connect localhost:30001 -ign_eof
Connecting to 127.0.0.1
CONNECTED(00000003)
depth=0 CN=SnakeOil
verify error:num=18:self-signed certificate
...
Protocol: TLSv1.3
...
read R BLOCK
{Password for bandit15}
Correct!
{Password for bandit16}
```

<details>
<summary>Full output (Method 1)</summary>

```bash
ssh bandit15@bandit.labs.overthewire.org -p 2220
Password: {Password for bandit15}

bandit15@bandit:~$ openssl s_client -connect localhost:30001 -ign_eof
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
    Session-ID: E95DA6564E34AD0BC87D9864B8EEA748D55C5B77D23E3520A590BD5BCB853EE0
    Session-ID-ctx:
    Resumption PSK: BFDE76C03F22322ED3483A84F0459D87E2DD65568656936B230975BE15681F6D43943C11B65555CEEE0B53A294CDB3C3
    PSK identity: None
    PSK identity hint: None
    SRP username: None
    TLS session ticket lifetime hint: 300 (seconds)
    TLS session ticket:
    0000 - 9f 84 9b b2 e7 7a dc 13-91 92 5f ca 33 f3 70 43   .....z...._.3.pC
    0010 - d7 ad f9 3b 2c 79 8e 19-ce 78 29 e3 f6 90 8c 6d   ...;,y...x)....m
    0020 - c6 d2 20 c4 bd dc b8 b0-a8 02 19 6a fc c8 22 b1   .. ........j..".
    0030 - ba a5 fe 5f b0 02 3a c9-61 3f f9 72 b3 1a 4b 7c   ..._..:.a?.r..K|
    0040 - 61 98 94 6c 7e 1e fc fd-47 f5 ca f6 50 61 7f a1   a..l~...G...Pa..
    0050 - 3a 90 ed e2 e4 57 37 09-9d 55 5f e0 a1 62 6c 1f   :....W7..U_..bl.
    0060 - fb f9 a2 07 1c c4 62 55-bd 15 19 62 36 f2 c8 a0   ......bU...b6...
    0070 - d5 1b 44 ae 37 45 82 63-ef 8e ac 44 31 43 16 3b   ..D.7E.c...D1C.;
    0080 - dc 3c 45 ee d2 0d 1b ca-8c c4 b4 7e 11 47 5e 89   .<E........~.G^.
    0090 - cc 48 64 a4 2c 36 80 77-ff 5a d1 08 a6 01 77 75   .Hd.,6.w.Z....wu
    00a0 - 86 86 d0 45 39 53 44 16-fa 8d 55 01 65 64 be 52   ...E9SD...U.ed.R
    00b0 - 87 db c2 9f 57 07 49 8c-b3 08 9a cf ef e2 b1 69   ....W.I........i
    00c0 - a9 45 fd e1 7b 49 17 76-fd 4f 5d 51 b8 5d 01 43   .E..{I.v.O]Q.].C
    00d0 - b6 8d 7a 4c a6 3b 5f e0-39 8e ed fc f5 ec 40 82   ..zL.;_.9.....@.

    Start Time: 1792937454
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
    Session-ID: A29BD9E9DD27AC008B3B13678B4040232FBA0E68DAF7235AD80A934B34FD1096
    Session-ID-ctx:
    Resumption PSK: 3FF7BF9D4E34F56FB8C58D55BF97307B96EBA69108BA69B4118E51D5CA53003DF61BC5547268688D0D60C78FEFA40CFD
    PSK identity: None
    PSK identity hint: None
    SRP username: None
    TLS session ticket lifetime hint: 300 (seconds)
    TLS session ticket:
    0000 - 9f 84 9b b2 e7 7a dc 13-91 92 5f ca 33 f3 70 43   .....z...._.3.pC
    0010 - 5b 19 35 61 f2 55 b5 e1-33 6f 78 85 a6 77 fa be   [.5a.U..3ox..w..
    0020 - ee 4b 9a a1 fa 5d a9 68-bb d9 5e 88 8a d5 ea e0   .K...].h..^.....
    0030 - d9 5c 95 31 48 8f d9 86-2c 9c ef 72 d0 7f 1b 91   .\.1H...,..r....
    0040 - 19 59 31 95 1b c2 aa db-de 92 ff b8 cf 68 02 07   .Y1..........h..
    0050 - 3a 0a d2 e9 8b 43 f6 a8-72 8b 1c 1d 2b 5c f6 aa   :....C..r...+\..
    0060 - 2d d8 3a 07 6d 30 80 49-8d 1a 54 49 bd ac b1 9d   -.:.m0.I..TI....
    0070 - 30 7c eb 4d 3c 25 e4 74-d7 b9 c9 2b 0c 53 54 85   0|.M<%.t...+.ST.
    0080 - da e6 c2 2c ca 3a c8 61-75 4b d4 b4 43 53 14 5e   ...,.:.auK..CS.^
    0090 - a8 6e 81 e7 93 fd ab 52-86 b6 59 82 96 e8 50 03   .n.....R..Y...P.
    00a0 - c4 81 b5 83 8f f3 57 38-3f ab d6 45 b6 1f ca 7f   ......W8?..E....
    00b0 - d4 20 16 53 a1 8a 64 79-5c 99 f4 4a 14 d7 f4 37   . .S..dy\..J...7
    00c0 - 9a 80 54 5c 78 92 b2 32-5d a4 97 b1 c7 80 aa 3d   ..T\x..2]......=
    00d0 - 56 09 6c b4 90 21 3a f8-52 35 0c 21 b7 71 d5 20   V.l..!:.R5.!.q.

    Start Time: 1792937454
    Timeout   : 7200 (sec)
    Verify return code: 18 (self-signed certificate)
    Extended master secret: no
    Max Early Data: 0
---
read R BLOCK
{Password for bandit15}
Correct!
{Password for bandit16}
```

</details>

### Method 2: Pipe the password with `echo` (recommended)
Typing into an open session works, but a single command is faster and repeatable. `echo` sends the password into `openssl` through a pipe. Here `-ign_eof` is required: `echo` ends its output straight away, and without the flag `s_client` would close the connection before the server replied.

```bash
bandit15@bandit:~$ echo {Password for bandit15} | openssl s_client -connect localhost:30001 -ign_eof
Connecting to 127.0.0.1
CONNECTED(00000003)
depth=0 CN=SnakeOil
verify error:num=18:self-signed certificate
...
read R BLOCK
Correct!
{Password for bandit16}
```

<details>
<summary>Full output (Method 2)</summary>

```bash
ssh bandit15@bandit.labs.overthewire.org -p 2220
Password: {Password for bandit15}

bandit15@bandit:~$ echo {Password for bandit15} | openssl s_client -connect localhost:30001 -ign_eof
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
    Session-ID: 0E07AF702A60C4DB6CEBD6236A418B1EDEF192D2EB0431FB79E06CD9E6951A57
    Session-ID-ctx:
    Resumption PSK: B073112B9D4FA2BBE97FDD7D5F21930BAB2F80D688DC3BBB9B6982DBA7961461A4920FAB965C294C3C860B1791BE7183
    PSK identity: None
    PSK identity hint: None
    SRP username: None
    TLS session ticket lifetime hint: 300 (seconds)
    TLS session ticket:
    0000 - 9f 84 9b b2 e7 7a dc 13-91 92 5f ca 33 f3 70 43   .....z...._.3.pC
    0010 - 3f 13 30 e2 5b 1b cc e4-b3 7b 8d b6 8a 9d bc 23   ?.0.[....{.....#
    0020 - 62 ea 88 ce be f2 b5 cb-db 67 12 ed d0 e5 4b c9   b........g....K.
    0030 - 65 43 46 d3 24 b5 f5 db-db 41 d5 eb e8 e4 0e bd   eCF.$....A......
    0040 - 30 0c b4 e5 b2 09 06 ed-ba 4c da 27 82 ea 38 1c   0........L.'..8.
    0050 - 5b 59 7a 12 35 0f c6 1b-b0 d8 15 40 39 92 17 b0   [Yz.5......@9...
    0060 - 42 30 d7 d6 37 34 fa 90-8b 27 44 83 2f 71 8e 56   B0..74...'D./q.V
    0070 - 30 bc 73 4c e1 e5 29 5d-4f f4 8d 8d 69 f1 ad 50   0.sL..)]O...i..P
    0080 - fb 5c 88 bd 64 b6 aa fb-03 8c 99 71 94 31 14 22   .\..d......q.1."
    0090 - 26 90 03 36 85 66 e6 1f-df 29 13 01 fb ea f7 f4   &..6.f...)......
    00a0 - 62 07 0e 9d 07 29 56 9c-68 9f 3f e9 5a 71 bf c6   b....)V.h.?.Zq..
    00b0 - 9f 47 6f 7d ad 63 03 78-55 76 ff d7 47 41 9f 6b   .Go}.c.xUv..GA.k
    00c0 - 09 4b df 33 06 02 ce 1e-e9 c8 60 ab 1e d6 4f b8   .K.3......`...O.
    00d0 - 99 7b 21 61 bf d3 f3 4c-65 7c 23 6b 3b ba 01 d3   .{!a...Le|#k;...

    Start Time: 1792937526
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
    Session-ID: 12D725A9B79D3662268D10F6CAA219D0AA76016C8BD739B3167F97B83B20C6CC
    Session-ID-ctx:
    Resumption PSK: B33C3DCEA068A218987CA8955F5B3A4E617C0F1EBA4993694D0B2B2C5070D3C33B3E19266B79B2107F20CD10E611569D
    PSK identity: None
    PSK identity hint: None
    SRP username: None
    TLS session ticket lifetime hint: 300 (seconds)
    TLS session ticket:
    0000 - 9f 84 9b b2 e7 7a dc 13-91 92 5f ca 33 f3 70 43   .....z...._.3.pC
    0010 - 0e 87 8a c7 c0 c3 5f 1f-2d ce 0b 0e b3 a5 a1 11   ......_.-.......
    0020 - e6 cf b6 19 85 89 ce 9b-2b 1a c0 be 7e 94 13 0f   ........+...~...
    0030 - e4 86 5a 06 98 cb b0 69-d9 21 3b 81 7e dd 2f 92   ..Z....i.!;.~./.
    0040 - bd 2c ac aa 43 91 9d 9c-56 fc 13 2b 5e 8a 03 01   .,..C...V..+^...
    0050 - ab 59 6d 9f 2f d2 e7 10-a9 40 0d 73 14 5e 2b 54   .Ym./....@.s.^+T
    0060 - 10 15 11 9a e8 a1 61 cb-83 e4 7f 8c e4 52 59 69   ......a......RYi
    0070 - 9e 4d 2e 16 db 36 b3 5e-99 db 7e 33 58 e7 17 ac   .M...6.^..~3X...
    0080 - 9a cf a1 6d 3c 29 cd 48-b5 7b 0a 02 6b 9b 78 5a   ...m<).H.{..k.xZ
    0090 - 4f 7a 78 88 f1 01 5b 7d-b9 77 be 15 16 d6 bd 09   Ozx...[}.w......
    00a0 - 08 fb 5c e3 48 6c 06 da-c2 2f 07 bb ec b8 4e eb   ..\.Hl.../....N.
    00b0 - 8b a3 98 a8 ea 63 45 ba-f6 97 b0 66 09 28 cf fb   .....cE....f.(..
    00c0 - a6 df 9e 26 0f 54 41 60-1f ce d4 83 0b a7 ed a5   ...&.TA`........
    00d0 - 6f 83 83 5d 08 f3 51 01-da fa 6e ee 86 b9 d8 72   o..]..Q...n....r

    Start Time: 1792937526
    Timeout   : 7200 (sec)
    Verify return code: 18 (self-signed certificate)
    Extended master secret: no
    Max Early Data: 0
---
read R BLOCK
Correct!
{Password for bandit16}
```

</details>

### Which method is better?
| | Method 1: Interactive | Method 2: Piped |
|---|---|---|
| Steps | Connect, wait, paste the password | One command |
| Needs `-ign_eof` | No, the session stays open while I type | Yes, or the connection closes before the reply |
| Repeatable / scriptable | No | Yes |
| Catch | A typed line starting with `R` or `Q` triggers a renegotiation or quits the session | The password is saved in shell history (`~/.bash_history`) |

Method 2 is the better choice: it is one repeatable command and shows exactly what is sent.

### Winning Command
This version improves on Method 2 in two ways. It reads the password from `/etc/bandit_pass/bandit15`, so it never appears in shell history. It also uses `-quiet`, which hides the certificate and session details and turns on `-ign_eof` automatically, so the reply is easy to spot.

```bash
bandit15@bandit:~$ cat /etc/bandit_pass/bandit15 | openssl s_client -connect localhost:30001 -quiet
```

## Flag
`Password for bandit16`

## Lessons learned
- Plain-text tools like `nc` cannot talk to an encrypted service: use `openssl s_client` (or `ncat --ssl`) when a port expects SSL/TLS.
- `-ign_eof` matters whenever input is piped in: without it, the connection closes as soon as the input ends, before the server replies.
- Read the handshake output: it shows the TLS version, the cipher and the certificate, which is useful when checking a real service's configuration.
- A self-signed certificate is fine in a lab but means nobody vouched for the server: in the real world, treat it as a warning sign.
- Avoid typing passwords on the command line: they end up in shell history. Read them from a file instead.

## References
- [Transport Layer Security](https://en.wikipedia.org/wiki/Transport_Layer_Security)
- [openssl s_client](https://docs.openssl.org/master/man1/openssl-s_client/)
- [Self-signed certificate](https://en.wikipedia.org/wiki/Self-signed_certificate)
- [Public key certificate](https://en.wikipedia.org/wiki/Public_key_certificate)
