# Password Policy

## Overview

Password policy follows NIST 800-63B guidance, prioritizing length and breach detection over arbitrary complexity requirements and rotation schedules.

## Policy Settings

### Password Requirements

| Setting | Value | Rationale |
|---------|-------|-----------|
| Minimum length | 8 characters | NIST minimum — lab environment with 2 trusted users |
| Lowercase required | No | NIST: complexity rules are counterproductive |
| Uppercase required | No | NIST: complexity rules are counterproductive |
| Number required | No | NIST: complexity rules are counterproductive |
| Symbol required | No | NIST: complexity rules are counterproductive |
| Does not contain username | Yes | Prevents trivially guessable passwords |
| Does not contain first name | Yes | Prevents trivially guessable passwords |
| Does not contain last name | Yes | Prevents trivially guessable passwords |
| Common password check | Enabled | Blocks passwords from known breach lists |

### Password Security

| Setting | Value | Rationale |
|---------|-------|-----------|
| Password expiration | Never | NIST 800-63B: arbitrary rotation increases risk by encouraging weak patterns |
| Password history | Last 5 | Prevents immediate reuse after a voluntary reset |
| Minimum password age | Not set | No restriction on voluntary resets |
| Lockout threshold | 10 attempts | Balanced, not aggressive enough to cause self-lockout |
| Auto-unlock | 15 minutes | Avoids permanent lockout requiring admin intervention |
| Show lockout failures | Enabled | Transparency, user knows when someone is attempting their account |
| Send lockout email | Enabled | Proactive notification of potential brute force attempts |

## NIST 800-63B Alignment

This policy reflects the current NIST guidance on memorized secrets:

**What NIST says:**
- Minimum 8 characters; longer is better
- No mandatory complexity rules — they produce predictable patterns (`Password1!`)
- No arbitrary expiration — users respond by making passwords weaker and more predictable
- Check against breach lists (Have I Been Pwned corpus or equivalent)
- Allow all printable ASCII characters

**What NIST explicitly discourages:**
- Mandatory character class mixing
- Periodic expiration without evidence of compromise
- Password hints or knowledge-based authentication

**The compensating control:** No password expiration is defensible only when MFA is enforced. Okta Verify is required for all users. A compromised password alone cannot result in account access without the enrolled device.

## Production Note

In a production environment with tiered user populations, a separate stricter password policy would apply to privileged accounts: longer minimum length (16+ characters), potentially enforced passphrase patterns for service accounts. The Okta Integrator Free Plan supports multiple password policies but group-based targeting of those policies requires Identity Engine features available on paid plans only.

---

*Part of [Caira HQ — Platform](../../../README.md) · Neil Chavez · Creator of things.*
