# Okta

Okta serves as the Identity Provider for cairahq.com. All authentication, MFA enforcement, user lifecycle management, and access policy is owned here.

## Tenant Details

| Setting | Value |
|---------|-------|
| Plan | Okta Integrator Free Plan |
| Org URL | https://integrator-7484148.okta.com |
| Custom domain | https://okta.cairahq.com |
| Admin console | https://okta.cairahq.com/admin |

## What's Configured

| Area | Status | Reference |
|------|--------|-----------|
| SAML SSO → Google Workspace | ✅ Working | [saml-sso.md](./config-reference/saml-sso.md) |
| SCIM Provisioning → Google Workspace | ⚠️ Configured | [scim-provisioning.md](./config-reference/scim-provisioning.md) |
| MFA Enrollment Policy | ✅ Configured | [mfa-enrollment-policy.md](./config-reference/mfa-enrollment-policy.md) |
| Password Policy | ✅ Configured | [password-policy.md](./config-reference/password-policy.md) |
| Session Policy | ✅ Configured | [session-policy.md](./config-reference/session-policy.md) |
| Custom Domain | ✅ Live | — |
| Okta Workflows | 🔲 In progress | — |
| Conditional Access | 🔲 Planned | — |

## Custom Domain

The Okta tenant is accessible at `okta.cairahq.com` — a custom domain configured via Okta Brands using an Okta-managed TLS certificate provisioned through Let's Encrypt.

DNS configuration in GoDaddy:

| Type | Name | Value |
|------|------|-------|
| CNAME | okta | integrator-7484148.customdomains.okta.com |
| TXT | _acme-challenge.okta | [verification token] |

## Groups

| Group | Members | Purpose |
|-------|---------|---------|
| Okta Administrators | admin account | Okta-managed system group — all org admins |
| Google Workspace | neil@cairahq.com | App assignment group for Google Workspace SSO and SCIM |

## Key Design Decisions

**RPID field required for new-style Google SSO profiles.** The pre-built Okta Google Workspace integration defaults to a legacy SAML assertion format (`google.com/a/` issuer, `www.google.com/a//acs` recipient) that is incompatible with Google's newer SSO profile endpoint (`accounts.google.com/samlrp/`). Setting the RPID field to the Google SSO profile's unique ID switches Okta to the correct assertion format. This also requires updating the IDP Entity ID in the Google SSO profile to match Okta's new issuer format (`http://www.okta.com/{appId}`).

**Group-based policy targeting requires a paid plan.** The Integrator Free Plan does not support group-based Global Session Policy rules. In production, admin accounts would be scoped to a stricter session policy (shorter idle timeout, MFA on every login) via a separate policy targeting the Okta Administrators group. This is documented as a known limitation — the architecture is correct, the enforcement granularity requires a paid tier.

---

*Part of [Caira HQ — Platform](../../README.md) · Neil Chavez · Creator of things.*
