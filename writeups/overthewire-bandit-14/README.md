# OverTheWire: Bandit Lvl 14 (Linux): Bandit (2026)

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
| Tags       | Linux, Networking, Netcat |

## TL;DR
Talking to a local network service: a program is listening on TCP port 30000 of the same machine, so `nc localhost 30000` opens a raw connection to it, and sending the current password returns the next one.

## Challenge
> The password for the next level can be retrieved by submitting the password of the current level to port 30000 on localhost.

- Files: None for this level
- Service: `bandit14@bandit.labs.overthewire.org:2220` (online)

## First look
I logged in as `bandit14` with the password that I had obtained from the previous level `bandit13`. This challenge asks me to submit it, so I first needed to find it in the current server. Every Bandit password is stored in `/etc/bandit_pass/`, and each file can only be read by its own user.

Next, I checked that something was really listening on port 30000. `nc` initiates TCP connections, send UDP packets and also listen on arbitrary TCP and UDP ports:
- `-z` only checks whether the connection opens, without sending any data.
- `-v` prints whether it worked.

```bash
ssh bandit14@bandit.labs.overthewire.org -p 2220
{Password for bandit14}

bandit14@bandit:~$ ls -A
.bash_logout  .bashrc  .profile
bandit14@bandit:~$ cat /etc/bandit_pass/bandit14
{Password for bandit14}
bandit14@bandit:~$ nc -zv localhost 30000
Connection to localhost (127.0.0.1) 30000 port [tcp/*] succeeded!
```

### Theory
- **IP address:** the address of a machine on a network.
- **localhost:** a name for "this same machine". It resolves to `127.0.0.1`, so the traffic never leaves the server.
- **Port:** a number from 0 to 65535 that picks which program on the machine receives the traffic. One machine can run many services, each on its own port (SSH on 22 or 2220, HTTP on 80, this challenge on 30000).
- **`nc` (netcat):** opens a plain TCP or UDP connection to a host and port. Whatever I type is sent to the service, and whatever the service replies is printed in my terminal. It is often called the "Swiss army knife" of networking.

## Dead ends
- None

## Solution
### Use `nc` to `localhost` via port 30000
The service on port 30000 is not a website or a login prompt: it simply reads one line and replies. `nc` is the right tool because it sends exactly what I type over a raw TCP connection, with no protocol on top.

I connected with `nc localhost 30000`, pasted the password for `bandit14` and pressed Enter. The service replied `Correct!` followed by the password for `bandit15`.

```bash
# nc to localhost via port 30000
bandit14@bandit:~$ nc localhost 30000
{Password for bandit14}
Correct!
{Password for bandit15}
```

### Winning Command
Instead of pasting the password by hand, I can pipe it straight from the password file into `nc`, which solves the level in one command.

```bash
# Read the current password and submit it in one go
bandit14@bandit:~$ cat /etc/bandit_pass/bandit14 | nc localhost 30000
Correct!
{Password for bandit15}
```

## Flag
`Password for bandit15`

## Lessons learned
- Check which ports are open and listening with either `nc` or `ss -tln` before trying to connect.
- Learn `nc` and its usages: it can send data to, and read replies from, any TCP or UDP service.
- Understand that `localhost` is the machine itself, so a service can be reachable from inside the server even when it is not exposed to the internet.

## References
- [nc](https://man.archlinux.org/man/nc.1.en)
- [IP Address](https://en.wikipedia.org/wiki/IP_address)
- [Localhost](https://en.wikipedia.org/wiki/Localhost)
- [Port (computer_networking)](https://en.wikipedia.org/wiki/Port_(computer_networking))
- [IP Addresses](https://computer.howstuffworks.com/web-server5.htm)
- [Ports](https://computer.howstuffworks.com/web-server8.htm)
- [How the Internet works in 5 minutes](https://www.youtube.com/watch?v=7_LPdttKXPc)
