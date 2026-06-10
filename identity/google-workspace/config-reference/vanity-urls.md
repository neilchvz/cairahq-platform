# Vanity URLs — Google Workspace

## Overview

Custom subdomains are configured for core Google Workspace services, making them accessible at branded cairahq.com URLs instead of the default Google URLs.

## DNS Configuration (GoDaddy)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | mail | ghs.googlehosted.com | 1 Hour |
| CNAME | drive | ghs.googlehosted.com | 1 Hour |
| CNAME | calendar | ghs.googlehosted.com | 1 Hour |

## Google Admin Console Configuration

Configured under `Account → Account settings → Custom URLs`:

| Service | Custom URL | Status |
|---------|-----------|--------|
| Gmail | mail.cairahq.com | ✅ Active |
| Drive and Docs | drive.cairahq.com | ✅ Active |
| Calendar | calendar.cairahq.com | ✅ Active |

## Known Limitation — HTTPS

Google's custom URL service (`ghs.googlehosted.com`) does not support HTTPS for custom subdomains. Navigating directly to `mail.cairahq.com` triggers a browser security warning about an insecure connection.

**Behavior:**
- Direct navigation to `mail.cairahq.com` → HTTP only, browser warning
- After the redirect lands on Google's servers, the connection switches to HTTPS automatically
- The warning appears only on the initial redirect hop

**Root cause:** Google Admin console explicitly states it supports only HTTP connections for custom URLs. From the official documentation: *"If your domain uses a security measure that requires HTTPS connections, such as HTTP Strict Transport Security, you can't customize service addresses for your domain."*

**Production fix — Cloudflare proxy:**
For a production environment, the correct solution is to proxy the subdomains through Cloudflare (free plan):

1. Move `cairahq.com` DNS management to Cloudflare
2. Set CNAME records with Cloudflare proxy enabled (orange cloud)
3. Cloudflare terminates SSL for the subdomains and proxies to `ghs.googlehosted.com`
4. Users see a valid HTTPS connection with no browser warnings

This is the standard approach used by Google Workspace customers who require HTTPS vanity URLs. It was not implemented in this lab to avoid adding Cloudflare as a dependency, but is the recommended path for any production deployment.

---

*Part of [Caira HQ — Platform](../../../README.md) · Neil Chavez · Creator of things.*
