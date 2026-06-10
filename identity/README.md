# Identity Layer

The identity layer is the control plane for cairahq.com. Every user, every app, and every access decision flows through here.

## Architecture

Okta serves as the Identity Provider (IdP) for the entire org. Google Workspace is the first Service Provider (SP) federated to Okta via SAML 2.0. Users are created and managed in Okta — Google Workspace accounts are provisioned automatically via SCIM, not created manually.

```
User attempts to access Google Workspace
              ↓
Google redirects to Okta (SAML SP-initiated flow)
              ↓
Okta authenticates user (password + MFA)
              ↓
Okta sends signed SAML assertion to Google
              ↓
Google grants access
```

This means:
- No Google passwords for standard users — Okta owns authentication
- MFA is enforced at the IdP layer — Google never sees an unauthenticated request
- Deprovisioning in Okta automatically suspends the Google Workspace account via SCIM

## Components

| Component | Documentation |
|-----------|--------------|
| Okta | [okta/README.md](./okta/README.md) |
| Google Workspace | [google-workspace/README.md](./google-workspace/README.md) |

## Security Posture

All identity policies follow NIST 800-63B principles:

- **No password expiration** — arbitrary rotation trains users toward predictable patterns and provides no measurable security benefit when MFA is enforced
- **Length over complexity** — 8 character minimum (lab), no mandatory character class requirements
- **MFA required** — Okta Verify as primary factor, email as fallback
- **Breach detection enabled** — common and compromised passwords blocked at enrollment
- **Session lifetime** — 14 days with 14 day idle timeout, aligned to a standard workday usage pattern with MDM and MFA as compensating controls
- **Lockout policy** — 10 attempts, 15 minute auto-unlock, lockout notification to user

The rationale: session lifetime is one layer in a defense-in-depth stack. With MFA required, breach detection active, and (in a production environment) device trust enforced via MDM, a 14-day session presents an acceptable risk profile for standard users. Privileged accounts would be scoped to a stricter policy on a paid Okta plan that supports group-based session policy targeting.

---

*Part of [Caira HQ — Platform](../README.md) · Neil Chavez · Creator of things.*
