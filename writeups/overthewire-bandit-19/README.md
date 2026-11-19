# OverTheWire: Bandit Lvl 19 (Linux): Bandit (2026)

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
Privilege escalation through a setuid binary: `bandit20-do` runs any command as its owner, bandit20, so `./bandit20-do cat /etc/bandit_pass/bandit20` reads a password the current user cannot.

## Challenge
> To gain access to the next level, you should use the setuid binary in the homedirectory. Execute it without arguments to find out how to use it. The password for this level can be found in the usual place (/etc/bandit_pass), after you have used the setuid binary.

- Files: `{filename}` (sha256: `{hash}`)
- Service: `{chal.example.lab:port}` (event infrastructure, now offline)

## First look
{What you checked first and why. Paste key output as text, trimmed.}

```
{command}
{trimmed output}
```

## Dead ends
- {Idea}: {what happened} -> {why it didn't work}
- {Idea}: {what happened} -> {why it didn't work}

## Solution
### Step 1: {what this step achieves}
{Why you took this step, what you expected, what you saw.}

### Step 2: {what this step achieves}
{Reasoning first, then the minimum command or code.}

```{language}
# solve script: minimal, commented, no hardcoded secrets
{code}
```

![{Describe what the screenshot shows}](img/{file}.png)

## Flag
`CTF7{...}`  {or: "Omitted at the organizer's request."}

## Lessons learned
- {What you'd check first next time}
- {Tool or technique you learned}
- {What made the challenge click}

## References
- {Docs, papers, other writeups that helped, with links}
- Thanks to {author} for the challenge and {teammates} for {help}.