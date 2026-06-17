# Google Workspace

Google Workspace serves as the primary collaboration platform and the first Service Provider federated to Okta in the cairahq.com environment.

## Tenant Details

| Setting | Value |
|---------|-------|
| Plan | Business Starter |
| Primary domain | cairahq.com |
| Admin account | admin@cairahq.com |
| User accounts | neil@cairahq.com (+ additional via SCIM) |

## What's Configured

| Area | Status | Reference |
|------|--------|-----------|
| Domain verification | ✅ Complete | — |
| MX records | ✅ Active | — |
| SAML SSO (Okta as IdP) | ✅ Working | [saml-profile.md](./config-reference/saml-profile.md) |
| Vanity URLs | ✅ Live | [vanity-urls.md](./config-reference/vanity-urls.md) |
| 2FA enforced tenant-wide | ✅ Active | — |
| SCIM provisioning (from Okta) | ⚠️ Configured | See SCIM doc |
| Caira HQ branding / logo | 🔲 Planned | — |

## Service URLs

| Service | Custom URL | Default URL |
|---------|-----------|-------------|
| Gmail | mail.cairahq.com | mail.google.com/a/cairahq.com |
| Drive | drive.cairahq.com | drive.google.com/a/cairahq.com |
| Calendar | calendar.cairahq.com | calendar.google.com/a/cairahq.com |

## Key Design Decisions

**Business Starter for user accounts, admin account on same plan.** The original plan was to downgrade the admin account to Essentials Starter (free) to save cost. Google blocked the downgrade path in the Google Admin console. Since the admin account is used purely for admin tasks with no Gmail requirement, this is a minor cost consideration for now. Revisiting when the trial period ends.

**SSO enforced at the org unit level.** The Okta SAML profile is assigned to the Caira HQ top-level OU, applying SSO to all standard users. Super admin accounts are exempt from third-party SSO by Google design. `admin@cairahq.com` always authenticates directly with Google.

**SCIM provisioning over manual user creation.** Users are never created manually in Google Workspace. All accounts originate in Okta and are pushed to Google via SCIM. This ensures the IdP (Okta) is always the source of truth for user identity.

---

*Part of [Caira HQ — Platform](../../README.md) · Neil Chavez · Creator of things.*
