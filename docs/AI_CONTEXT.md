# AI Context

This file provides architectural context for AI assistants working on ForgeBot.

## Project

ForgeBot is a self-hosted Git platform automation engine.

The project is plugin-first and provider-agnostic.

GitHub is currently the first provider.

The long-term vision includes:

- GitLab
- Bitbucket
- ForgeBot Cloud
- Marketplace
- AI-powered plugins

---

# Current Stage

Current phase:

Foundation.

Implemented:

- plugin system
- plugin registry
- configuration
- logger
- testing package
- GitHub event mapping
- repository abstraction (in progress)
- job abstraction (in progress)

Not implemented yet:

- GitHub App authentication
- repository provider implementation
- action model
- queue
- local admin UI

---

# Architecture Principles

Never introduce provider-specific concepts into Core.

Core must remain provider-agnostic.

GitHub-specific code belongs in:

@forgebot/github

Repository access belongs behind:

RepositoryReader

Plugin side effects should eventually be expressed as neutral Actions executed by the provider.

---

# Configuration

Deployment:

forgebot.instance.yml

Repository (planned):

.github/forgebot.yml

Plugins (planned):

forgebot.plugins.yml

Secrets:

.env

---

# Design Philosophy

Prefer:

- composition over inheritance
- small focused packages
- explicit interfaces
- strong typing
- immutable data
- provider abstractions
- testability

Avoid:

- provider logic inside Core
- hidden magic
- global state
- runtime reflection
- plugin side effects bypassing Core

---

# Development Workflow

Before introducing new abstractions:

1. Keep MVP simple.
2. Prefer interfaces before implementations.
3. Add extension points only when justified.
4. Minimize breaking changes.

When unsure:

Prefer consistency with existing architecture over introducing new patterns.
