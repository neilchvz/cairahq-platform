# SAML SSO — Okta → Google Workspace

## Overview

Google Workspace is configured as a SAML 2.0 Service Provider with Okta as the Identity Provider. Authentication for all cairahq.com Google Workspace users flows through Okta — no direct Google password authentication for standard users.

## Configuration

### Okta Side

| Setting | Value |
|---------|-------|
| App integration | Google Workspace (pre-built Okta catalog) |
| Sign-on method | SAML 2.0 |
| Application username format | Email |
| RPID | 01oiipzl4051y4g |
| Sign on URL | https://integrator-7484148.okta.com/app/google/exk13x3vp38bvOb3l698/sso/saml |
| Sign out URL | https://integrator-7484148.okta.com |
| Issuer | http://www.okta.com/exk13x3vp38bvOb3l698 |

### Google Workspace Side

| Setting | Value |
|---------|-------|
| SSO profile name | Okta |
| IDP entity ID | http://www.okta.com/exk13x3vp38bvOb3l698 |
| Sign-in page URL | https://integrator-7484148.okta.com/app/google/exk13x3vp38bvOb3l698/sso/saml |
| Sign-out page URL | https://integrator-7484148.okta.com |
| Autofill email | Send email address in the URL as the LoginHint parameter |
| Profile assignment | Caira HQ org unit — Okta SAML |

## Authentication Flow

```
User navigates to mail.cairahq.com or any Google Workspace service
              ↓
Google evaluates SSO profile assignment for cairahq.com org unit
              ↓
Google redirects to Okta Sign-on URL with LoginHint (user email)
              ↓
Okta presents login page pre-filled with user email
              ↓
User authenticates (password + Okta Verify MFA)
              ↓
Okta generates signed SAML assertion and posts to Google ACS URL
              ↓
Google validates assertion signature against uploaded certificate
              ↓
User lands in Google Workspace service
```

## Key Fix — RPID and IDP Entity ID

The pre-built Okta Google Workspace integration ships with a legacy SAML configuration that produces an incorrect assertion format when used with Google's newer SSO profile system:

**Incorrect (default):**
- Issuer: `google.com/a/` (domain missing)
- Recipient: `https://www.google.com/a//acs` (domain missing, double slash)

**Correct (after RPID fix):**
- Issuer: `http://www.okta.com/{appId}`
- Recipient: `https://accounts.google.com/samlrp/{RPID}/acs`

**Fix:** Set the RPID field in Okta's Advanced Sign-on Settings to the unique ID from the Google SSO profile Entity ID (`https://accounts.google.com/samlrp/{RPID}`). Then update the IDP Entity ID in the Google SSO profile to match Okta's new issuer format.

This is not documented in Okta's standard Google Workspace setup instructions and requires trial and error or SAML assertion inspection via the Preview SAML tool to diagnose.

## Super Admin SSO Exemption

Google Workspace super admin accounts always authenticate directly with Google credentials — they are never redirected to a third-party SSO provider, regardless of what SSO policies are configured in the organization. This is a hard behavioral constraint enforced by Google, not a side effect of policy assignment. (https://support.google.com/a/answer/6341409) The intent is to ensure admins retain access to the Google Admin console even if the IdP goes down or is compromised. (https://support.google.com/a/answer/9464354)

For this lab, `admin@cairahq.com` authenticates directly with Google. Standard provisioned users (neil@cairahq.com, etc.) authenticate through Okta SSO.

---

*Part of [Caira HQ — Platform](../../../README.md) · Neil Chavez · Creator of things.*
