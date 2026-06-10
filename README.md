# Caira HQ — Platform

Caira HQ is a personal infrastructure lab built and managed as a real organization on `cairahq.com`. This repository documents the platform layer — identity, access management, collaboration tooling, and automation — as it is built out.

The goal is not a sandbox of isolated experiments. It is a functioning, production-style environment designed around the same principles and tooling used at modern SaaS companies: identity as the control plane, automation as the default, and infrastructure managed as code.

---

## Why This Exists

My production experience spans Google Workspace, Entra ID, Microsoft 365, Azure, Active Directory, and Windows OS/macOS fleet management across multiple MSP clients. This lab exists to build and demonstrate hands-on depth in the tools and patterns that SaaS and platform engineering teams actually run — Okta, Google Workspace, Terraform, cloud infrastructure — applied in a real, working environment rather than documented in isolation.

Everything in this repo has been built, tested, and is actively running on `cairahq.com`.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  cairahq.com                                                │
│                                                             │
│  ┌─────────────────┐         ┌──────────────────────────┐   │
│  │  Okta           │         │  Google Workspace        │   │
│  │  Identity       │◄───────►│  Business Starter        │   │
│  │  Provider       │  SAML   │  Service Provider        │   │
│  │                 │  SCIM   │                          │   │
│  │  okta.cairahq   │         │  mail.cairahq.com        │   │
│  │  .com           │         │  drive.cairahq.com       │   │
│  └─────────────────┘         │  calendar.cairahq.com    │   │
│                              └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Current stack:**

| Layer | Tool | Purpose |
|-------|------|---------|
| Identity Provider | Okta Integrator Free Plan | SSO, MFA, SCIM provisioning, security policies |
| Collaboration | Google Workspace Business Starter | Email, Drive, Calendar |
| DNS | GoDaddy | Domain and subdomain management |
| Custom Domains | okta.cairahq.com | Okta tenant custom domain |
| Vanity URLs | mail / drive / calendar.cairahq.com | Google Workspace service shortcuts |

---

## Platform Layers

### Identity
The identity layer is built on Okta as the IdP, federating with Google Workspace via SAML 2.0. Users are provisioned automatically into Google Workspace via SCIM. Security policies follow NIST 800-63B principles — no password expiration, MFA required, session lifetimes aligned to risk tier.

→ [Identity layer documentation](./identity/README.md)

---

## Design Principles

**Identity is the control plane.** Access to every service flows through Okta. No direct Google password auth for standard users — every login is an Okta-authenticated session.

**NIST 800-63B alignment.** Password policy follows current NIST guidance: no arbitrary expiration, minimum length over complexity requirements, breach detection enabled, MFA required as a compensating control.

**Document the decisions, not just the steps.** Every configuration in this repo includes the reasoning behind it — threshold calculations, policy tradeoffs, known limitations, and production recommendations where the lab environment has constraints.

**Build vs buy.** Where battle-tested open-source tools exist (Escrow Buddy, etc.), use them. Where custom scripting adds genuine value, write it. Never build what already exists just to have code to show.

---

## Relationship to Infrastructure Portfolio

This repo is the applied environment. The [`infrastructure-portfolio`](https://github.com/neilchvz/infrastructure-portfolio) repo contains the reusable scripts, modules, and tooling used to build and manage this platform.

- **infrastructure-portfolio** → the toolbox
- **cairahq-platform** → the toolbox in production

---

## Status

| Component | Status |
|-----------|--------|
| Google Workspace tenant | ✅ Live |
| Okta tenant | ✅ Live |
| SAML SSO federation | ✅ Working |
| Custom domain (okta.cairahq.com) | ✅ Live |
| Vanity URLs (mail / drive / calendar) | ✅ Live |
| SCIM provisioning | ⚠️ Configured — pending Google new tenant trust resolution |
| MFA enrollment policy | ✅ Configured |
| Password policy | ✅ Configured |
| Session policy | ✅ Configured |
| Okta Workflows | 🔲 In progress |
| Conditional Access / Sign-on Policies | 🔲 Planned |

---

Neil Chavez · Creator of things.
