# Known Limitations — Google Workspace

This document captures known limitations encountered during the cairahq.com Google Workspace setup: both platform constraints and new tenant behavior. Each limitation includes the root cause and the production recommendation where applicable.

---

## 1. New Tenant Account Suspension (SCIM Provisioning)

**What happens:** User accounts provisioned via the Okta SCIM API on a newly created Google Workspace tenant are automatically suspended with the reason "Unverified sign-in." The reinstate button in the Admin console is greyed out and cannot be used.

**Root cause:** Google's automated abuse detection systems flag API-provisioned accounts on new, low-trust domains as potentially suspicious. This is designed to prevent spam and phishing infrastructure being built on new Google Workspace tenants.

**Impact:** SCIM provisioning is configured correctly. The suspension is not a misconfiguration. However it prevents newly provisioned users from completing SSO authentication until resolved.

**Workaround for new tenants:**
1. Create a temporary OU with SSO disabled
2. Move the suspended user into that OU
3. Have the user complete Google's identity verification at accounts.google.com
4. Move the user back to the main OU. SSO re-applies

**Production behavior:** This issue resolves itself as tenant trust builds over time (typically 2-3 days of normal admin activity on an established domain). Production tenants with established history do not experience this behavior.

**Google support response:** Front-line support (tested twice) was unable to resolve this via the Admin console and suggested slowing down provisioning rate, which is irrelevant for single-user provisioning. The issue is a new tenant trust score problem, not a rate limit problem.

---

## 2. Vanity URL HTTPS Support

**What happens:** Custom service URLs (`mail.cairahq.com`, `drive.cairahq.com`, `calendar.cairahq.com`) are served over HTTP only. Direct navigation triggers a browser security warning.

**Root cause:** Google's custom URL service (`ghs.googlehosted.com`) does not provision SSL certificates for customer-owned subdomains. This is a documented platform limitation explicitly stated in Google's own documentation.

**Impact:** Cosmetic, the security warning appears only on the initial redirect hop. After Google receives the request, the connection switches to HTTPS automatically. No credentials or data are transmitted over the unencrypted hop.

**Production fix:** Cloudflare free plan proxy. See [vanity-urls.md](./vanity-urls.md) for full implementation details.

---

## 3. Super Admin SSO Exemption

**What happens:** The `admin@cairahq.com` super admin account cannot be forced through Okta SSO. It always authenticates directly with Google credentials.

**Root cause:** Google intentionally exempts super admin accounts from third-party SSO as a safety measure. If SSO breaks, admins retain access to the Admin console via direct Google login.

**Impact:** The admin account bypasses Okta's MFA enforcement. Mitigated by Google's own 2FA enforcement (configured tenant-wide) and the fact that the admin account is not used for day-to-day work.

**Production recommendation:** Maintain a dedicated break-glass super admin account with a strong password and hardware security key enrolled in Google's own 2FA. Never use the super admin account for routine tasks: create delegated admin roles for operational work.

---

## 4. Group-Based Session Policy (Okta Free Plan)

**What happens:** The Okta Integrator Free Plan does not support group-based Global Session Policy rules. A single session policy applies to all users regardless of role.

**Root cause:** Group-based policy targeting requires Okta Identity Engine features available only on paid plans.

**Impact:** Admin accounts and standard user accounts share the same 14-day session policy. In production, admin accounts should have a much stricter policy: shorter idle timeout, MFA on every login.

**Production fix:** Paid Okta plan with Identity Engine. Create separate session policy rules targeting the Okta Administrators group with strict timeouts.

---

*Part of [Caira HQ — Platform](../../../README.md) · Neil Chavez · Creator of things.*
