# Session Policy

## Overview

The Global Session Policy defines how long an authenticated Okta session remains valid. The policy is designed to balance security with usability. Re-authenticating once every two weeks is a reasonable ask for standard users when MFA, breach detection, and (in production) device trust are active as compensating controls.

## Policy Settings

### Global Session Policy — Default Rule

| Setting | Value |
|---------|-------|
| Applies to | Everyone |
| Maximum session lifetime | 14 days |
| Maximum idle time | 14 days |
| Persist cookies across browser sessions | Disabled |
| Prompt for password | After 14 days |
| Prompt for MFA | After 14 days |

## Behavior

**Same browser, active session:**
User authenticates once. SSO handles all subsequent app access within the session window. No re-prompts for password or MFA.

**Same browser, session expired:**
User is prompted for password + MFA. Full re-authentication required.

**New browser or incognito window:**
No persistent session — user prompted for password + MFA. Mirrors expected behavior for a new device or context.

**New device:**
Full re-authentication required. No session persistence across devices.

## Why 14 Days

Session lifetime is one layer in a defense-in-depth stack. The 14-day window is defensible given the full control set:

| Control | Status |
|---------|--------|
| MFA required (Okta Verify) | ✅ Active |
| Breach detection | ✅ Active |
| Common password blocking | ✅ Active |
| Session cookies not persisted across browser sessions | ✅ Active |
| (Production) Device trust via MDM | Would be active |
| (Production) Conditional Access / risk-based step-up | Planned |

With these controls in place, a 14-day session presents an acceptable risk profile for standard users. The primary residual risk — stolen session cookie — is mitigated by disabling cross-browser session persistence and (in production) enforcing device trust.

**Industry reference:** Google Workspace's own default session lifetime for Workspace users is 14 days. Okta's recommended baseline for standard users is 7–30 days.

## Production Note — Group-Based Policy Targeting

The Okta Integrator Free Plan does not support group-based Global Session Policy rules. In production, the policy would be tiered:

| User Tier | Max Session | Idle Timeout | MFA Frequency |
|-----------|-------------|--------------|---------------|
| Standard users | 14 days | 14 days | 14 days |
| Privileged / admin | 8 hours | 30 minutes | Every login |
| Service accounts | N/A | N/A | N/A |

Group-based targeting requires Okta Identity Engine on a paid plan. This is a documented lab constraint, the enforcement granularity requires a paid tier.

---

*Part of [Caira HQ — Platform](../../../README.md) · Neil Chavez · Creator of things.*
