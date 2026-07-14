# ForgeBot Project Context

> Living document for development. This document describes the current state of the project and should be kept up to date after major architectural changes.

## Vision

ForgeBot is a self-hosted Git platform automation engine.

Its goal is to automate repository workflows using plugins while remaining provider-agnostic and extensible.

Long-term goals:

- Self-hosted first
- ForgeBot Cloud
- Plugin marketplace
- Multiple providers (GitHub, GitLab, Bitbucket)
- AI-powered automation

---

# Current Architecture

Current packages:

- `@forgebot/core`
- `@forgebot/config`
- `@forgebot/github`
- `@forgebot/logger`
- `@forgebot/testing`
- `@forgebot/repository`
- `@forgebot/jobs`

Current app:

- `apps/worker`

---

# Current Event Flow

GitHub Webhook

↓

GitHub Event Mapping

↓

ForgeBot Event

↓

Plugin Runner

↓

Plugins

(Currently plugins execute directly. Action model will be introduced later.)

---

# Current Configuration

Deployment:

- `forgebot.instance.yml`

Repository (planned):

- `.github/forgebot.yml`

Plugins (planned):

- `forgebot.plugins.yml`

Secrets:

- `.env`

---

# Design Principles

- File-first configuration
- Plugin-first architecture
- Provider-agnostic domain model
- Small packages
- Strong typing
- Test-first where practical
- Self-hosted is a first-class product

---

# Not Yet Implemented

- GitHub App authentication
- Repository abstraction implementation
- Job queue
- Action model
- Repository configuration
- Local admin UI
- Marketplace
- Cloud edition
