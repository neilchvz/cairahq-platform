# Workflows

This directory documents the automation layer of the Caira HQ platform. Automation is treated as a first-class platform concern — identity events drive automated actions across connected systems without manual intervention.

The goal is zero-touch lifecycle management. Every joiner, mover, and leaver action is handled by the system. Humans are involved only at approval gates.

## Structure

| Directory | Tool | Purpose |
|-----------|------|---------|
| okta/ | Okta Workflows | Event-driven automation triggered by identity lifecycle events |

## Design Principles

**Event-driven by default.** Automation triggers on real events — user created, user deactivated — not on schedules or manual runs.

**No manual notifications.** Admin and user notifications are automated. No human should need to remember to send a welcome email or offboarding alert.

**Auditable.** Every workflow execution is logged in Okta Workflows execution history. Every trigger, every action, every output is traceable.