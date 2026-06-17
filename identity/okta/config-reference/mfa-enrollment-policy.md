# MFA Enrollment Policy

## Overview

MFA enrollment is enforced org-wide via Okta's default enrollment policy. All users are required to enroll in Okta Verify before completing authentication. Email is available as an optional fallback factor.

## Authenticators

| Authenticator | Factor Type | Characteristics | Enrollment |
|--------------|-------------|-----------------|------------|
| Okta Verify | Possession + Biometric | Device-bound, hardware protected, phishing resistant (FastPass) | Required |
| Password | Knowledge | — | Required |
| Email | Possession | — | Optional |

## Enrollment Policy — Default Policy

| Setting | Value |
|---------|-------|
| Assigned to | Everyone |
| Okta Verify | Required |
| Grace period | 7 skips before enrollment is forced |
| Password | Required |
| Email | Optional |

## Why Okta Verify as Primary

Okta Verify satisfies multiple factor characteristics simultaneously:
- **Possession** — bound to a specific enrolled device
- **Biometric** (where device supports it) — Touch ID, Face ID as unlock
- **Phishing resistant** via Okta FastPass — no OTP codes to intercept

This makes it significantly stronger than SMS OTP or TOTP apps while remaining user-friendly.

## SMS / Phone Authenticator

SMS is intentionally excluded. On the Okta Integrator Free Plan, SMS requires a third-party telephony provider (e.g. Twilio) configured via an Inline Hook, adding unnecessary infrastructure complexity for a 2-person lab. More importantly, SMS is the weakest possession factor and is subject to SIM swapping attacks. NIST 800-63B deprecated SMS as a primary authenticator.

In a production environment on a paid Okta plan, SMS would be available as a last-resort fallback but not as a primary factor.

## Grace Period

The 7-skip grace period on Okta Verify enrollment gives new users flexibility to complete enrollment at their own pace without being immediately locked out. In a production security-conscious environment this would be reduced to 0, forcing immediate enrollment on first login.

---

*Part of [Caira HQ — Platform](../../../README.md) · Neil Chavez · Creator of things.*
