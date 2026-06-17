# SCIM Provisioning — Okta → Google Workspace

## Overview

User provisioning from Okta to Google Workspace is handled via SCIM 2.0. Users created and assigned in Okta are automatically provisioned as Google Workspace accounts, no manual account creation required.

## Configuration

### Okta Provisioning Settings

| Setting | Value |
|---------|-------|
| API Integration | Authenticated via Google OAuth |
| Create Users | Enabled |
| Update User Attributes | Enabled |
| Deactivate Users | Enabled |
| Sync Password | Disabled — users authenticate via Okta SSO, not Google password |
| Import Groups | Enabled |

### Group Assignment Settings

| Setting | Value |
|---------|-------|
| Assignment group | Google Workspace |
| Organizational unit | Caira HQ (top level) |
| Deactivation behavior | Do not suspend user |
| License | Google Workspace Business Starter |
| Admin roles | None |

### Attribute Mapping

Okta pushes the following attributes to Google Workspace on user creation:

| Okta Attribute | Google Attribute |
|---------------|-----------------|
| userName (email) | Primary email |
| user.firstName | First name |
| user.lastName | Last name |
| user.title | Job title |
| user.department | Department |
| user.manager | Manager |

## Provisioning Flow

```
User created in Okta with cairahq.com UPN
              ↓
User assigned to Google Workspace group in Okta
              ↓
Okta SCIM connector calls Google Workspace Admin SDK API
              ↓
Google creates user account with mapped attributes
              ↓
Business Starter license assigned automatically
              ↓
User placed in Caira HQ top-level OU
              ↓
User inherits Okta SAML SSO profile from OU assignment
              ↓
User can authenticate via okta.cairahq.com
```

## Known Issue — New Tenant Account Suspension

> ⚠️ **Google new tenant abuse detection**
>
> On newly created Google Workspace tenants, accounts provisioned via SCIM API are automatically suspended with the reason "Unverified sign-in." This is triggered by Google's automated abuse detection systems, which flag API-provisioned accounts on new domains as potentially suspicious.
>
> **Root cause:** New tenant trust score is low. Google's systems treat rapid programmatic account creation as a potential abuse signal, even for a single account.
>
> **Symptoms:**
> - Provisioned user appears in Google Admin console as suspended
> - Reinstate button is greyed out — cannot be manually restored via UI
> - Standard Google verification flow (`accounts.google.com`) conflicts with SSO enforcement
>
> **Resolution for this lab:** Temporarily move the affected user to an OU with SSO disabled, complete Google's identity verification, then move back to the main OU. This is a one-time step per affected account.
>
> **Production recommendation:** This issue resolves itself as tenant trust builds over time (typically 2-3 days of normal admin activity). In a production environment with an established tenant, this does not occur. The SCIM configuration itself is correct — the suspension is a Google new tenant behavior, not a provisioning misconfiguration.

## Deprovisioning

When a user is unassigned from the Google Workspace app in Okta or deactivated in Okta:

- Google Workspace account is suspended (not deleted) — preserving data
- License is removed
- User can no longer authenticate via Okta SSO

Hard deletion of the Google account must be done manually in the Google Admin console if required.

---

*Part of [Caira HQ — Platform](../../../README.md) · Neil Chavez · Creator of things.*
